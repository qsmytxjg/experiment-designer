import { Eraser, Trash2 } from 'lucide-react';

export default function FillModeControls({
  currentColor,
  fillMode,
  isEraser,
  t,
  onClearSpecificColor,
  onEraser,
  onFillModeChange,
}) {
  return (
    <>
      <div className="segmented-control" aria-label={t.fillModeLabel}>
        <button
          className={fillMode === 'single' ? 'active' : ''}
          type="button"
          onClick={() => onFillModeChange('single')}
        >
          {t.fillModeSingle}
        </button>
        <button
          className={fillMode === 'triplicate-horizontal' ? 'active' : ''}
          type="button"
          onClick={() => onFillModeChange('triplicate-horizontal')}
        >
          {t.fillModeHoriz}
        </button>
        <button
          className={fillMode === 'triplicate-vertical' ? 'active' : ''}
          type="button"
          onClick={() => onFillModeChange('triplicate-vertical')}
        >
          {t.fillModeVert}
        </button>
      </div>

      <button className={isEraser ? 'tool-button active' : 'tool-button'} type="button" onClick={onEraser}>
        <Eraser size={18} />
        {t.eraserLabel}
      </button>
      <button className="tool-button danger-action" type="button" onClick={onClearSpecificColor}>
        <Trash2 size={18} />
        {t.clearSpecific}
        <span style={{ backgroundColor: currentColor }} />
      </button>
    </>
  );
}
