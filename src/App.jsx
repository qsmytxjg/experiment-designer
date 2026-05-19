import ExperimentSetup from './components/ExperimentSetup.jsx';
import FactorBuilder from './components/FactorBuilder.jsx';
import PlateColorizer from './components/PlateColorizer.jsx';
import ProtocolSummary from './components/ProtocolSummary.jsx';
import SampleTable from './components/SampleTable.jsx';
import { useExperimentDesign } from './hooks/useExperimentDesign.js';

export default function App() {
  const design = useExperimentDesign();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Experiment Designer</p>
          <h1>{design.experiment.title}</h1>
        </div>
        <div className="status-strip" aria-label="设计状态">
          <span>{design.samples.length} samples</span>
          <span>{design.factors.length} factors</span>
          <span>{design.plateFormat.label}</span>
        </div>
      </header>

      <section className="workspace-grid">
        <div className="left-rail">
          <ExperimentSetup
            experiment={design.experiment}
            onChange={design.updateExperiment}
          />
          <FactorBuilder
            factors={design.factors}
            onAddFactor={design.addFactor}
            onUpdateFactor={design.updateFactor}
            onRemoveFactor={design.removeFactor}
          />
        </div>

        <div className="main-stage">
          <PlateColorizer
            plateFormat={design.plateFormat}
            plateFormats={design.plateFormats}
            assignments={design.assignments}
            activeGroup={design.activeGroup}
            groups={design.groups}
            onPlateFormatChange={design.setPlateFormatId}
            onActiveGroupChange={design.setActiveGroupId}
            onAssignWell={design.assignWell}
            onClearPlate={design.clearPlate}
          />
          <SampleTable
            samples={design.samples}
            groups={design.groups}
            onUpdateSample={design.updateSample}
            onAddSample={design.addSample}
            onRemoveSample={design.removeSample}
          />
        </div>

        <aside className="right-rail">
          <ProtocolSummary
            experiment={design.experiment}
            factors={design.factors}
            samples={design.samples}
            assignments={design.assignments}
            plateFormat={design.plateFormat}
            groups={design.groups}
          />
        </aside>
      </section>
    </main>
  );
}
