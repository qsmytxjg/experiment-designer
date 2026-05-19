import { List } from 'lucide-react';

export default function LegendSection({ activeColors, legends, t, onLegendLabelChange }) {
  return (
    <section className="tool-card legend-card">
      <h2>
        <List size={16} />
        {t.legendTitle}
      </h2>
      {activeColors.length === 0 ? (
        <p>{t.legendSub}</p>
      ) : (
        <div className="legend-editor">
          {activeColors.map((color) => (
            <label key={color}>
              <span style={{ backgroundColor: color }} />
              <input
                value={legends[color] || ''}
                onChange={(event) => onLegendLabelChange(color, event.target.value)}
                placeholder={t.legendPlaceholder}
              />
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
