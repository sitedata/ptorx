import { Request, Response } from 'express';
import { MySQL } from 'lib/MySQL';

/**
 * DELETE /api/6/modifiers/:mod
 * @param {object} req
 * @param {object} req.params
 * @param {number} req.params.mod
 */
export async function api_deleteModifier(
  req: Request,
  res: Response
): Promise<void> {
  const db = new MySQL();
  try {
    await db.query(
      `DELETE FROM modifiers WHERE modifierId = ? AND userId = ?`,
      [req.params.mod, req.session.uid]
    );
    res.status(200).json({});
  } catch (err) {
    res.status(400).json({ error: err });
  }
  db.release();
}
