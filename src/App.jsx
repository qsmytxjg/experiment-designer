import PlateColorizer from './components/plate-colorizer/PlateColorizer.jsx';
import TemplateEngine from './components/template-engine/TemplateEngine.jsx';
import { useState } from 'react';

export default function App() {
  const [activeModule, setActiveModule] = useState('template');

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
          实验记录本
        </button>
      </nav>
      {activeModule === 'plate' ? <PlateColorizer /> : <TemplateEngine />}
    </>
  );
}
