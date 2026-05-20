import { useState } from 'react';
import { Code, Layout, Save, X } from 'lucide-react';
import JsonEditor from './JsonEditor.jsx';
import RenderedBlocks from './RenderedBlocks.jsx';
import { INITIAL_TEMPLATE_BLOCKS, TEMPLATE_COMPONENT_TYPES } from './templateData.js';

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function validateBlocks(value) {
  if (!Array.isArray(value)) {
    return '最外层必须是数组 Array [...]';
  }

  const missingFields = value.find((block) => !block.id || !block.type);
  if (missingFields) {
    return '每个区块都必须包含 id 和 type';
  }

  return null;
}

export default function TemplateEngine() {
  const [blocks, setBlocks] = useState(INITIAL_TEMPLATE_BLOCKS);
  const [jsonText, setJsonText] = useState(formatJson(INITIAL_TEMPLATE_BLOCKS));
  const [error, setError] = useState(null);
  const [showDeveloperPanel, setShowDeveloperPanel] = useState(false);

  function handleJsonTextChange(event) {
    const text = event.target.value;
    setJsonText(text);

    try {
      const parsed = JSON.parse(text);
      const validationError = validateBlocks(parsed);
      if (validationError) {
        setError(validationError);
        return;
      }

      setBlocks(parsed);
      setError(null);
    } catch (parseError) {
      setError(`JSON 格式错误：${parseError.message}`);
    }
  }

  function handleBlockDataChange(blockId, newData) {
    setBlocks((currentBlocks) => {
      const updatedBlocks = currentBlocks.map((block) =>
        block.id === blockId ? { ...block, data: newData } : block,
      );
      setJsonText(formatJson(updatedBlocks));
      return updatedBlocks;
    });
  }

  function handleFormatJson() {
    try {
      const parsed = JSON.parse(jsonText);
      const validationError = validateBlocks(parsed);
      if (validationError) {
        setError(validationError);
        return;
      }
      setJsonText(formatJson(parsed));
      setBlocks(parsed);
      setError(null);
    } catch (parseError) {
      setError(`JSON 格式错误：${parseError.message}`);
    }
  }

  return (
    <div className="template-engine-app">
      <header className="template-engine-header">
        <div className="template-engine-brand">
          <div>
            <Layout size={24} />
          </div>
          <span>
            <h1>实验模板渲染底座</h1>
            <p>JSON Template to Component Renderer to Editable Experiment UI</p>
          </span>
        </div>
        <div className="template-engine-actions">
          {showDeveloperPanel && (
            <button type="button" onClick={handleFormatJson}>
              <Save size={18} />
              Format / Validate
            </button>
          )}
          <button
            className={showDeveloperPanel ? 'active' : ''}
            type="button"
            onClick={() => setShowDeveloperPanel((current) => !current)}
            title="开发者模式"
          >
            {showDeveloperPanel ? <X size={18} /> : <Code size={18} />}
            {showDeveloperPanel ? 'Hide JSON' : 'Dev JSON'}
          </button>
        </div>
      </header>

      <div className="template-type-strip">
        {TEMPLATE_COMPONENT_TYPES.map((item) => (
          <span key={item.type}>
            <strong>{item.type}</strong>
            {item.label}
          </span>
        ))}
      </div>

      <main className={showDeveloperPanel ? 'template-engine-layout with-dev-panel' : 'template-engine-layout'}>
        <RenderedBlocks blocks={blocks} onBlockDataChange={handleBlockDataChange} />
        {showDeveloperPanel && (
          <JsonEditor error={error} jsonText={jsonText} onJsonTextChange={handleJsonTextChange} />
        )}
      </main>
    </div>
  );
}
