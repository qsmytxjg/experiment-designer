import { useEffect, useRef, useState } from 'react';
import { FLAT_SCHEMES, FORMATS, ROW_LABELS, TRANSLATIONS } from '../components/plate-colorizer/plateColorizerData.js';

export function usePlateColorizer() {
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

  function clearCanvas() {
    setColors({});
  }

  function setLegendLabel(color, label) {
    setLegends((previous) => ({ ...previous, [color]: label }));
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

  return {
    activeColors,
    clearCanvas,
    clearSpecificColor,
    colors,
    currentColor,
    exportAsImage,
    fillMode,
    handleColClick,
    handleColorPickerChange,
    handleColorWell,
    handleFormatChange,
    handleHexInputChange,
    handleRowClick,
    hexInput,
    isDrawing,
    isEraser,
    lang,
    legends,
    selectColor,
    selectedFormat,
    selectedSchemeKey,
    setFillMode,
    setIsDrawing,
    setIsEraser,
    setLang,
    setLegendLabel,
    setSelectedSchemeKey,
    setTitle,
    setZoom,
    svgRef,
    t,
    title,
    zoom,
  };
}
