import mongoose, { Schema } from 'mongoose';

const studentScoreSchema = new Schema(
  {
    sbd: { type: String, required: true, unique: true, index: true },
    toan: Number,
    nguVan: Number,
    ngoaiNgu: Number,
    vatLi: Number,
    hoaHoc: Number,
    sinhHoc: Number,
    lichSu: Number,
    diaLi: Number,
    gdcd: Number,
    maNgoaiNgu: String,
  },
  { collection: 'student_scores' },
);

export const StudentScore = mongoose.model('StudentScore', studentScoreSchema);
