/** Map query param `subject` → Mongoose field */
export const SUBJECT_FIELDS = {
  toan: 'toan',
  ngu_van: 'nguVan',
  ngoai_ngu: 'ngoaiNgu',
  vat_li: 'vatLi',
  hoa_hoc: 'hoaHoc',
  sinh_hoc: 'sinhHoc',
  lich_su: 'lichSu',
  dia_li: 'diaLi',
  gdcd: 'gdcd',
} as const;

export type SubjectKey = keyof typeof SUBJECT_FIELDS;

export const SUBJECT_KEYS = Object.keys(SUBJECT_FIELDS) as SubjectKey[];

export function resolveSubjectField(subject: string): string | null {
  if (subject in SUBJECT_FIELDS) {
    return SUBJECT_FIELDS[subject as SubjectKey];
  }
  return null;
}
