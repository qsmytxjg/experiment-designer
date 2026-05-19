import ColorPicker from './ColorPicker.jsx';
import FillModeControls from './FillModeControls.jsx';

export default function ColoringTools({ colorizer }) {
  return (
    <section className="tool-card">
      <h2>{colorizer.t.coloringTools}</h2>
      <ColorPicker
        currentColor={colorizer.currentColor}
        hexInput={colorizer.hexInput}
        isEraser={colorizer.isEraser}
        lang={colorizer.lang}
        selectedSchemeKey={colorizer.selectedSchemeKey}
        t={colorizer.t}
        onColorPickerChange={colorizer.handleColorPickerChange}
        onHexInputChange={colorizer.handleHexInputChange}
        onSchemeChange={colorizer.setSelectedSchemeKey}
        onSelectColor={colorizer.selectColor}
      />
      <FillModeControls
        currentColor={colorizer.currentColor}
        fillMode={colorizer.fillMode}
        isEraser={colorizer.isEraser}
        t={colorizer.t}
        onClearSpecificColor={colorizer.clearSpecificColor}
        onEraser={() => colorizer.setIsEraser(true)}
        onFillModeChange={colorizer.setFillMode}
      />
    </section>
  );
}
