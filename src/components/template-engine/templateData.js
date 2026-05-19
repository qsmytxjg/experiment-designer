export const INITIAL_TEMPLATE_BLOCKS = [
  {
    id: 'block-1',
    type: 'note',
    data: {
      title: '实验目标',
      content: '测试不同浓度 Drug A 对 HeLa 细胞的毒性反应 (IC50)。',
    },
  },
  {
    id: 'block-2',
    type: 'reaction_table',
    data: {
      tableName: '药物稀释体系 (Master Mix)',
      reagents: [
        { name: 'DMEM Medium', volume: 90, finalConc: '-' },
        { name: 'Drug A (10mM Stock)', volume: 10, finalConc: '1mM' },
      ],
    },
  },
  {
    id: 'block-3',
    type: 'plate_viewer',
    data: {
      title: '加药孔板设计',
      format: '96-well',
      wells: {
        A1: '#ef4444',
        A2: '#ef4444',
        A3: '#ef4444',
        B1: '#3b82f6',
        B2: '#3b82f6',
        B3: '#3b82f6',
      },
    },
  },
];

export const TEMPLATE_COMPONENT_TYPES = [
  { type: 'note', label: '备注文本' },
  { type: 'reaction_table', label: '体系配置表' },
  { type: 'plate_viewer', label: '布板预览' },
];
