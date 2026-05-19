export const plateFormats = [
  { id: '6', label: '6-well', rows: 2, columns: 3 },
  { id: '12', label: '12-well', rows: 3, columns: 4 },
  { id: '24', label: '24-well', rows: 4, columns: 6 },
  { id: '48', label: '48-well', rows: 6, columns: 8 },
  { id: '96', label: '96-well', rows: 8, columns: 12 },
];

export const defaultGroups = [
  { id: 'control', name: 'Control', color: '#2f6f73' },
  { id: 'treatment-a', name: 'Treatment A', color: '#b85c38' },
  { id: 'treatment-b', name: 'Treatment B', color: '#635b8f' },
  { id: 'blank', name: 'Blank', color: '#8a8f98' },
];

export function getWellIds(format) {
  const wells = [];

  for (let rowIndex = 0; rowIndex < format.rows; rowIndex += 1) {
    const rowName = String.fromCharCode(65 + rowIndex);

    for (let column = 1; column <= format.columns; column += 1) {
      wells.push(`${rowName}${String(column).padStart(2, '0')}`);
    }
  }

  return wells;
}
