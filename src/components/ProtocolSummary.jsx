export default function ProtocolSummary({
  experiment,
  factors,
  samples,
  assignments,
  plateFormat,
  groups,
}) {
  const assignedByGroup = groups.map((group) => ({
    ...group,
    count: Object.values(assignments).filter((groupId) => groupId === group.id).length,
  }));

  const jsonPayload = JSON.stringify(
    {
      experiment,
      plateFormat: plateFormat.label,
      factors,
      samples,
      assignments,
    },
    null,
    2,
  );

  function copyJson() {
    navigator.clipboard?.writeText(jsonPayload);
  }

  return (
    <section className="summary-panel">
      <div className="panel-heading">
        <h2>方案摘要</h2>
        <button type="button" onClick={copyJson}>
          Copy JSON
        </button>
      </div>

      <dl className="summary-list">
        <div>
          <dt>标题</dt>
          <dd>{experiment.title}</dd>
        </div>
        <div>
          <dt>对象</dt>
          <dd>{experiment.organism}</dd>
        </div>
        <div>
          <dt>孔板</dt>
          <dd>{plateFormat.label}</dd>
        </div>
        <div>
          <dt>样本</dt>
          <dd>{samples.length}</dd>
        </div>
      </dl>

      <div className="mini-section">
        <h3>分组占用</h3>
        <div className="group-counts">
          {assignedByGroup.map((group) => (
            <div key={group.id}>
              <span style={{ background: group.color }} />
              <strong>{group.count}</strong>
              <small>{group.name}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="mini-section">
        <h3>因素</h3>
        <ul className="compact-list">
          {factors.map((factor) => (
            <li key={factor.id}>
              <strong>{factor.name}</strong>
              <span>{factor.levels}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
