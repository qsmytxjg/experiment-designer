export const DEFAULT_THERMOCYCLE = [
  { phase: 'Initial Denaturation', temp: '95', time: '3 min', cycles: '1' },
  { phase: 'Denaturation', temp: '95', time: '15 sec', cycles: '35' },
  { phase: 'Annealing', temp: '60', time: '15 sec', cycles: '-' },
  { phase: 'Extension', temp: '72', time: '1 min', cycles: '-' },
  { phase: 'Final Extension', temp: '72', time: '5 min', cycles: '1' },
  { phase: 'Hold', temp: '4', time: '∞', cycles: '1' },
];

export const INITIAL_TEMPLATE_BLOCKS = [
  {
    id: 'blk-1',
    type: 'note',
    data: {
      title: '实验目标 (Experiment Objective)',
      content: '请在此记录实验目的。提示：点击上方“模板库”可载入内置的官方标准配方。',
    },
  },
  {
    id: 'blk-2',
    type: 'reaction_table',
    data: {
      tableName: '常规 qPCR 体系配制',
      totalVolPerRxn: 20,
      volUnit: 'μL',
      targetRxns: 10,
      overageMode: 'tubes',
      overageTubes: 0.5,
      overagePercent: 5,
      hasThermocycle: false,
      reagents: [
        { name: '2x SYBR Green Master Mix', type: 'mix', volPerRxn: 10, inMix: true },
        { name: 'Forward Primer (10 uM)', type: 'primer', volPerRxn: 0.4, inMix: true },
        { name: 'Reverse Primer (10 uM)', type: 'primer', volPerRxn: 0.4, inMix: true },
        { name: 'cDNA Template', type: 'sample', volPerRxn: 2, inMix: false },
        { name: 'ddH2O', type: 'water', volPerRxn: 0, inMix: true },
      ],
    },
  },
  {
    id: 'blk-3',
    type: 'plate_colorizer',
    data: {
      title: '96 孔板加样配置图',
      formatId: '96-well',
      colors: {
        A1: '#3b82f6',
        A2: '#3b82f6',
        A3: '#3b82f6',
      },
      legends: {
        '#3b82f6': 'Sample A',
      },
    },
  },
  {
    id: 'blk-4',
    type: 'thermocycle',
    data: {
      title: 'qPCR 上机扩增程序 (Thermal Cycle)',
      steps: [
        { phase: 'Initial Denaturation', temp: '95', time: '3 min', cycles: '1' },
        { phase: 'Denaturation', temp: '95', time: '10 sec', cycles: '40' },
        { phase: 'Anneal / Extension', temp: '60', time: '30 sec', cycles: '-' },
        { phase: 'Melt Curve', temp: '95', time: '15 sec', cycles: '1' },
        { phase: 'Melt Curve', temp: '60', time: '1 min', cycles: '1' },
        { phase: 'Melt Curve', temp: '95', time: '15 sec', cycles: '1' },
      ],
    },
  },
];

export const DEFAULT_BLOCK_DATA = {
  note: { title: '', content: '' },
  reaction_table: {
    tableName: '',
    totalVolPerRxn: 20,
    volUnit: 'μL',
    targetRxns: 10,
    overageMode: 'tubes',
    overageTubes: 0.5,
    overagePercent: 5,
    hasThermocycle: false,
    reagents: [],
  },
  thermocycle: { title: '', steps: [{ phase: '', temp: '', time: '', cycles: '' }] },
  plate_colorizer: { title: '', formatId: '96-well', colors: {}, legends: {} },
};

export const TEMPLATE_COMPONENT_TYPES = [
  { type: 'note', label: '备注' },
  { type: 'reaction_table', label: '体系与 PCR 表' },
  { type: 'thermocycle', label: '独立 PCR 条件' },
  { type: 'plate_colorizer', label: '孔板/泳道' },
];

