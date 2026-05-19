import { getWellIds } from '../data/plateFormats.js';

export default function PlateColorizer({
  plateFormat,
  plateFormats,
  assignments,
  activeGroup,
  groups,
  onPlateFormatChange,
  onActiveGroupChange,
  onAssignWell,
  onClearPlate,
}) {
  const wells = getWellIds(plateFormat);

  return (
    <section className="module plate-module">
      <div className="module-toolbar">
        <div>
          <h2>孔板布局</h2>
          <p>{Object.keys(assignments).length} wells assigned</p>
        </div>

        <div className="toolbar-actions">
          <select
            value={plateFormat.id}
            onChange={(event) => onPlateFormatChange(event.target.value)}
            aria-label="孔板格式"
          >
            {plateFormats.map((format) => (
              <option value={format.id} key={format.id}>
                {format.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={onClearPlate}>
            Clear
          </button>
        </div>
      </div>

      <div className="group-palette" aria-label="实验组">
        {groups.map((group) => (
          <button
            className={group.id === activeGroup.id ? 'swatch active' : 'swatch'}
            key={group.id}
            type="button"
            onClick={() => onActiveGroupChange(group.id)}
            style={{ '--swatch-color': group.color }}
          >
            <span aria-hidden="true" />
            {group.name}
          </button>
        ))}
      </div>

      <div
        className="plate-grid"
        style={{ '--plate-columns': plateFormat.columns }}
        aria-label={`${plateFormat.label} layout`}
      >
        {wells.map((wellId) => {
          const group = groups.find((item) => item.id === assignments[wellId]);
          const style = group ? { '--well-color': group.color } : undefined;

          return (
            <button
              className={group ? 'well assigned' : 'well'}
              key={wellId}
              type="button"
              onClick={() => onAssignWell(wellId)}
              style={style}
              title={group ? `${wellId}: ${group.name}` : wellId}
            >
              {wellId}
            </button>
          );
        })}
      </div>
    </section>
  );
}
