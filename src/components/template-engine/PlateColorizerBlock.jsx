import { useEffect, useRef, useState } from 'react';
import {
  Download,
  Eraser,
  Hash,
  List,
  Maximize,
  MousePointerClick,
  Palette,
  RefreshCw,
  Trash2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { FLAT_SCHEMES, FORMATS, ROW_LABELS, SCHEME_GROUPS } from '../plate-colorizer/plateColorizerData.js';

const DEFAULT_COLOR = FLAT_SCHEMES.basic.colors[0];

function getFormat(formatId) {
  return FORMATS.find((format) => format.id === formatId) || FORMATS.find((format) => format.id === '96-well');
}

export default function PlateColorizerBlock({ data, onChange }) {
  const title = data.title || '实验布板设计图';
  const selectedFormat = getFormat(data.formatId || '96-well');
  const colors = data.colors || {};
  const legends = data.legends || {};
  const activeColors = [...new Set(Object.values(colors))].filter(Boolean);

  const [selectedSchemeKey, setSelectedSchemeKey] = useState('basic');
  const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);
  const [hexInput, setHexInput] = useState(DEFAULT_COLOR);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fillMode, setFillMode] = useState('single');
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  function updateData(updates) {
    onChange({ ...data, ...updates });
  }

  function selectColor(color) {
    setCurrentColor(color);
    setHexInput(color);
    setIsEraser(false);
  }

  function handleHexInputChange(event) {
    const value = event.target.value;
    setHexInput(value);
    setIsEraser(false);
    if (/^#[0-9A-Fa-f]{6}$/i.test(value)) {
      setCurrentColor(value);
    }
  }

  function handleColorPickerChange(event) {
    const value = event.target.value.toUpperCase();
    selectColor(value);
  }

  function applyColorToWell(wellId, forceClear = false) {
    const nextColors = { ...colors };
    const applyColor = (targetId) => {
      if (isEraser || forceClear) {
        delete nextColors[targetId];
      } else {
        nextColors[targetId] = currentColor;
      }
    };

    if (fillMode !== 'single' && selectedFormat.type === 'plate') {
      const match = wellId.match(/([A-Z])(\d+)/);
      if (match) {
        const rowLabel = match[1];
        const colNum = Number.parseInt(match[2], 10);
        const rowIndex = ROW_LABELS.indexOf(rowLabel);

        for (let index = 0; index < 3; index += 1) {
          if (fillMode === 'triplicate-horizontal' && colNum + index <= selectedFormat.cols) {
            applyColor(`${rowLabel}${colNum + index}`);
          }
          if (fillMode === 'triplicate-vertical' && rowIndex + index < selectedFormat.rows) {
            applyColor(`${ROW_LABELS[rowIndex + index]}${colNum}`);
          }
        }
        updateData({ colors: nextColors });
        return;
      }
    }

    applyColor(wellId);
    updateData({ colors: nextColors });
  }

  function fillColumn(colIndex) {
    const nextColors = { ...colors };
    const allMatch = Array.from({ length: selectedFormat.rows }).every((_, rowIndex) => {
      const wellId = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
      return colors[wellId] === currentColor;
    });

    for (let rowIndex = 0; rowIndex < selectedFormat.rows; rowIndex += 1) {
      const wellId = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
      if (isEraser || allMatch) delete nextColors[wellId];
      else nextColors[wellId] = currentColor;
    }
    updateData({ colors: nextColors });
  }

  function fillRow(rowIndex) {
    const nextColors = { ...colors };
    const allMatch = Array.from({ length: selectedFormat.cols }).every((_, colIndex) => {
      const wellId = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
      return colors[wellId] === currentColor;
    });

    for (let colIndex = 0; colIndex < selectedFormat.cols; colIndex += 1) {
      const wellId = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
      if (isEraser || allMatch) delete nextColors[wellId];
      else nextColors[wellId] = currentColor;
    }
    updateData({ colors: nextColors });
  }

  function clearSpecificColor() {
    updateData({
      colors: Object.fromEntries(
        Object.entries(colors).filter(([, color]) => color.toLowerCase() !== currentColor.toLowerCase()),
      ),
    });
  }

  function exportAsImage() {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    const scale = 3;
    canvas.width = 1100 * scale;
    canvas.height = 650 * scale;

    image.onload = () => {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const link = document.createElement('a');
      link.download = `${title || selectedFormat.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }

  function renderPlate() {
    const { rows, cols } = selectedFormat;
    const marginTop = 115;
    const marginLeft = 80;
    const cellWidth = (900 - marginLeft - 45) / cols;
    const cellHeight = (650 - marginTop - 45) / rows;
    const radius = Math.min(cellWidth, cellHeight) * 0.4;
    const fontSize = cols <= 3 ? 32 : cols <= 4 ? 28 : cols <= 6 ? 22 : cols <= 8 ? 18 : cols <= 12 ? 15 : 11;
    const elements = [];

    for (let colIndex = 0; colIndex < cols; colIndex += 1) {
      const cx = marginLeft + colIndex * cellWidth + cellWidth / 2;
      elements.push(
        <text
          className="template-plate-index"
          key={`col-${colIndex}`}
          x={cx}
          y={marginTop - Math.max(20, fontSize * 0.7)}
          textAnchor="middle"
          fontSize={fontSize}
          onClick={() => fillColumn(colIndex)}
        >
          {colIndex + 1}
        </text>,
      );
    }

    for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
      const cy = marginTop + rowIndex * cellHeight + cellHeight / 2;
      elements.push(
        <text
          className="template-plate-index"
          key={`row-${rowIndex}`}
          x={marginLeft - 20}
          y={cy + fontSize * 0.35}
          textAnchor="end"
          fontSize={fontSize}
          onClick={() => fillRow(rowIndex)}
        >
          {ROW_LABELS[rowIndex]}
        </text>,
      );
    }

    for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
      for (let colIndex = 0; colIndex < cols; colIndex += 1) {
        const wellId = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
        elements.push(
          <circle
            className="template-plate-well"
            key={wellId}
            cx={marginLeft + colIndex * cellWidth + cellWidth / 2}
            cy={marginTop + rowIndex * cellHeight + cellHeight / 2}
            r={radius}
            fill={colors[wellId] || 'transparent'}
            stroke="#64748b"
            strokeWidth="1.5"
            onMouseDown={(event) => {
              event.preventDefault();
              setIsDrawing(true);
              applyColorToWell(wellId);
            }}
            onMouseEnter={() => {
              if (isDrawing) applyColorToWell(wellId);
            }}
            onDoubleClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              applyColorToWell(wellId, true);
            }}
          />,
        );
      }
    }

    return elements;
  }

  function renderGel() {
    const { lanes } = selectedFormat;
    const marginX = 80;
    const marginTop = 100;
    const laneAreaWidth = 900 - 2 * marginX;
    const laneWidth = laneAreaWidth / lanes;
    const elements = [
      <rect key="gel-base" x={marginX - 20} y={marginTop - 30} width={laneAreaWidth + 40} height={530} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="4" />,
    ];

    for (let index = 0; index < lanes; index += 1) {
      const laneId = `lane-${index + 1}`;
      const x = marginX + index * laneWidth;
      elements.push(
        <text className="template-plate-index" key={`lane-num-${index}`} x={x + laneWidth / 2} y={marginTop - 10} textAnchor="middle" fontSize="16" onClick={() => applyColorToWell(laneId)}>
          {index + 1}
        </text>,
        <rect
          className="template-plate-well"
          key={laneId}
          x={x + laneWidth * 0.15}
          y={marginTop + 10}
          width={laneWidth * 0.7}
          height={40}
          fill={colors[laneId] || '#e2e8f0'}
          stroke="#94a3b8"
          strokeWidth="1.5"
          onMouseDown={(event) => {
            event.preventDefault();
            setIsDrawing(true);
            applyColorToWell(laneId);
          }}
          onMouseEnter={() => {
            if (isDrawing) applyColorToWell(laneId);
          }}
          onDoubleClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            applyColorToWell(laneId, true);
          }}
        />,
        <rect key={`lane-body-${index}`} x={x + laneWidth * 0.15} y={marginTop + 60} width={laneWidth * 0.7} height={470} fill="transparent" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 2" style={{ pointerEvents: 'none' }} />,
      );
    }

    return elements;
  }

  return (
    <section className="template-plate-card">
      <div className="template-plate-header">
        <div className="template-plate-title">
          <Palette size={20} />
          <select
            value={selectedFormat.id}
            onChange={(event) => updateData({ formatId: event.target.value, colors: {}, legends: {} })}
          >
            {FORMATS.map((format) => (
              <option key={format.id} value={format.id}>
                {format.name}
              </option>
            ))}
          </select>
          <input value={title} onChange={(event) => updateData({ title: event.target.value })} placeholder="实验布板设计图" />
        </div>
        <div className="template-plate-actions">
          <button type="button" onClick={() => updateData({ colors: {}, legends: {} })}>
            <RefreshCw size={16} />
            清空
          </button>
          <button className="primary" type="button" onClick={exportAsImage}>
            <Download size={16} />
            PNG
          </button>
        </div>
      </div>

      <div className="template-plate-toolbar">
        <select value={selectedSchemeKey} onChange={(event) => setSelectedSchemeKey(event.target.value)}>
          {SCHEME_GROUPS.map((group) => (
            <optgroup key={group.label.en} label={group.label['zh-CN']}>
              {group.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name['zh-CN']}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <div className="template-plate-colors">
          {FLAT_SCHEMES[selectedSchemeKey].colors.map((color) => (
            <button
              className={!isEraser && currentColor.toLowerCase() === color.toLowerCase() ? 'active' : ''}
              key={color}
              type="button"
              onClick={() => selectColor(color)}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <input className="template-native-color" type="color" value={currentColor} onChange={handleColorPickerChange} />
        <label className="template-hex-input">
          <Hash size={14} />
          <input value={hexInput} onChange={handleHexInputChange} maxLength={7} />
        </label>

        <div className="template-fill-mode">
          <button className={fillMode === 'single' ? 'active' : ''} type="button" onClick={() => setFillMode('single')}>单孔</button>
          <button className={fillMode === 'triplicate-horizontal' ? 'active' : ''} type="button" onClick={() => setFillMode('triplicate-horizontal')}>横向 x3</button>
          <button className={fillMode === 'triplicate-vertical' ? 'active' : ''} type="button" onClick={() => setFillMode('triplicate-vertical')}>竖向 x3</button>
        </div>

        <button className={isEraser ? 'template-tool-button active' : 'template-tool-button'} type="button" onClick={() => setIsEraser(true)}>
          <Eraser size={16} />
          橡皮擦
        </button>
        <button className="template-tool-button danger" type="button" onClick={clearSpecificColor}>
          <Trash2 size={16} />
          清除当前色
        </button>
      </div>

      <div className="template-plate-canvas" onMouseLeave={() => setIsDrawing(false)}>
        <div className="template-plate-canvas-top">
          <span>
            <MousePointerClick size={15} />
            {selectedFormat.type === 'plate' ? '点击行列标签可整行/列填色；双击孔位清除' : '点击或拖拽上样孔着色；双击清除'}
          </span>
          <div className="template-zoom-controls">
            <button type="button" onClick={() => setZoom((value) => Math.max(0.5, value - 0.2))}><ZoomOut size={15} /></button>
            <strong>{Math.round(zoom * 100)}%</strong>
            <button type="button" onClick={() => setZoom((value) => Math.min(2.5, value + 0.2))}><ZoomIn size={15} /></button>
            <button type="button" onClick={() => setZoom(1)}><Maximize size={15} /></button>
          </div>
        </div>

        <div className="template-plate-scroll">
          <div className="template-plate-frame" style={{ width: `${1100 * zoom}px`, height: `${650 * zoom}px` }}>
            <svg ref={svgRef} viewBox="0 0 1100 650" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="white" rx="10" />
              <text x="450" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">
                {title}
              </text>
              {selectedFormat.type === 'plate' && <rect x="15" y="40" width="870" height="595" fill="none" stroke="#cbd5e1" strokeWidth="2" rx="8" />}
              {selectedFormat.type === 'plate' ? renderPlate() : renderGel()}
              {activeColors.length > 0 && (
                <g transform="translate(910, 60)">
                  <text x="0" y="0" fontSize="16" fontWeight="bold" fill="#475569">Legend</text>
                  {activeColors.map((color, index) => (
                    <g key={`legend-${color}`} transform={`translate(0, ${25 + index * 30})`}>
                      <rect width="20" height="20" fill={color} rx="4" stroke="#cbd5e1" strokeWidth="1" />
                      <text x="30" y="15" fontSize="14" fill="#333">{legends[color] || ''}</text>
                    </g>
                  ))}
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      <div className="template-plate-legend">
        <h3><List size={16} /> 图例说明</h3>
        {activeColors.length === 0 ? (
          <p>着色后，这里会自动出现已使用的颜色。</p>
        ) : (
          <div>
            {activeColors.map((color) => (
              <label key={color}>
                <span style={{ backgroundColor: color }} />
                <input
                  value={legends[color] || ''}
                  onChange={(event) => updateData({ legends: { ...legends, [color]: event.target.value } })}
                  placeholder="输入标签..."
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
