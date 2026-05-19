import { AlertCircle } from 'lucide-react';
import { COMPONENT_REGISTRY } from './componentRegistry.js';

export default function RenderedBlocks({ blocks, onBlockDataChange }) {
  return (
    <section className="rendered-blocks-panel">
      <div className="rendered-blocks-inner">
        {blocks.length === 0 && <div className="empty-template-state">没有可渲染的区块</div>}

        {blocks.map((block) => {
          const TargetComponent = COMPONENT_REGISTRY[block.type];

          if (!TargetComponent) {
            return (
              <div className="unknown-template-block" key={block.id}>
                <AlertCircle size={16} />
                未知的组件类型: <strong>{block.type}</strong>
              </div>
            );
          }

          return (
            <div className="rendered-block-shell" key={block.id}>
              <div className="block-type-badge">{block.type}</div>
              <TargetComponent
                data={block.data || {}}
                onChange={(newData) => onBlockDataChange(block.id, newData)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
