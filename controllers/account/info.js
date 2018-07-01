const request = require('superagent');
const Cryptr = require('cryptr');
const config = require('config');
const cryptr = new Cryptr(config.keys.accessToken);
const MySQL = require('lib/mysql');

/*
  GET /api/account
  REQUIRED
    token: string
  RETURN
    {
      loggedIn: boolean, subscription?: number, uid?: number, trial?: boolean,
      referral?: {
        type?: string, [type]?: string|number, data?: object,
        hasMadePurchase?: boolean
      },
      emails?: [{
        id: number, address: string
      }]
    }
  DESCRIPTION
    Creates a new session using access token
    Returns all MAIN emails on account and subscription expiration
*/
module.exports = async function(req, res) {
  const db = new MySQL();

  try {
    await db.getConnection();

    let sql, vars, rows, uid, row;

    // Validate access token
    if (req.query.token) {
      // [user_id, access_token]
      const token = cryptr.decrypt(req.query.token).split('-');

      // Invalid token
      if (!token[0] || !token[1]) throw 'Invalid token 1';

      (sql = `
        SELECT xyfir_id, subscription, referral, trial, admin
        FROM users WHERE user_id = ?
      `),
        (vars = [token[0]]),
        (rows = await db.query(sql, vars));

      if (!rows.length) throw 'User does not exist';

      // Validate access token with Xyfir Accounts
      const xaccResult = await request
        .get(config.addresses.xacc + 'api/service/13/user')
        .query({
          key: config.keys.xacc,
          xid: rows[0].xyfir_id,
          token: token[1]
        });

      if (xaccResult.body.error) throw 'Invalid token 2';

      (uid = token[0]), (row = rows[0]);
    }
    // Get info for dev user
    else if (config.environment.type == 'development') {
      (sql = `
        SELECT subscription, referral, trial, admin FROM users
        WHERE user_id = 1
      `),
        (rows = await db.query(sql));

      (uid = 1), (row = rows[0]);
    }
    // Force login
    else {
      throw 'Forcing login';
    }

    (sql = `
      SELECT email_id as id, address FROM primary_emails WHERE user_id = ?
    `),
      (vars = [uid]);

    const emails = await db.query(sql, vars);
    db.release();

    // Set session, return account info
    (req.session.uid = uid),
      (req.session.admin = !!row.admin),
      (req.session.subscription = row.subscription);

    res.json({
      loggedIn: true,
      uid,
      emails,
      subscription: row.subscription,
      referral: JSON.parse(row.referral),
      trial: !!row.trial
    });
  } catch (err) {
    db.release();
    req.session.destroy();
    res.json({ loggedIn: false });
  }
};
