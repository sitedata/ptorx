import { buildModifierData } from 'lib/modifiers/build-data';
import { Request, Response } from 'express';
import { validateModifier } from 'lib/modifiers/validate';
import { MySQL } from 'lib/MySQL';

export async function api_editModifier(
  req: Request,
  res: Response
): Promise<void> {
  const db = new MySQL();

  try {
    validateModifier(req.body);

    let sql = `
        UPDATE modifiers SET name = ?, description = ?, type = ?, data = ?
        WHERE modifierId = ? AND userId = ?
      `,
      vars = [
        req.body.name,
        req.body.description,
        req.body.type,
        buildModifierData(req.body),
        req.params.mod,
        req.session.uid
      ];

    const result = await db.query(sql, vars);

    if (!result.affectedRows) throw 'An unknown error occured';

    (sql = `
      SELECT proxyEmailId as id FROM links WHERE modifierId = ?
    `),
      (vars = [req.params.mod]);

    const rows = await db.query(sql, vars);
    db.release();

    res.status(200).json({ message: '' });
  } catch (err) {
    db.release();
    res.status(400).json({ error: err });
  }
}
