import { FileText } from 'lucide-react';

export default function NoteComponent({ data, onChange }) {
  return (
    <section className="template-note">
      <div className="template-block-title amber">
        <FileText size={18} />
        <input
          type="text"
          value={data.title || ''}
          onChange={(event) => onChange({ ...data, title: event.target.value })}
          placeholder="输入标题..."
        />
      </div>
      <textarea
        value={data.content || ''}
        onChange={(event) => onChange({ ...data, content: event.target.value })}
        rows="3"
        placeholder="在此输入实验备注..."
      />
    </section>
  );
}
