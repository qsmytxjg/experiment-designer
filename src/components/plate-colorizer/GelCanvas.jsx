export default function GelCanvas({ colors, isDrawing, selectedFormat, onColorWell, onDrawingChange }) {
  const { lanes } = selectedFormat;
  const marginX = 80;
  const marginTop = 100;
  const laneAreaWidth = 900 - 2 * marginX;
  const laneWidth = laneAreaWidth / lanes;
  const elements = [
    <rect
      key="gel-base"
      x={marginX - 20}
      y={marginTop - 30}
      width={laneAreaWidth + 40}
      height={530}
      fill="#f8fafc"
      stroke="#cbd5e1"
      strokeWidth="2"
      rx="4"
    />,
  ];

  for (let index = 0; index < lanes; index += 1) {
    const id = `lane-${index + 1}`;
    const x = marginX + index * laneWidth;
    elements.push(
      <text
        className="svg-index"
        key={`lane-num-${index}`}
        x={x + laneWidth / 2}
        y={marginTop - 10}
        textAnchor="middle"
        fontSize="16"
        onClick={() => onColorWell(id)}
      >
        {index + 1}
      </text>,
      <rect
        className="svg-well"
        key={id}
        x={x + laneWidth * 0.15}
        y={marginTop + 10}
        width={laneWidth * 0.7}
        height={40}
        fill={colors[id] || '#e2e8f0'}
        stroke="#94a3b8"
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
      <rect
        key={`lane-body-${index}`}
        x={x + laneWidth * 0.15}
        y={marginTop + 60}
        width={laneWidth * 0.7}
        height={470}
        fill="transparent"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="4 2"
        style={{ pointerEvents: 'none' }}
      />,
    );
  }

  return elements;
}
