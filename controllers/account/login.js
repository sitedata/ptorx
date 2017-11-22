const request = require('superagent');
const crypto = require('lib/crypto');
const moment = require('moment');
const MySQL = require('lib/mysql');

const config = require('config');

/*
  POST api/account/login
  REQUIRED
    xid: string, auth: string
  OPTIONAL
    referral: object
  RETURN
    { error: boolean, accessToken?: string }
  DESCRIPTION
    Register or login user
*/
module.exports = async function(req, res) {

  const db = new MySQL;

  try {
    // Get user's data from xyAccounts
    const xaccResult = await request
      .get(
        config.addresses.xacc + 'api/service/13/user'
      )
      .query({
        key: config.keys.xacc, xid: req.body.xid, token: req.body.auth
      });
    
    if (xaccResult.body.error) throw '-';

    await db.getConnection();

    // Get user data from db
    let sql = `
      SELECT user_id, subscription, admin FROM users WHERE xyfir_id = ?
    `,
    vars = [
      req.body.xid
    ],
    rows = await db.query(sql, vars);

    // First login: create user's account
    if (!rows.length) {
      sql = `
        INSERT INTO users SET ?
      `;
      const insert = {
        xyfir_id: req.body.xid, email: xaccResult.body.email,
        subscription: moment().add(14, 'days').unix() * 1000
      };

      const referral = req.body.referral || {};

      // Validate xyAccounts affiliate promo code
      if (referral.type == 'promo') {
        try {
          const xaccResult2 = await request
            .post(config.address.xacc + 'api/affiliate/signup')
            .send({
              service: 13, serviceKey: config.keys.xacc,
              promoCode: referral.promo
            });

          if (xaccResult2.body.error || xaccResult2.body.promo != 4)
            referral = {};
        }
        catch (e) { return; }
      }

      insert.referral = JSON.stringify(referral);

      // Create user
      const result = await db.query(sql, insert);
      
      if (!result.affectedRows) throw '--';

      // Add user's account email to primary_emails
      sql = `
        INSERT INTO primary_emails (user_id, address) VALUES (?, ?)
      `,
      vars = [
        result.insertId, insert.email
      ];
      
      await db.query(sql, vars);
      db.release();

      req.session.uid = result.insertId,
      req.session.admin = false,
      req.session.subscription = insert.subscription;

      res.json({
        error: false, accessToken: crypto.encrypt(
          result.insertId + '-' + xaccResult.body.accessToken,
          config.keys.accessToken
        )
      });
    }
    // Normal login: update user's data
    else {
      sql = `
        UPDATE users SET email = ? WHERE user_id = ?
      `,
      vars = [
        xaccResult.body.email, rows[0].user_id
      ];

      const result = await db.query(sql, vars);
      db.release();

      if (!result.affectedRows) throw '---';

      req.session.uid = rows[0].user_id,
      req.session.admin = !!rows[0].admin,
      req.session.subscription = rows[0].subscription;

      res.json({
        error: false, accessToken: crypto.encrypt(
          rows[0].user_id + '-' + xaccResult.body.accessToken,
          config.keys.accessToken
        )
      });
    }
  }
  catch (err) {
    db.release();
    res.json({ error: true });
  }

};