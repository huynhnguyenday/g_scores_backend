import { Router } from 'express';
import { getScoreBySbd } from '../controllers/score.controller.js';
import {
  getDistribution,
  getDistributionAll,
  getTopGroupA,
} from '../controllers/report.controller.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true });
});

router.get('/scores/:sbd', getScoreBySbd);
router.get('/reports/distribution', getDistribution);
router.get('/reports/distribution/all', getDistributionAll);
router.get('/reports/top-group-a', getTopGroupA);

export default router;
