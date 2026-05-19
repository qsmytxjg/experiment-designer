import CanvasToolbar from './CanvasToolbar.jsx';
import GelCanvas from './GelCanvas.jsx';
import PlateCanvas from './PlateCanvas.jsx';

export default function ColorizerCanvas({ colorizer }) {
  return (
    <section className="canvas-panel">
      <CanvasToolbar
        selectedFormat={colorizer.selectedFormat}
        t={colorizer.t}
        zoom={colorizer.zoom}
        onZoomChange={colorizer.setZoom}
      />

      <div className="canvas-scroll" onMouseLeave={() => colorizer.setIsDrawing(false)}>
        <div className="canvas-center">
          <div
            className="svg-frame"
            style={{ width: `${1100 * colorizer.zoom}px`, height: `${650 * colorizer.zoom}px` }}
          >
            <svg
              ref={colorizer.svgRef}
              viewBox="0 0 1100 650"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100%" height="100%" fill="white" rx="8" />
              {colorizer.title && (
                <text x="450" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">
                  {colorizer.title}
                </text>
              )}
              {colorizer.selectedFormat.type === 'plate' && (
                <rect x="15" y="40" width="870" height="595" fill="none" stroke="#cbd5e1" strokeWidth="2" rx="8" />
              )}
              {colorizer.selectedFormat.type === 'plate' ? (
                <PlateCanvas
                  colors={colorizer.colors}
                  isDrawing={colorizer.isDrawing}
                  selectedFormat={colorizer.selectedFormat}
                  onColorWell={colorizer.handleColorWell}
                  onColClick={colorizer.handleColClick}
                  onDrawingChange={colorizer.setIsDrawing}
                  onRowClick={colorizer.handleRowClick}
                />
              ) : (
                <GelCanvas
                  colors={colorizer.colors}
                  isDrawing={colorizer.isDrawing}
                  selectedFormat={colorizer.selectedFormat}
                  onColorWell={colorizer.handleColorWell}
                  onDrawingChange={colorizer.setIsDrawing}
                />
              )}
              {colorizer.activeColors.length > 0 && (
                <g transform="translate(910, 60)">
                  <text x="0" y="0" fontSize="16" fontWeight="bold" fill="#475569">
                    {colorizer.t.legendExportHeader}
                  </text>
                  {colorizer.activeColors.map((color, index) => (
                    <g key={`legend-svg-${color}`} transform={`translate(0, ${25 + index * 30})`}>
                      <rect width="20" height="20" fill={color} rx="4" stroke="#cbd5e1" strokeWidth="1" />
                      <text x="30" y="15" fontSize="14" fill="#333">
                        {colorizer.legends[color] || ''}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
