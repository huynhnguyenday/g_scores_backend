type CsvRow = Record<string, string>;

const SCORE_COLUMNS: Array<[string, string]> = [
  ['toan', 'toan'],
  ['nguVan', 'ngu_van'],
  ['ngoaiNgu', 'ngoai_ngu'],
  ['vatLi', 'vat_li'],
  ['hoaHoc', 'hoa_hoc'],
  ['sinhHoc', 'sinh_hoc'],
  ['lichSu', 'lich_su'],
  ['diaLi', 'dia_li'],
  ['gdcd', 'gdcd'],
];

function parseScore(value: string | undefined): number | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
}

export function csvRowToDocument(row: CsvRow): Record<string, unknown> {
  const doc: Record<string, unknown> = { sbd: row.sbd?.trim() ?? '' };

  for (const [field, csvCol] of SCORE_COLUMNS) {
    const score = parseScore(row[csvCol]);
    if (score !== undefined) doc[field] = score;
  }

  const ma = row.ma_ngoai_ngu?.trim();
  if (ma) doc.maNgoaiNgu = ma;

  return doc;
}
