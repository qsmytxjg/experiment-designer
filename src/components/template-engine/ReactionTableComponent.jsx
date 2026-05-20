import { useEffect, useState } from 'react';
import { Calculator, FlaskConical, Info, Plus, Thermometer, Trash2 } from 'lucide-react';
import { DEFAULT_THERMOCYCLE } from './templateData.js';

const ROLE_OPTIONS = [
  ['reagent', '一般试剂'],
  ['mix', 'Mix / Buffer'],
  ['primer', '引物 (Primer)'],
  ['enzyme', '酶 (Enzyme)'],
  ['water', '补齐水 (Auto)'],
  ['sample', '样本/模板'],
];

export default function ReactionTableComponent({ data, onChange }) {
  const reagents = data.reagents || [];
  const thermocycle = data.thermocycle || [];
  const hasThermo = Boolean(data.hasThermocycle);
  const [localTotalVol, setLocalTotalVol] = useState(data.totalVolPerRxn || 20);

  useEffect(() => {
    setLocalTotalVol(data.totalVolPerRxn || 20);
  }, [data.totalVolPerRxn]);

  const totalVolPerRxn = Number.parseFloat(localTotalVol) || 20;
  const targetRxns = Number.parseFloat(data.targetRxns) || 1;
  const overageMode = data.overageMode || 'tubes';
  const overageTubes = Number.parseFloat(data.overageTubes) || 0;
  const overagePercent = Number.parseFloat(data.overagePercent) || 0;
  const multiplier = overageMode === 'tubes' ? targetRxns + overageTubes : targetRxns * (1 + overagePercent / 100);

  const nonWaterVolume = reagents.reduce((sum, reagent) => {
    if (reagent.type === 'water') return sum;
    return sum + (Number.parseFloat(reagent.volPerRxn ?? reagent.volume) || 0);
  }, 0);
  const calculatedWaterVol = Math.max(0, totalVolPerRxn - nonWaterVolume);
  const mixVolumePerRxn = reagents.reduce((sum, reagent) => {
    const inMix = reagent.inMix ?? reagent.type !== 'sample';
    if (!inMix) return sum;
    return sum + (reagent.type === 'water' ? calculatedWaterVol : Number.parseFloat(reagent.volPerRxn ?? reagent.volume) || 0);
  }, 0);

  function updateData(updates) {
    onChange({ ...data, ...updates });
  }

  function handleReagentChange(index, field, value) {
    const nextReagents = [...reagents];
    nextReagents[index] = { ...nextReagents[index], [field]: value };
    if (field === 'type') {
      nextReagents[index].inMix = value !== 'sample';
    }
    updateData({ reagents: nextReagents });
  }

  function handleAddReagent() {
    updateData({
      reagents: [...reagents, { name: '', type: 'reagent', volPerRxn: 0, inMix: true }],
    });
  }

  function handleDeleteReagent(index) {
    updateData({ reagents: reagents.filter((_, currentIndex) => currentIndex !== index) });
  }

  function handleScaleRecipe() {
    const nextTotal = Number.parseFloat(localTotalVol);
    const oldTotal = Number.parseFloat(data.totalVolPerRxn) || 20;
    if (!nextTotal || nextTotal <= 0 || nextTotal === oldTotal) {
      setLocalTotalVol(oldTotal);
      return;
    }

    const ratio = nextTotal / oldTotal;
    updateData({
      totalVolPerRxn: nextTotal,
      reagents: reagents.map((reagent) => {
        if (reagent.type === 'water') return reagent;
        const currentVol = Number.parseFloat(reagent.volPerRxn ?? reagent.volume) || 0;
        return { ...reagent, volPerRxn: Number((currentVol * ratio).toFixed(2)) };
      }),
    });
  }

  function toggleThermo() {
    updateData({
      hasThermocycle: !hasThermo,
      thermocycle: hasThermo ? thermocycle : thermocycle.length > 0 ? thermocycle : DEFAULT_THERMOCYCLE,
    });
  }

  function handleThermoChange(index, field, value) {
    const nextSteps = [...thermocycle];
    nextSteps[index] = { ...nextSteps[index], [field]: value };
    updateData({ thermocycle: nextSteps });
  }

  function addThermoStep() {
    updateData({ thermocycle: [...thermocycle, { phase: '', temp: '', time: '', cycles: '' }] });
  }

  function deleteThermoStep(index) {
    updateData({ thermocycle: thermocycle.filter((_, currentIndex) => currentIndex !== index) });
  }

  return (
    <section className={hasThermo ? 'reaction-table-card has-thermo' : 'reaction-table-card'}>
      <div className="reaction-table-header">
        <span>
          <FlaskConical size={18} />
          <input
            type="text"
            value={data.tableName || ''}
            onChange={(event) => updateData({ tableName: event.target.value })}
            placeholder="PCR/反应体系名称..."
          />
        </span>
        <button className={hasThermo ? 'thermo-toggle active' : 'thermo-toggle'} type="button" onClick={toggleThermo}>
          <Thermometer size={16} />
          PCR 程序 {hasThermo ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="reaction-table-body">
        <div className="reaction-main">
          <div className="reaction-settings">
            <label>
              <span>单管总体积</span>
              <input
                type="number"
                value={localTotalVol}
                onChange={(event) => setLocalTotalVol(event.target.value)}
                onBlur={handleScaleRecipe}
                onKeyDown={(event) => event.key === 'Enter' && handleScaleRecipe()}
              />
            </label>
            <select value={data.volUnit || 'μL'} onChange={(event) => updateData({ volUnit: event.target.value })}>
              <option value="μL">μL</option>
              <option value="mL">mL</option>
            </select>
            <label>
              <span>预计管数/孔数</span>
              <input type="number" value={data.targetRxns ?? 10} onChange={(event) => updateData({ targetRxns: event.target.value })} />
            </label>
            <select value={overageMode} onChange={(event) => updateData({ overageMode: event.target.value })}>
              <option value="tubes">额外配制 (管)</option>
              <option value="percent">损耗宽容 (%)</option>
            </select>
            <input
              type="number"
              step="any"
              value={overageMode === 'tubes' ? data.overageTubes ?? 0 : data.overagePercent ?? 0}
              onChange={(event) => updateData({ [overageMode === 'tubes' ? 'overageTubes' : 'overagePercent']: event.target.value })}
            />
            <strong>
              <Calculator size={14} />
              {multiplier.toFixed(2)}x
            </strong>
          </div>

          <div className="template-table-wrap">
            <table className="template-table smart-reaction-table">
              <thead>
                <tr>
                  <th>试剂名称 (Component)</th>
                  <th>角色</th>
                  <th>1X 体积</th>
                  <th title="打勾：与其他试剂统一混合。不打勾：单管独立加入，如样本。">
                    <Info size={12} /> MM?
                  </th>
                  <th>配制总量</th>
                  <th aria-label="操作" />
                </tr>
              </thead>
              <tbody>
                {reagents.map((item, index) => {
                  const inMix = item.inMix ?? item.type !== 'sample';
                  const oneXVolume = item.type === 'water' ? calculatedWaterVol : Number.parseFloat(item.volPerRxn ?? item.volume) || 0;
                  const masterMixVolume = inMix ? oneXVolume * multiplier : 0;

                  return (
                    <tr className={`role-${item.type || 'reagent'}`} key={`${item.name}-${index}`}>
                      <td>
                        <input
                          type="text"
                          value={item.name || ''}
                          onChange={(event) => handleReagentChange(index, 'name', event.target.value)}
                          placeholder="输入试剂..."
                        />
                      </td>
                      <td>
                        <select value={item.type || 'reagent'} onChange={(event) => handleReagentChange(index, 'type', event.target.value)}>
                          {ROLE_OPTIONS.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {item.type === 'water' ? (
                          <strong className="auto-water">{calculatedWaterVol.toFixed(2)}</strong>
                        ) : (
                          <input
                            type="number"
                            value={item.volPerRxn ?? item.volume ?? 0}
                            onChange={(event) => handleReagentChange(index, 'volPerRxn', event.target.value)}
                            step="any"
                            min="0"
                          />
                        )}
                      </td>
                      <td>
                        <input type="checkbox" checked={inMix} onChange={(event) => handleReagentChange(index, 'inMix', event.target.checked)} />
                      </td>
                      <td>{inMix ? <strong className="mm-volume">{masterMixVolume.toFixed(2)}</strong> : <span className="separate-add">单独加</span>}</td>
                      <td>
                        <button type="button" onClick={() => handleDeleteReagent(index)} title="删除此列">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="6">
                    <button className="add-row-button" type="button" onClick={handleAddReagent}>
                      <Plus size={14} />
                      新增试剂行
                    </button>
                  </td>
                </tr>
                <tr className="total-row">
                  <td colSpan="3">1X 单管总和: {totalVolPerRxn}</td>
                  <td colSpan="2">混合液配制总量: {(mixVolumePerRxn * multiplier).toFixed(2)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {hasThermo && (
          <div className="reaction-thermo-panel">
            <h3>
              <Thermometer size={16} />
              PCR 扩增程序
            </h3>
            <table className="thermo-table compact">
              <thead>
                <tr>
                  <th>步骤阶段</th>
                  <th>温度</th>
                  <th>时间</th>
                  <th>循环</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {thermocycle.map((step, index) => (
                  <tr key={`${step.phase}-${index}`}>
                    <td><input value={step.phase || ''} onChange={(event) => handleThermoChange(index, 'phase', event.target.value)} placeholder="Phase" /></td>
                    <td><input value={step.temp || ''} onChange={(event) => handleThermoChange(index, 'temp', event.target.value)} placeholder="95" /></td>
                    <td><input value={step.time || ''} onChange={(event) => handleThermoChange(index, 'time', event.target.value)} placeholder="30 sec" /></td>
                    <td><input value={step.cycles || ''} onChange={(event) => handleThermoChange(index, 'cycles', event.target.value)} placeholder="35" /></td>
                    <td><button type="button" onClick={() => deleteThermoStep(index)}><Trash2 size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="add-row-button rose" type="button" onClick={addThermoStep}>
              <Plus size={14} />
              新增步骤
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
