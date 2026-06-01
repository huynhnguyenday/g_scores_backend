import { SUBJECT_FIELDS, SUBJECT_KEYS } from '../constants/subjects.js';
import { StudentScore } from '../models/StudentScore.js';

export async function getScoreDistribution(field: string, subjectKey: string) {
  const [result] = await StudentScore.aggregate<{
    gte8: number;
    from6to8: number;
    from4to6: number;
    lt4: number;
    total: number;
  }>([
    { $match: { [field]: { $type: 'number' } } },
    {
      $group: {
        _id: null,
        gte8: { $sum: { $cond: [{ $gte: [`$${field}`, 8] }, 1, 0] } },
        from6to8: {
          $sum: {
            $cond: [
              { $and: [{ $gte: [`$${field}`, 6] }, { $lt: [`$${field}`, 8] }] },
              1,
              0,
            ],
          },
        },
        from4to6: {
          $sum: {
            $cond: [
              { $and: [{ $gte: [`$${field}`, 4] }, { $lt: [`$${field}`, 6] }] },
              1,
              0,
            ],
          },
        },
        lt4: { $sum: { $cond: [{ $lt: [`$${field}`, 4] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
  ]);

  return {
    subject: subjectKey,
    bands: {
      gte8: result?.gte8 ?? 0,
      from6to8: result?.from6to8 ?? 0,
      from4to6: result?.from4to6 ?? 0,
      lt4: result?.lt4 ?? 0,
    },
    totalWithScore: result?.total ?? 0,
  };
}

export async function getTop10GroupA() {
  return StudentScore.aggregate([
    {
      $match: {
        toan: { $type: 'number' },
        vatLi: { $type: 'number' },
        hoaHoc: { $type: 'number' },
      },
    },
    { $addFields: { totalGroupA: { $add: ['$toan', '$vatLi', '$hoaHoc'] } } },
    { $sort: { totalGroupA: -1, sbd: 1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        sbd: 1,
        toan: 1,
        vatLi: 1,
        hoaHoc: 1,
        totalGroupA: 1,
      },
    },
  ]);
}

export function getAllSubjectsDistribution() {
  return Promise.all(
    SUBJECT_KEYS.map((key) => getScoreDistribution(SUBJECT_FIELDS[key], key)),
  );
}
