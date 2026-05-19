import { Maximize, MousePointerClick, ZoomIn, ZoomOut } from 'lucide-react';

export default function CanvasToolbar({ selectedFormat, t, zoom, onZoomChange }) {
  return (
    <div className="canvas-toolbar">
      <span>
        <MousePointerClick size={15} />
        {selectedFormat.type === 'plate' ? t.plateHint : t.gelHint}
      </span>
      <div className="zoom-controls">
        <button
          type="button"
          onClick={() => onZoomChange((value) => Math.max(0.5, value - 0.25))}
          title={t.zoomOut}
        >
          <ZoomOut size={16} />
        </button>
        <strong>{Math.round(zoom * 100)}%</strong>
        <button
          type="button"
          onClick={() => onZoomChange((value) => Math.min(3, value + 0.25))}
          title={t.zoomIn}
        >
          <ZoomIn size={16} />
        </button>
        <button type="button" onClick={() => onZoomChange(1)} title={t.zoomReset}>
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
}
