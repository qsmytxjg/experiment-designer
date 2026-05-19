export default function FactorBuilder({ factors, onAddFactor, onUpdateFactor, onRemoveFactor }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>因素与水平</h2>
        <button className="icon-button" type="button" onClick={onAddFactor} aria-label="新增因素">
          +
        </button>
      </div>

      <div className="factor-list">
        {factors.map((factor) => (
          <div className="factor-row" key={factor.id}>
            <input
              aria-label="因素名称"
              value={factor.name}
              onChange={(event) => onUpdateFactor(factor.id, 'name', event.target.value)}
            />
            <input
              aria-label="水平"
              value={factor.levels}
              onChange={(event) => onUpdateFactor(factor.id, 'levels', event.target.value)}
            />
            <button
              className="icon-button danger"
              type="button"
              onClick={() => onRemoveFactor(factor.id)}
              aria-label="删除因素"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
