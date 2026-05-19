import { usePlateColorizer } from '../../hooks/usePlateColorizer.js';
import BasicSettings from './BasicSettings.jsx';
import ColorizerCanvas from './ColorizerCanvas.jsx';
import ColorizerHeader from './ColorizerHeader.jsx';
import ColoringTools from './ColoringTools.jsx';
import LegendSection from './LegendSection.jsx';

export default function PlateColorizer() {
  const colorizer = usePlateColorizer();

  return (
    <div className="colorizer-app">
      <ColorizerHeader
        lang={colorizer.lang}
        t={colorizer.t}
        onClearCanvas={colorizer.clearCanvas}
        onExportImage={colorizer.exportAsImage}
        onLangChange={colorizer.setLang}
      />

      <main className="colorizer-layout">
        <aside className="tool-sidebar">
          <BasicSettings
            selectedFormat={colorizer.selectedFormat}
            title={colorizer.title}
            t={colorizer.t}
            onFormatChange={colorizer.handleFormatChange}
            onTitleChange={colorizer.setTitle}
          />
          <ColoringTools colorizer={colorizer} />
          <LegendSection
            activeColors={colorizer.activeColors}
            legends={colorizer.legends}
            t={colorizer.t}
            onLegendLabelChange={colorizer.setLegendLabel}
          />
        </aside>

        <ColorizerCanvas colorizer={colorizer} />
      </main>
    </div>
  );
}
