import { useEffect, useRef, useState } from 'react';
import {
  Download,
  Eraser,
  Globe,
  Hash,
  List,
  Maximize,
  MousePointerClick,
  Palette,
  RefreshCw,
  Trash2,
  Type,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const FORMATS = [
  { id: '6-well', name: '6 孔板 (6-well)', type: 'plate', rows: 2, cols: 3 },
  { id: '12-well', name: '12 孔板 (12-well)', type: 'plate', rows: 3, cols: 4 },
  { id: '24-well', name: '24 孔板 (24-well)', type: 'plate', rows: 4, cols: 6 },
  { id: '48-well', name: '48 孔板 (48-well)', type: 'plate', rows: 6, cols: 8 },
  { id: '96-well', name: '96 孔板 (96-well)', type: 'plate', rows: 8, cols: 12 },
  { id: '384-well', name: '384 孔板 (384-well)', type: 'plate', rows: 16, cols: 24 },
  { id: 'wb-10', name: '10 泳道 WB', type: 'gel', lanes: 10 },
  { id: 'wb-12', name: '12 泳道 WB', type: 'gel', lanes: 12 },
  { id: 'wb-15', name: '15 泳道 WB', type: 'gel', lanes: 15 },
];

const TRANSLATIONS = {
  'zh-TW': {
    title: '實驗布板著色器',
    clearCanvas: '清空畫布',
    exportImage: '導出圖片',
    basicSettings: '1. 基本設定',
    coloringTools: '2. 著色工具',
    legendTitle: '3. 圖例說明 (自動生成)',
    legendSub: '在右側畫布上著色後，這裡會自動出現您使用的顏色，您可以為它們添加文字標籤。',
    legendPlaceholder: '例: Control, 10μM...',
    legendExportHeader: '圖例 (Legend)',
    defaultPlateTitle: '實驗布板設計圖',
    titlePlaceholder: '輸入圖片標題...',
    fillModeLabel: '填色模式 (三複孔設定):',
    fillModeSingle: '單孔',
    fillModeHoriz: '橫向 x3',
    fillModeVert: '豎向 x3',
    eraserLabel: '橡皮擦 (單點/區域清除)',
    clearSpecific: '清除所有 特定色',
    plateHint: '點擊邊緣「字母或數字」一鍵填滿，再次點擊可清除；雙擊孔位可清除',
    gelHint: '點擊或拖拽上方「上樣孔」著色；雙擊上樣孔可清除',
    zoomIn: '放大',
    zoomOut: '縮小',
    zoomReset: '重置大小',
    colorSchemeLabel: '切換色系圖庫:',
    formats: {
      '6-well': '6 孔板 (6-well)',
      '12-well': '12 孔板 (12-well)',
      '24-well': '24 孔板 (24-well)',
      '48-well': '48 孔板 (48-well)',
      '96-well': '96 孔板 (96-well)',
      '384-well': '384 孔板 (384-well)',
      'wb-10': '10 泳道 WB',
      'wb-12': '12 泳道 WB',
      'wb-15': '15 泳道 WB',
    },
  },
  'zh-CN': {
    title: '实验布板着色器',
    clearCanvas: '清空画布',
    exportImage: '导出图片',
    basicSettings: '1. 基本设定',
    coloringTools: '2. 着色工具',
    legendTitle: '3. 图例说明 (自动生成)',
    legendSub: '在右侧画布上着色后，这里会自动出现您使用的颜色，您可以为它们添加文字标签。',
    legendPlaceholder: '例: Control, 10μM...',
    legendExportHeader: '图例 (Legend)',
    defaultPlateTitle: '实验布板设计图',
    titlePlaceholder: '输入图片标题...',
    fillModeLabel: '填色模式 (三复孔设定):',
    fillModeSingle: '单孔',
    fillModeHoriz: '横向 x3',
    fillModeVert: '竖向 x3',
    eraserLabel: '橡皮擦 (单点/区域清除)',
    clearSpecific: '清除所有 特定色',
    plateHint: '点击边缘「字母或数字」一键填满，再次点击可清除；双击孔位可清除',
    gelHint: '点击或拖拽上方「上样孔」着色；双击上样孔可清除',
    zoomIn: '放大',
    zoomOut: '缩小',
    zoomReset: '重置大小',
    colorSchemeLabel: '切换色系图库:',
    formats: {
      '6-well': '6 孔板 (6-well)',
      '12-well': '12 孔板 (12-well)',
      '24-well': '24 孔板 (24-well)',
      '48-well': '48 孔板 (48-well)',
      '96-well': '96 孔板 (96-well)',
      '384-well': '384 孔板 (384-well)',
      'wb-10': '10 泳道 WB',
      'wb-12': '12 泳道 WB',
      'wb-15': '15 泳道 WB',
    },
  },
  en: {
    title: 'Lab Plate Colorizer',
    clearCanvas: 'Clear Canvas',
    exportImage: 'Export Image',
    basicSettings: '1. Basic Settings',
    coloringTools: '2. Coloring Tools',
    legendTitle: '3. Legend (Auto-generated)',
    legendSub: 'Once colored, active colors will appear here. You can add text labels for them.',
    legendPlaceholder: 'e.g., Control, 10μM...',
    legendExportHeader: 'Legend',
    defaultPlateTitle: 'Lab Plate Layout',
    titlePlaceholder: 'Enter diagram title...',
    fillModeLabel: 'Coloring Mode (Triplicate):',
    fillModeSingle: 'Single',
    fillModeHoriz: 'Horiz x3',
    fillModeVert: 'Vert x3',
    eraserLabel: 'Eraser (Single/Area)',
    clearSpecific: 'Clear Specific Color',
    plateHint: 'Click col/row index to fill, click again to clear; double-click wells to clear',
    gelHint: 'Click or drag top loading wells to color; double-click to clear',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    zoomReset: 'Reset Size',
    colorSchemeLabel: 'Color Palette Schemes:',
    formats: {
      '6-well': '6-Well Plate',
      '12-well': '12-Well Plate',
      '24-well': '24-Well Plate',
      '48-well': '48-Well Plate',
      '96-well': '96-Well Plate',
      '384-well': '384-Well Plate',
      'wb-10': '10-Lane WB Gel',
      'wb-12': '12-Lane WB Gel',
      'wb-15': '15-Lane WB Gel',
    },
  },
};

const SCHEME_GROUPS = [
  {
    label: { 'zh-TW': '基礎常用', 'zh-CN': '基础常用', en: 'Basic' },
    options: [
      {
        id: 'basic',
        name: { 'zh-TW': '標準 (Standard)', 'zh-CN': '标准 (Standard)', en: 'Standard' },
        colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#64748b', '#000000', '#ffffff'],
      },
    ],
  },
  {
    label: { 'zh-TW': '分類/定性 (區分組別)', 'zh-CN': '分类/定性 (区分组别)', en: 'Qualitative (Groups)' },
    options: [
      { id: 'Dark2', name: { 'zh-TW': 'Dark2', 'zh-CN': 'Dark2', en: 'Dark2' }, colors: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'] },
      { id: 'Set1', name: { 'zh-TW': 'Set1', 'zh-CN': 'Set1', en: 'Set1' }, colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'] },
      { id: 'Set2', name: { 'zh-TW': 'Set2', 'zh-CN': 'Set2', en: 'Set2' }, colors: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'] },
      { id: 'Paired', name: { 'zh-TW': 'Paired', 'zh-CN': 'Paired', en: 'Paired' }, colors: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'] },
    ],
  },
  {
    label: { 'zh-TW': '漸變/連續 (濃度/劑量)', 'zh-CN': '渐变/连续 (浓度/剂量)', en: 'Sequential (Concentration)' },
    options: [
      { id: 'Blues', name: { 'zh-TW': 'Blues (藍色系)', 'zh-CN': 'Blues (蓝色系)', en: 'Blues' }, colors: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'] },
      { id: 'Reds', name: { 'zh-TW': 'Reds (紅色系)', 'zh-CN': 'Reds (红色系)', en: 'Reds' }, colors: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'] },
      { id: 'Greens', name: { 'zh-TW': 'Greens (綠色系)', 'zh-CN': 'Greens (绿色系)', en: 'Greens' }, colors: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'] },
      { id: 'Viridis', name: { 'zh-TW': 'Viridis (科學漸變)', 'zh-CN': 'Viridis (科学渐变)', en: 'Viridis' }, colors: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'] },
    ],
  },
  {
    label: { 'zh-TW': '對比/發散 (雙向變化)', 'zh-CN': '对比/发散 (双向变化)', en: 'Diverging (Two-way)' },
    options: [
      { id: 'RdYlBu', name: { 'zh-TW': 'RdYlBu (紅黃藍)', 'zh-CN': 'RdYlBu (红黄蓝)', en: 'RdYlBu' }, colors: ['#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'] },
      { id: 'Spectral', name: { 'zh-TW': 'Spectral (光譜)', 'zh-CN': 'Spectral (光谱)', en: 'Spectral' }, colors: ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'] },
    ],
  },
];

const FLAT_SCHEMES = Object.fromEntries(
  SCHEME_GROUPS.flatMap((group) => group.options.map((option) => [option.id, option])),
);
const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function PlateColorizer() {
  const [lang, setLang] = useState('zh-CN');
  const t = TRANSLATIONS[lang];
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[4]);
  const [colors, setColors] = useState({});
  const [title, setTitle] = useState(t.defaultPlateTitle);
  const [legends, setLegends] = useState({});
  const [selectedSchemeKey, setSelectedSchemeKey] = useState('basic');
  const [currentColor, setCurrentColor] = useState(FLAT_SCHEMES.basic.colors[0]);
  const [hexInput, setHexInput] = useState(FLAT_SCHEMES.basic.colors[0]);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fillMode, setFillMode] = useState('single');
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef(null);
  const activeColors = [...new Set(Object.values(colors))].filter(Boolean);

  useEffect(() => {
    const defaults = Object.values(TRANSLATIONS).map((item) => item.defaultPlateTitle);
    if (defaults.includes(title)) {
      setTitle(t.defaultPlateTitle);
    }
  }, [lang, t.defaultPlateTitle, title]);

  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  function handleFormatChange(event) {
    const format = FORMATS.find((item) => item.id === event.target.value);
    setSelectedFormat(format);
    setColors({});
    setZoom(1);
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
    setCurrentColor(value);
    setHexInput(value);
    setIsEraser(false);
  }

  function handleColorWell(id, forceClear = false) {
    setColors((previous) => {
      const next = { ...previous };
      const applyColor = (targetId) => {
        if (isEraser || forceClear) {
          delete next[targetId];
        } else {
          next[targetId] = currentColor;
        }
      };

      if (fillMode !== 'single' && selectedFormat.type === 'plate') {
        const match = id.match(/([A-Z])(\d+)/);
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
          return next;
        }
      }

      applyColor(id);
      return next;
    });
  }

  function handleColClick(colIndex) {
    setColors((previous) => {
      const next = { ...previous };
      const allMatch = Array.from({ length: selectedFormat.rows }).every((_, rowIndex) => {
        const id = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
        return previous[id] === currentColor;
      });

      for (let rowIndex = 0; rowIndex < selectedFormat.rows; rowIndex += 1) {
        const id = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
        if (isEraser || allMatch) delete next[id];
        else next[id] = currentColor;
      }
      return next;
    });
  }

  function handleRowClick(rowIndex) {
    setColors((previous) => {
      const next = { ...previous };
      const allMatch = Array.from({ length: selectedFormat.cols }).every((_, colIndex) => {
        const id = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
        return previous[id] === currentColor;
      });

      for (let colIndex = 0; colIndex < selectedFormat.cols; colIndex += 1) {
        const id = `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
        if (isEraser || allMatch) delete next[id];
        else next[id] = currentColor;
      }
      return next;
    });
  }

  function clearSpecificColor() {
    setColors((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(([, color]) => color.toLowerCase() !== currentColor.toLowerCase()),
      ),
    );
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
      const downloadLink = document.createElement('a');
      downloadLink.download = `${title || selectedFormat.id}.png`;
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.click();
    };

    image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }

  function renderPlate() {
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
        <text className="svg-index" key={`col-${colIndex}`} x={cx} y={marginTop - Math.max(20, fontSize * 0.7)} textAnchor="middle" fontSize={fontSize} onClick={() => handleColClick(colIndex)}>
          {colIndex + 1}
        </text>,
      );
    }

    for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
      const cy = marginTop + rowIndex * cellHeight + cellHeight / 2;
      elements.push(
        <text className="svg-index" key={`row-${rowIndex}`} x={marginLeft - 20} y={cy + fontSize * 0.35} textAnchor="end" fontSize={fontSize} onClick={() => handleRowClick(rowIndex)}>
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
              setIsDrawing(true);
              handleColorWell(id);
            }}
            onMouseEnter={() => {
              if (isDrawing) handleColorWell(id);
            }}
            onDoubleClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleColorWell(id, true);
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
      const id = `lane-${index + 1}`;
      const x = marginX + index * laneWidth;
      elements.push(
        <text className="svg-index" key={`lane-num-${index}`} x={x + laneWidth / 2} y={marginTop - 10} textAnchor="middle" fontSize="16" onClick={() => handleColorWell(id)}>
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
            setIsDrawing(true);
            handleColorWell(id);
          }}
          onMouseEnter={() => {
            if (isDrawing) handleColorWell(id);
          }}
          onDoubleClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleColorWell(id, true);
          }}
        />,
        <rect key={`lane-body-${index}`} x={x + laneWidth * 0.15} y={marginTop + 60} width={laneWidth * 0.7} height={470} fill="transparent" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 2" style={{ pointerEvents: 'none' }} />,
      );
    }
    return elements;
  }

  return (
    <div className="colorizer-app">
      <header className="colorizer-header">
        <div className="brand-lockup">
          <div className="brand-icon"><Palette size={24} /></div>
          <h1>{t.title}</h1>
        </div>

        <div className="header-actions">
          <div className="language-switcher" aria-label="Language">
            <Globe size={16} />
            {['zh-TW', 'zh-CN', 'en'].map((item) => (
              <button className={lang === item ? 'active' : ''} key={item} type="button" onClick={() => setLang(item)}>
                {item === 'zh-TW' ? '繁' : item === 'zh-CN' ? '简' : 'EN'}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setColors({})}><RefreshCw size={18} />{t.clearCanvas}</button>
          <button className="primary" type="button" onClick={exportAsImage}><Download size={18} />{t.exportImage}</button>
        </div>
      </header>

      <main className="colorizer-layout">
        <aside className="tool-sidebar">
          <section className="tool-card">
            <h2>{t.basicSettings}</h2>
            <select value={selectedFormat.id} onChange={handleFormatChange}>
              {FORMATS.map((format) => <option key={format.id} value={format.id}>{t.formats[format.id]}</option>)}
            </select>
            <label className="input-with-icon">
              <Type size={18} />
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t.titlePlaceholder} />
            </label>
          </section>

          <section className="tool-card">
            <h2>{t.coloringTools}</h2>
            <label className="field-label">
              {t.colorSchemeLabel}
              <select value={selectedSchemeKey} onChange={(event) => setSelectedSchemeKey(event.target.value)}>
                {SCHEME_GROUPS.map((group) => (
                  <optgroup key={group.label.en} label={group.label[lang]}>
                    {group.options.map((option) => <option key={option.id} value={option.id}>{option.name[lang]}</option>)}
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
                  onClick={() => selectColor(color)}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            <div className="color-input-row">
              <input className="native-color" type="color" value={currentColor} onChange={handleColorPickerChange} />
              <label className="input-with-icon">
                <Hash size={16} />
                <input value={hexInput} onChange={handleHexInputChange} maxLength={7} />
              </label>
            </div>

            <div className="segmented-control" aria-label={t.fillModeLabel}>
              <button className={fillMode === 'single' ? 'active' : ''} type="button" onClick={() => setFillMode('single')}>{t.fillModeSingle}</button>
              <button className={fillMode === 'triplicate-horizontal' ? 'active' : ''} type="button" onClick={() => setFillMode('triplicate-horizontal')}>{t.fillModeHoriz}</button>
              <button className={fillMode === 'triplicate-vertical' ? 'active' : ''} type="button" onClick={() => setFillMode('triplicate-vertical')}>{t.fillModeVert}</button>
            </div>

            <button className={isEraser ? 'tool-button active' : 'tool-button'} type="button" onClick={() => setIsEraser(true)}>
              <Eraser size={18} />{t.eraserLabel}
            </button>
            <button className="tool-button danger-action" type="button" onClick={clearSpecificColor}>
              <Trash2 size={18} />{t.clearSpecific}<span style={{ backgroundColor: currentColor }} />
            </button>
          </section>

          <section className="tool-card legend-card">
            <h2><List size={16} />{t.legendTitle}</h2>
            {activeColors.length === 0 ? (
              <p>{t.legendSub}</p>
            ) : (
              <div className="legend-editor">
                {activeColors.map((color) => (
                  <label key={color}>
                    <span style={{ backgroundColor: color }} />
                    <input value={legends[color] || ''} onChange={(event) => setLegends({ ...legends, [color]: event.target.value })} placeholder={t.legendPlaceholder} />
                  </label>
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className="canvas-panel">
          <div className="canvas-toolbar">
            <span><MousePointerClick size={15} />{selectedFormat.type === 'plate' ? t.plateHint : t.gelHint}</span>
            <div className="zoom-controls">
              <button type="button" onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))} title={t.zoomOut}><ZoomOut size={16} /></button>
              <strong>{Math.round(zoom * 100)}%</strong>
              <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} title={t.zoomIn}><ZoomIn size={16} /></button>
              <button type="button" onClick={() => setZoom(1)} title={t.zoomReset}><Maximize size={16} /></button>
            </div>
          </div>

          <div className="canvas-scroll" onMouseLeave={() => setIsDrawing(false)}>
            <div className="canvas-center">
              <div className="svg-frame" style={{ width: `${1100 * zoom}px`, height: `${650 * zoom}px` }}>
                <svg ref={svgRef} viewBox="0 0 1100 650" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="white" rx="8" />
                  {title && <text x="450" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">{title}</text>}
                  {selectedFormat.type === 'plate' && <rect x="15" y="40" width="870" height="595" fill="none" stroke="#cbd5e1" strokeWidth="2" rx="8" />}
                  {selectedFormat.type === 'plate' ? renderPlate() : renderGel()}
                  {activeColors.length > 0 && (
                    <g transform="translate(910, 60)">
                      <text x="0" y="0" fontSize="16" fontWeight="bold" fill="#475569">{t.legendExportHeader}</text>
                      {activeColors.map((color, index) => (
                        <g key={`legend-svg-${color}`} transform={`translate(0, ${25 + index * 30})`}>
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
        </section>
      </main>
    </div>
  );
}
