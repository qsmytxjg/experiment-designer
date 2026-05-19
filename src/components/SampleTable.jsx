export default function SampleTable({ samples, groups, onUpdateSample, onAddSample, onRemoveSample }) {
  return (
    <section className="module">
      <div className="module-toolbar">
        <div>
          <h2>样本表</h2>
          <p>{samples.length} rows</p>
        </div>
        <button type="button" onClick={onAddSample}>
          Add sample
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>分组</th>
              <th>重复</th>
              <th>备注</th>
              <th aria-label="操作" />
            </tr>
          </thead>
          <tbody>
            {samples.map((sample) => (
              <tr key={sample.id}>
                <td>
                  <input
                    value={sample.id}
                    onChange={(event) => onUpdateSample(sample.id, 'id', event.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={sample.name}
                    onChange={(event) => onUpdateSample(sample.id, 'name', event.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={sample.groupId}
                    onChange={(event) => onUpdateSample(sample.id, 'groupId', event.target.value)}
                  >
                    {groups.map((group) => (
                      <option value={group.id} key={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    value={sample.replicate}
                    onChange={(event) => onUpdateSample(sample.id, 'replicate', event.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={sample.note}
                    onChange={(event) => onUpdateSample(sample.id, 'note', event.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="icon-button danger"
                    type="button"
                    onClick={() => onRemoveSample(sample.id)}
                    aria-label="删除样本"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
