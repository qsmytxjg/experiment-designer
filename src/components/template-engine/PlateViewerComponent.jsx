import { Grip } from 'lucide-react';

const ROW_LABELS = 'ABCDEFGHIJKLMNOP'.split('');

function getPlateDimensions(format) {
  if (format === '384-well') return { rows: 16, cols: 24 };
  if (format === '96-well') return { rows: 8, cols: 12 };
  if (format === '48-well') return { rows: 6, cols: 8 };
  return { rows: 4, cols: 6 };
}

export default function PlateViewerComponent({ data }) {
  const { rows, cols } = getPlateDimensions(data.format);
  const wells = data.wells || {};

  return (
    <section className="plate-viewer-card">
      <div className="plate-viewer-title">
        <Grip size={18} />
        <strong>{data.title || '布板预览'}</strong>
        <span>{data.format || '24-well'}</span>
      </div>

      <div className="plate-preview-scroll">
        <div className="plate-preview-grid" style={{ '--preview-cols': cols }}>
          <div className="plate-axis-cell" />
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div className="plate-axis-cell" key={`col-${colIndex}`}>
              {colIndex + 1}
            </div>
          ))}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div className="plate-preview-row" key={`row-${rowIndex}`}>
              <div className="plate-axis-cell">{ROW_LABELS[rowIndex]}</div>
              {Array.from({ length: cols }).map((_, colIndex) => {
                const wellId = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
                return (
                  <div
                    className="plate-preview-well"
                    key={wellId}
                    style={{ backgroundColor: wells[wellId] || '#f1f5f9' }}
                    title={wellId}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
