import { AlertCircle, Code } from 'lucide-react';

export default function JsonEditor({ error, jsonText, onJsonTextChange }) {
  return (
    <section className="json-editor-panel">
      <div className="json-editor-header">
        <span>
          <Code size={16} />
          JSON Template
        </span>
      </div>

      <div className="json-editor-body">
        <textarea value={jsonText} onChange={onJsonTextChange} spellCheck="false" />
        {error && (
          <div className="json-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </section>
  );
}
