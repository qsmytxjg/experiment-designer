import { ROW_LABELS } from './plateColorizerData.js';

export default function PlateCanvas({
  colors,
  isDrawing,
  selectedFormat,
  onColorWell,
  onColClick,
  onDrawingChange,
  onRowClick,
}) {
  const { rows, cols } = selectedFormat;
  const marginTop = 115;
  const marginLeft = 80;
  const marginBottom = 45;
  const marginRight = 45;
  const cellWidth = (900 - marginLeft - marginRight) / cols;
  const cellHeight = (650 - marginTop - marginBottom) / rows;
  const radius = Math.min(cellWidth, cellHeight) * 0.4;
  const fontSize = cols <= 3 ? 32 : cols <= 4 ? 28 : cols <= 6 ? 22 : cols <= 8 ? 18 : cols <= 12 ? 15 : 11;
  const elements = [];

  for (let colIndex = 0; colIndex < cols; colIndex += 1) {
    const cx = marginLeft + colIndex * cellWidth + cellWidth / 2;
    elements.push(
      <text
        className="svg-index"
        key={`col-${colIndex}`}
        x={cx}
        y={marginTop - Math.max(20, fontSize * 0.7)}
        textAnchor="middle"
        fontSize={fontSize}
        onClick={() => onColClick(colIndex)}
      >
        {colIndex + 1}
      </text>,
    );
  }

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    const cy = marginTop + rowIndex * cellHeight + cellHeight / 2;
    elements.push(
      <text
        className="svg-index"
        key={`row-${rowIndex}`}
        x={marginLeft - 20}
        y={cy + fontSize * 0.35}
        textAnchor="end"
        fontSize={fontSize}
        onClick={() => onRowClick(rowIndex)}
      >
        {ROW_LABELS[rowIndex]}
      </text>,
    );
  }

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    for (let colIndex = 0; colIndex < cols; colIndex += 1) {
      const id = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
      elements.push(
        <circle
          className="svg-well"
          key={id}
          cx={marginLeft + colIndex * cellWidth + cellWidth / 2}
          cy={marginTop + rowIndex * cellHeight + cellHeight / 2}
          r={radius}
          fill={colors[id] || 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
          onMouseDown={(event) => {
            event.preventDefault();
            onDrawingChange(true);
            onColorWell(id);
          }}
          onMouseEnter={() => {
            if (isDrawing) onColorWell(id);
          }}
          onDoubleClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onColorWell(id, true);
          }}
        />,
      );
    }
  }

  return elements;
}
