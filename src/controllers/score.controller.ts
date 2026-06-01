import type { Request, Response } from 'express';
import { StudentScore } from '../models/StudentScore.js';

export async function getScoreBySbd(req: Request, res: Response): Promise<void> {
  const sbd = String(req.params.sbd ?? '').trim();
  if (!sbd) {
    res.status(400).json({ success: false, message: 'SBD không hợp lệ' });
    return;
  }

  const score = await StudentScore.findOne({ sbd }).lean();
  if (!score) {
    res.status(404).json({ success: false, message: 'Không tìm thấy điểm' });
    return;
  }

  res.json({ success: true, data: score });
}
