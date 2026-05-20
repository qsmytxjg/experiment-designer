import { lazy, Suspense, useState } from 'react';
import PlateColorizer from './components/plate-colorizer/PlateColorizer.jsx';

const TemplateEngineDevTool = import.meta.env.DEV
  ? lazy(() => import('./components/template-engine/TemplateEngine.jsx'))
  : null;

export default function App() {
  const [activeModule, setActiveModule] = useState('plate');
  const showTemplateEngineDevTool = import.meta.env.DEV;

  if (!showTemplateEngineDevTool) {
    return <PlateColorizer />;
  }

  return (
    <>
      <nav className="app-module-switcher" aria-label="应用模块">
        <button
          className={activeModule === 'plate' ? 'active' : ''}
          type="button"
          onClick={() => setActiveModule('plate')}
        >
          布板着色器
        </button>
        <button
          className={activeModule === 'template' ? 'active' : ''}
          type="button"
          onClick={() => setActiveModule('template')}
        >
          JSON 模板引擎
        </button>
      </nav>
      {activeModule === 'plate' ? (
        <PlateColorizer />
      ) : (
        <Suspense fallback={<div className="dev-tool-loading">Loading template engine...</div>}>
          <TemplateEngineDevTool />
        </Suspense>
      )}
    </>
  );
}
