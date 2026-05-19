import { Type } from 'lucide-react';
import { FORMATS } from './plateColorizerData.js';

export default function BasicSettings({ selectedFormat, title, t, onFormatChange, onTitleChange }) {
  return (
    <section className="tool-card">
      <h2>{t.basicSettings}</h2>
      <select value={selectedFormat.id} onChange={onFormatChange}>
        {FORMATS.map((format) => (
          <option key={format.id} value={format.id}>
            {t.formats[format.id]}
          </option>
        ))}
      </select>
      <label className="input-with-icon">
        <Type size={18} />
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={t.titlePlaceholder}
        />
      </label>
    </section>
  );
}