export const PUBLIC_TEMPLATES = [
  {
    id: 'pub-vazyme-q711',
    manufacturer: 'Vazyme',
    catalog: 'Q711',
    name: 'ChamQ SYBR qPCR Master Mix',
    type: 'reaction_table',
    data: {
      type: 'reaction_table',
      data: {
        tableName: 'Vazyme SYBR qPCR (Q711)',
        totalVolPerRxn: 20,
        volUnit: 'μL',
        targetRxns: 10,
        overageMode: 'tubes',
        overageTubes: 0.5,
        overagePercent: 5,
        hasThermocycle: true,
        reagents: [
          { name: '2x ChamQ SYBR qPCR Master Mix', type: 'mix', volPerRxn: 10, inMix: true },
          { name: 'Primer 1 (10 uM)', type: 'primer', volPerRxn: 0.4, inMix: true },
          { name: 'Primer 2 (10 uM)', type: 'primer', volPerRxn: 0.4, inMix: true },
          { name: 'Template DNA/cDNA', type: 'sample', volPerRxn: 2, inMix: false },
          { name: 'ddH2O', type: 'water', volPerRxn: 0, inMix: true },
        ],
        thermocycle: [
          { phase: 'Initial Denaturation', temp: '95', time: '3 min', cycles: '1' },
          { phase: 'Denaturation', temp: '95', time: '10 sec', cycles: '40' },
          { phase: 'Anneal / Extension', temp: '60', time: '30 sec', cycles: '-' },
          { phase: 'Melt Curve', temp: '95', time: '15 sec', cycles: '1' },
          { phase: 'Melt Curve', temp: '60', time: '1 min', cycles: '1' },
          { phase: 'Melt Curve', temp: '95', time: '15 sec', cycles: '1' },
        ],
      },
    },
  },
  {
    id: 'pub-neb-m0492',
    manufacturer: 'NEB',
    catalog: 'M0492',
    name: 'Q5 High-Fidelity 2X Master Mix',
    type: 'reaction_table',
    data: {
      type: 'reaction_table',
      data: {
        tableName: 'NEB Q5 PCR System (M0492)',
        totalVolPerRxn: 25,
        volUnit: 'μL',
        targetRxns: 10,
        overageMode: 'tubes',
        overageTubes: 0.5,
        overagePercent: 5,
        hasThermocycle: true,
        reagents: [
          { name: 'Q5 High-Fidelity 2X Master Mix', type: 'mix', volPerRxn: 12.5, inMix: true },
          { name: '10 uM Forward Primer', type: 'primer', volPerRxn: 1.25, inMix: true },
          { name: '10 uM Reverse Primer', type: 'primer', volPerRxn: 1.25, inMix: true },
          { name: 'Template DNA', type: 'sample', volPerRxn: 1, inMix: false },
          { name: 'Nuclease-Free Water', type: 'water', volPerRxn: 0, inMix: true },
        ],
        thermocycle: [
          { phase: 'Initial Denaturation', temp: '98', time: '30 sec', cycles: '1' },
          { phase: 'Denaturation', temp: '98', time: '10 sec', cycles: '25-35' },
          { phase: 'Annealing', temp: '50-72', time: '30 sec', cycles: '-' },
          { phase: 'Extension', temp: '72', time: '20-30 s/kb', cycles: '-' },
          { phase: 'Final Extension', temp: '72', time: '2 min', cycles: '1' },
          { phase: 'Hold', temp: '4', time: '∞', cycles: '1' },
        ],
      },
    },
  },
  {
    id: 'pub-takara-c112',
    manufacturer: 'Takara',
    catalog: 'C112',
    name: 'ClonExpress II One Step Cloning',
    type: 'reaction_table',
    data: {
      type: 'reaction_table',
      data: {
        tableName: 'Takara ClonExpress II (C112)',
        totalVolPerRxn: 20,
        volUnit: 'μL',
        targetRxns: 10,
        overageMode: 'tubes',
        overageTubes: 0,
        overagePercent: 0,
        hasThermocycle: true,
        reagents: [
          { name: '5x CE II Buffer', type: 'mix', volPerRxn: 4, inMix: true },
          { name: 'Exnase II', type: 'enzyme', volPerRxn: 2, inMix: true },
          { name: 'Linearized Vector', type: 'sample', volPerRxn: 2, inMix: false },
          { name: 'Insert (Fragment)', type: 'sample', volPerRxn: 2, inMix: false },
          { name: 'ddH2O', type: 'water', volPerRxn: 0, inMix: true },
        ],
        thermocycle: [
          { phase: 'Recombination', temp: '50', time: '5 - 15 min', cycles: '1' },
          { phase: 'Hold', temp: '4', time: '∞', cycles: '1' },
        ],
      },
    },
  },
];

export const VENDORS = [...new Set(PUBLIC_TEMPLATES.map((template) => template.manufacturer))];
