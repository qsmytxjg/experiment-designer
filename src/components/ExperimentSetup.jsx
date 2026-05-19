export default function ExperimentSetup({ experiment, onChange }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>实验信息</h2>
      </div>

      <div className="form-grid">
        <label>
          标题
          <input
            value={experiment.title}
            onChange={(event) => onChange('title', event.target.value)}
          />
        </label>
        <label>
          对象
          <input
            value={experiment.organism}
            onChange={(event) => onChange('organism', event.target.value)}
          />
        </label>
        <label>
          负责人
          <input
            value={experiment.owner}
            onChange={(event) => onChange('owner', event.target.value)}
          />
        </label>
        <label>
          目的
          <textarea
            rows="3"
            value={experiment.objective}
            onChange={(event) => onChange('objective', event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
