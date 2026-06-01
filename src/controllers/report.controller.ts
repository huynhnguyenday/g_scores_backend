import type { Request, Response } from 'express';
import { SUBJECT_KEYS, resolveSubjectField } from '../constants/subjects.js';
import {
  getAllSubjectsDistribution,
  getScoreDistribution,
  getTop10GroupA,
} from '../services/report.service.js';

export async function getDistribution(req: Request, res: Response): Promise<void> {
  const subject = String(req.query.subject ?? '').trim();
  const field = resolveSubjectField(subject);

  if (!field) {
    res.status(400).json({
      success: false,
      message: 'subject không hợp lệ',
      allowedSubjects: SUBJECT_KEYS,
    });
    return;
  }

  const data = await getScoreDistribution(field, subject);
  res.json({ success: true, data });
}

export async function getDistributionAll(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: await getAllSubjectsDistribution() });
}

export async function getTopGroupA(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: await getTop10GroupA() });
}
