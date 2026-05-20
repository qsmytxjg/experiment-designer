import { Plus, Thermometer, Trash2 } from 'lucide-react';
import { DEFAULT_THERMOCYCLE } from './templateData.js';

export default function ThermocycleComponent({ data, onChange }) {
  const steps = data.steps || DEFAULT_THERMOCYCLE;

  function updateData(updates) {
    onChange({ ...data, ...updates });
  }

  function handleStepChange(index, field, value) {
    const nextSteps = [...steps];
    nextSteps[index] = { ...nextSteps[index], [field]: value };
    updateData({ steps: nextSteps });
  }

  function addStep() {
    updateData({ steps: [...steps, { phase: '', temp: '', time: '', cycles: '' }] });
  }

  function deleteStep(index) {
    updateData({ steps: steps.filter((_, currentIndex) => currentIndex !== index) });
  }

  return (
    <section className="thermo-card">
      <div className="thermo-card-header">
        <Thermometer size={20} />
        <input
          value={data.title || ''}
          onChange={(event) => updateData({ title: event.target.value })}
          placeholder="PCR 上机扩增程序 (Thermal Cycle)..."
        />
      </div>
      <div className="template-table-wrap">
        <table className="thermo-table">
          <thead>
            <tr>
              <th>步骤阶段</th>
              <th>温度 (°C)</th>
              <th>时间</th>
              <th>循环</th>
              <th aria-label="操作" />
            </tr>
          </thead>
          <tbody>
            {steps.map((step, index) => (
              <tr key={`${step.phase}-${index}`}>
                <td><input value={step.phase || ''} onChange={(event) => handleStepChange(index, 'phase', event.target.value)} placeholder="e.g. Denaturation" /></td>
                <td><input value={step.temp || ''} onChange={(event) => handleStepChange(index, 'temp', event.target.value)} placeholder="95" /></td>
                <td><input value={step.time || ''} onChange={(event) => handleStepChange(index, 'time', event.target.value)} placeholder="30 sec" /></td>
                <td><input value={step.cycles || ''} onChange={(event) => handleStepChange(index, 'cycles', event.target.value)} placeholder="35" /></td>
                <td><button type="button" onClick={() => deleteStep(index)}><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer>
        <button className="add-row-button rose" type="button" onClick={addStep}>
          <Plus size={16} />
          新增步骤
        </button>
      </footer>
    </section>
  );
}
