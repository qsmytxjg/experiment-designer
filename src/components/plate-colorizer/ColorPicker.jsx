import { Hash } from 'lucide-react';
import { FLAT_SCHEMES, SCHEME_GROUPS } from './plateColorizerData.js';

export default function ColorPicker({
  currentColor,
  hexInput,
  isEraser,
  lang,
  selectedSchemeKey,
  t,
  onColorPickerChange,
  onHexInputChange,
  onSchemeChange,
  onSelectColor,
}) {
  return (
    <>
      <label className="field-label">
        {t.colorSchemeLabel}
        <select value={selectedSchemeKey} onChange={(event) => onSchemeChange(event.target.value)}>
          {SCHEME_GROUPS.map((group) => (
            <optgroup key={group.label.en} label={group.label[lang]}>
              {group.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name[lang]}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <div className="color-palette">
        {FLAT_SCHEMES[selectedSchemeKey].colors.map((color) => (
          <button
            className={!isEraser && currentColor.toLowerCase() === color.toLowerCase() ? 'color-dot active' : 'color-dot'}
            key={color}
            type="button"
            onClick={() => onSelectColor(color)}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      <div className="color-input-row">
        <input className="native-color" type="color" value={currentColor} onChange={onColorPickerChange} />
        <label className="input-with-icon">
          <Hash size={16} />
          <input value={hexInput} onChange={onHexInputChange} maxLength={7} />
        </label>
      </div>
    </>
  );
}
