import { FlaskConical, Plus, Trash2 } from 'lucide-react';

export default function ReactionTableComponent({ data, onChange }) {
  const reagents = data.reagents || [];
  const totalVolume = reagents.reduce((sum, item) => sum + (Number.parseFloat(item.volume) || 0), 0);

  function handleReagentChange(index, field, value) {
    const nextReagents = [...reagents];
    nextReagents[index] = { ...nextReagents[index], [field]: value };
    onChange({ ...data, reagents: nextReagents });
  }

  function handleAddReagent() {
    onChange({
      ...data,
      reagents: [...reagents, { name: '', volume: 0, finalConc: '' }],
    });
  }

  function handleDeleteReagent(index) {
    onChange({
      ...data,
      reagents: reagents.filter((_, currentIndex) => currentIndex !== index),
    });
  }

  return (
    <section className="reaction-table-card">
      <div className="reaction-table-header">
        <FlaskConical size={18} />
        <input
          type="text"
          value={data.tableName || ''}
          onChange={(event) => onChange({ ...data, tableName: event.target.value })}
          placeholder="输入体系表格名称..."
        />
      </div>

      <div className="template-table-wrap">
        <table className="template-table">
          <thead>
            <tr>
              <th>试剂名称 (Reagent)</th>
              <th>体积 (uL)</th>
              <th>终浓度</th>
              <th aria-label="操作" />
            </tr>
          </thead>
          <tbody>
            {reagents.map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(event) => handleReagentChange(index, 'name', event.target.value)}
                    placeholder="试剂名称"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.volume}
                    onChange={(event) => handleReagentChange(index, 'volume', event.target.value)}
                    step="any"
                    min="0"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.finalConc}
                    onChange={(event) => handleReagentChange(index, 'finalConc', event.target.value)}
                    placeholder="如: 1x, 10mM"
                  />
                </td>
                <td>
                  <button type="button" onClick={() => handleDeleteReagent(index)} title="删除此列">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4">
                <button className="add-row-button" type="button" onClick={handleAddReagent}>
                  <Plus size={14} />
                  新增试剂
                </button>
              </td>
            </tr>
            <tr className="total-row">
              <td>Total Volume:</td>
              <td colSpan="3">
                {totalVolume.toFixed(2)} <span>uL</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
