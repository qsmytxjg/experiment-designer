import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BookmarkPlus,
  Bug,
  Code,
  Copy,
  Download,
  FileText,
  FlaskConical,
  FolderOpen,
  Globe,
  Grip,
  GripVertical,
  Layout,
  Lightbulb,
  Save,
  Search,
  ShieldCheck,
  Tag,
  Thermometer,
  Trash2,
  X,
} from 'lucide-react';
import JsonEditor from './JsonEditor.jsx';
import { COMPONENT_REGISTRY } from './componentRegistry.js';
import {
  DEFAULT_BLOCK_DATA,
  INITIAL_TEMPLATE_BLOCKS,
  PUBLIC_TEMPLATES,
  TEMPLATE_COMPONENT_TYPES,
  VENDORS,
} from './templateData.js';

const COPY_SUFFIX = ' (Copy)';
const STORAGE_KEY = 'eln_templates_v2';

const TRANSLATIONS = {
  'zh-CN': {
    appTitle: '电子实验记录本 (ELN)',
    appSub: '标准化实验流程与数据提取',
    saveAsTemplateBtn: '保存完整流程',
    templateLibraryBtn: '模板库',
    devMode: '开发者模式',
    copyBlock: '复制此区块',
    deleteBlock: '删除此区块',
    saveBlockTemplate: '存为区块模板',
    moveUp: '向上移动',
    moveDown: '向下移动',
    dragHandle: '按住拖拽排序',
    insertBelow: '在下方插入',
    addNote: '备注',
    addReaction: '体系与PCR表',
    addThermo: '独立PCR条件',
    addPlate: '孔板/泳道',
    templateLibrary: '实验模板库',
    saveTemplate: '确认保存',
    loadTemplate: '调用 (覆盖)',
    loadBlock: '插入 (至底部)',
    templateNamePh: '请为此模板命名...',
    tipsTitle: '快速上手指南',
    tip1Bold: '拖拽排序：',
    tip1Text: '将鼠标移至区块左侧边缘，按住拖拽柄即可改变顺序。',
    tip2Bold: '快速插入：',
    tip2Text: '将鼠标移至区块下方，可随时在中间插入新区块。',
    tip3Bold: '官方配方：',
    tip3Text: '点击上方“模板库”，可直接调用各大厂标准配方与 PCR 程序。',
    publicLibrary: '官方标准库',
    privateLibrary: '我的私人模板',
    searchPh: '搜索厂家、货号或模板名称...',
    vendorLabel: '筛选厂家：',
    allVendors: '全部厂家',
    allTypes: '全部区块类型',
    typeFull: '完整流程',
    typeNote: '备注模板',
    typeReaction: '体系与 PCR',
    typeThermo: 'PCR 程序模板',
    typePlate: '孔板模板',
    jsonTitle: 'JSON 开发者调试窗口',
    emptyBlocks: '没有可渲染的实验区块。',
    noTemplates: '找不到符合条件的模板',
  },
  'zh-TW': {
    appTitle: '電子實驗紀錄本 (ELN)',
    appSub: '標準化實驗流程與數據擷取',
    saveAsTemplateBtn: '儲存完整流程',
    templateLibraryBtn: '模板庫',
    devMode: '開發者模式',
    copyBlock: '複製此區塊',
    deleteBlock: '刪除此區塊',
    saveBlockTemplate: '存為區塊模板',
    moveUp: '向上移動',
    moveDown: '向下移動',
    dragHandle: '按住拖曳排序',
    insertBelow: '在下方插入',
    addNote: '備註',
    addReaction: '體系與PCR表',
    addThermo: '獨立PCR條件',
    addPlate: '孔板/泳道',
    templateLibrary: '實驗模板庫',
    saveTemplate: '確認儲存',
    loadTemplate: '調用 (覆蓋)',
    loadBlock: '插入 (至底部)',
    templateNamePh: '請為此模板命名...',
    tipsTitle: '快速上手指南',
    tip1Bold: '拖曳排序：',
    tip1Text: '將滑鼠移至區塊左側邊緣，按住拖曳柄即可改變順序。',
    tip2Bold: '快速插入：',
    tip2Text: '將滑鼠移至區塊下方，可隨時在中間插入新區塊。',
    tip3Bold: '官方配方：',
    tip3Text: '點擊上方「模板庫」，可直接調用各大廠標準配方與 PCR 程式。',
    publicLibrary: '官方標準庫',
    privateLibrary: '我的私人模板',
    searchPh: '搜尋廠家、貨號或模板名稱...',
    vendorLabel: '篩選廠家：',
    allVendors: '全部廠家',
    allTypes: '全部區塊類型',
    typeFull: '完整流程',
    typeNote: '備註模板',
    typeReaction: '體系與 PCR',
    typeThermo: 'PCR 程式模板',
    typePlate: '孔板模板',
    jsonTitle: 'JSON 開發者調試視窗',
    emptyBlocks: '沒有可渲染的實驗區塊。',
    noTemplates: '找不到符合條件的模板',
  },
  en: {
    appTitle: 'Electronic Lab Notebook (ELN)',
    appSub: 'Standardized workflows and data capture',
    saveAsTemplateBtn: 'Save Workflow',
    templateLibraryBtn: 'Library',
    devMode: 'Dev Mode',
    copyBlock: 'Duplicate Block',
    deleteBlock: 'Delete Block',
    saveBlockTemplate: 'Save Block Template',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    dragHandle: 'Drag to reorder',
    insertBelow: 'Insert Below',
    addNote: 'Note',
    addReaction: 'Reaction & PCR',
    addThermo: 'Standalone PCR',
    addPlate: 'Plate/Gel',
    templateLibrary: 'Template Library',
    saveTemplate: 'Save',
    loadTemplate: 'Load (Replace)',
    loadBlock: 'Insert (Append)',
    templateNamePh: 'Name this template...',
    tipsTitle: 'Quick Start Guide',
    tip1Bold: 'Drag to reorder: ',
    tip1Text: 'Hover over the left edge of a block and drag the handle.',
    tip2Bold: 'Quick insert: ',
    tip2Text: 'Hover below a block to insert a new block in between.',
    tip3Bold: 'Official templates: ',
    tip3Text: 'Open Library to load standard recipes and PCR programs.',
    publicLibrary: 'Official Catalog',
    privateLibrary: 'My Templates',
    searchPh: 'Search vendor, catalog no. or name...',
    vendorLabel: 'Vendor:',
    allVendors: 'All Vendors',
    allTypes: 'All Types',
    typeFull: 'Full Workflow',
    typeNote: 'Note',
    typeReaction: 'Reaction & PCR',
    typeThermo: 'Thermocycle',
    typePlate: 'Plate',
    jsonTitle: 'JSON Developer Inspector',
    emptyBlocks: 'No experiment blocks to render.',
    noTemplates: 'No templates match the filters',
  },
};

const TYPE_NAMES = {
  full: 'typeFull',
  note: 'typeNote',
  reaction_table: 'typeReaction',
  thermocycle: 'typeThermo',
  plate_colorizer: 'typePlate',
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeBlock(type, data = DEFAULT_BLOCK_DATA[type]) {
  return { id: `blk-${Date.now()}-${Math.random().toString(16).slice(2)}`, type, data: clone(data) };
}

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function validateBlocks(value) {
  if (!Array.isArray(value)) return '最外层必须是数组 Array [...]';
  if (value.some((block) => !block.id || !block.type)) return '每个区块都必须包含 id 和 type';
  return null;
}

export default function TemplateEngine() {
  const canUseDeveloperPanel = import.meta.env.DEV;
  const [lang, setLang] = useState('zh-CN');
  const t = TRANSLATIONS[lang];
  const [blocks, setBlocks] = useState(INITIAL_TEMPLATE_BLOCKS);
  const [jsonText, setJsonText] = useState(formatJson(INITIAL_TEMPLATE_BLOCKS));
  const [error, setError] = useState(null);
  const [isDevMode, setIsDevMode] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'library', targetBlock: null });
  const [newTemplateName, setNewTemplateName] = useState('');
  const [libraryTab, setLibraryTab] = useState('public');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('All');
  const [dragEnabledIndex, setDragEnabledIndex] = useState(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedTemplates(JSON.parse(stored));
    } catch (storageError) {
      console.error(storageError);
    }
  }, []);

  function updateBlocks(nextBlocks) {
    setBlocks(nextBlocks);
    setJsonText(formatJson(nextBlocks));
  }

  function handleJsonTextChange(event) {
    const text = event.target.value;
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      const validationError = validateBlocks(parsed);
      if (validationError) {
        setError(validationError);
        return;
      }
      setBlocks(parsed);
      setError(null);
    } catch (parseError) {
      setError(`JSON 格式错误：${parseError.message}`);
    }
  }

  function handleFormatJson() {
    try {
      const parsed = JSON.parse(jsonText);
      const validationError = validateBlocks(parsed);
      if (validationError) {
        setError(validationError);
        return;
      }
      updateBlocks(parsed);
      setError(null);
    } catch (parseError) {
      setError(`JSON 格式错误：${parseError.message}`);
    }
  }

  function handleBlockDataChange(blockId, newData) {
    updateBlocks(blocks.map((block) => (block.id === blockId ? { ...block, data: newData } : block)));
  }

  function duplicateBlock(index) {
    const nextBlock = clone(blocks[index]);
    nextBlock.id = `blk-${Date.now()}`;
    if (nextBlock.data?.tableName) nextBlock.data.tableName += COPY_SUFFIX;
    if (nextBlock.data?.title) nextBlock.data.title += COPY_SUFFIX;
    const nextBlocks = [...blocks];
    nextBlocks.splice(index + 1, 0, nextBlock);
    updateBlocks(nextBlocks);
  }

  function deleteBlock(index) {
    updateBlocks(blocks.filter((_, currentIndex) => currentIndex !== index));
  }

  function insertBlock(index, type) {
    const nextBlocks = [...blocks];
    nextBlocks.splice(index + 1, 0, makeBlock(type));
    updateBlocks(nextBlocks);
  }

  function moveBlock(index, direction) {
    const nextBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [nextBlocks[index - 1], nextBlocks[index]] = [nextBlocks[index], nextBlocks[index - 1]];
    }
    if (direction === 'down' && index < nextBlocks.length - 1) {
      [nextBlocks[index + 1], nextBlocks[index]] = [nextBlocks[index], nextBlocks[index + 1]];
    }
    updateBlocks(nextBlocks);
  }

  function handleDragStart(event, index) {
    dragItem.current = index;
    event.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnter(index) {
    dragOverItem.current = index;
  }

  function handleDragEnd() {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const nextBlocks = [...blocks];
      const [draggedBlock] = nextBlocks.splice(dragItem.current, 1);
      nextBlocks.splice(dragOverItem.current, 0, draggedBlock);
      updateBlocks(nextBlocks);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDragEnabledIndex(null);
  }

  function handleSaveTemplate() {
    if (!newTemplateName.trim()) return;
    const templateType = modalConfig.mode === 'save_block' ? modalConfig.targetBlock.type : 'full';
    const templateData = modalConfig.mode === 'save_block' ? clone(modalConfig.targetBlock) : clone(blocks);
    const nextTemplates = [
      ...savedTemplates,
      { id: Date.now(), name: newTemplateName.trim(), type: templateType, data: templateData },
    ];
    setSavedTemplates(nextTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTemplates));
    setNewTemplateName('');
    setModalConfig({ isOpen: false, mode: 'library', targetBlock: null });
  }

  function handleLoadTemplate(template) {
    if (template.type === 'full') {
      updateBlocks(template.data.map((block) => ({ ...clone(block), id: `blk-${Date.now()}-${Math.random()}` })));
    } else {
      const newBlock = template.data?.id ? clone(template.data) : { type: template.type, data: clone(template.data?.data || template.data) };
      newBlock.id = `blk-${Date.now()}`;
      updateBlocks([...blocks, newBlock]);
    }
    setModalConfig({ isOpen: false, mode: 'library', targetBlock: null });
    setSearchQuery('');
  }

  function handleDeleteTemplate(templateId) {
    const nextTemplates = savedTemplates.filter((template) => template.id !== templateId);
    setSavedTemplates(nextTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTemplates));
  }

  let displayTemplates = libraryTab === 'public' ? PUBLIC_TEMPLATES : savedTemplates;
  if (filterType !== 'all') displayTemplates = displayTemplates.filter((template) => template.type === filterType);
  if (libraryTab === 'public' && selectedVendor !== 'All') {
    displayTemplates = displayTemplates.filter((template) => template.manufacturer === selectedVendor);
  }
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    displayTemplates = displayTemplates.filter((template) =>
      template.name.toLowerCase().includes(query) ||
      template.manufacturer?.toLowerCase().includes(query) ||
      template.catalog?.toLowerCase().includes(query),
    );
  }

  return (
    <div className="advanced-eln-app">
      <header className="eln-header">
        <div className="eln-brand">
          <div><Layout size={24} /></div>
          <span>
            <h1>{t.appTitle}</h1>
            <p>{t.appSub}</p>
          </span>
        </div>
        <div className="eln-header-actions">
          <button type="button" onClick={() => { setLibraryTab('public'); setModalConfig({ isOpen: true, mode: 'library', targetBlock: null }); }}>
            <FolderOpen size={16} /> {t.templateLibraryBtn}
          </button>
          <button className="primary" type="button" onClick={() => setModalConfig({ isOpen: true, mode: 'save_full', targetBlock: null })}>
            <Save size={17} /> {t.saveAsTemplateBtn}
          </button>
          {canUseDeveloperPanel && (
            <button className={isDevMode ? 'dev active' : 'dev'} type="button" onClick={() => setIsDevMode((value) => !value)}>
              <Code size={16} /> {t.devMode}
            </button>
          )}
          <div className="eln-language">
            <Globe size={15} />
            {['zh-TW', 'zh-CN', 'en'].map((item) => (
              <button className={lang === item ? 'active' : ''} type="button" key={item} onClick={() => setLang(item)}>
                {item === 'zh-TW' ? '繁' : item === 'zh-CN' ? '简' : 'EN'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {modalConfig.isOpen && (
        <div className="eln-modal-backdrop">
          <div className="eln-modal">
            <div className="eln-modal-header">
              <h2>
                {modalConfig.mode === 'library' && <><FolderOpen size={20} /> {t.templateLibrary}</>}
                {modalConfig.mode === 'save_full' && <><Save size={20} /> {t.saveAsTemplateBtn}</>}
                {modalConfig.mode === 'save_block' && <><BookmarkPlus size={20} /> {t.saveBlockTemplate}</>}
              </h2>
              <button type="button" onClick={() => setModalConfig({ isOpen: false, mode: 'library', targetBlock: null })}><X size={20} /></button>
            </div>

            {(modalConfig.mode === 'save_full' || modalConfig.mode === 'save_block') && (
              <div className="eln-save-template">
                <strong>{t[TYPE_NAMES[modalConfig.mode === 'save_block' ? modalConfig.targetBlock.type : 'full']]}</strong>
                <input
                  autoFocus
                  value={newTemplateName}
                  onChange={(event) => setNewTemplateName(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleSaveTemplate()}
                  placeholder={t.templateNamePh}
                />
                <button type="button" disabled={!newTemplateName.trim()} onClick={handleSaveTemplate}>
                  <Save size={16} /> {t.saveTemplate}
                </button>
              </div>
            )}

            {modalConfig.mode === 'library' && (
              <>
                <div className="template-tabs">
                  <button className={libraryTab === 'public' ? 'active' : ''} type="button" onClick={() => setLibraryTab('public')}>
                    <ShieldCheck size={16} /> {t.publicLibrary}
                  </button>
                  <button className={libraryTab === 'private' ? 'active' : ''} type="button" onClick={() => setLibraryTab('private')}>
                    <FolderOpen size={16} /> {t.privateLibrary}
                  </button>
                </div>
                <div className="template-search">
                  <Search size={16} />
                  <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t.searchPh} />
                </div>
                <div className="template-filters">
                  <div>
                    {['all', 'full', ...TEMPLATE_COMPONENT_TYPES.map((item) => item.type)].map((type) => (
                      <button className={filterType === type ? 'active' : ''} key={type} type="button" onClick={() => setFilterType(type)}>
                        {type === 'all' ? t.allTypes : t[TYPE_NAMES[type]]}
                      </button>
                    ))}
                  </div>
                  {libraryTab === 'public' && (
                    <div>
                      <span><Tag size={12} /> {t.vendorLabel}</span>
                      {['All', ...VENDORS].map((vendor) => (
                        <button className={selectedVendor === vendor ? 'active dark' : ''} key={vendor} type="button" onClick={() => setSelectedVendor(vendor)}>
                          {vendor === 'All' ? t.allVendors : vendor}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="template-list">
                  {displayTemplates.length === 0 && <div className="template-empty">{t.noTemplates}</div>}
                  {displayTemplates.map((template) => (
                    <article key={template.id} className="template-list-item">
                      <div>
                        <h3>
                          {template.manufacturer && <span>{template.manufacturer}</span>}
                          {template.catalog && <code>{template.catalog}</code>}
                          {template.name}
                        </h3>
                        <p>{template.type === 'full' ? `${template.data.length} 个实验区块` : t[TYPE_NAMES[template.type]]}</p>
                      </div>
                      <div>
                        <button type="button" onClick={() => handleLoadTemplate(template)}>
                          <Download size={14} /> {template.type === 'full' ? t.loadTemplate : t.loadBlock}
                        </button>
                        {libraryTab === 'private' && (
                          <button className="danger-icon" type="button" onClick={() => handleDeleteTemplate(template.id)}><Trash2 size={16} /></button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <main className={isDevMode ? 'eln-workspace with-dev' : 'eln-workspace'}>
        {canUseDeveloperPanel && isDevMode && (
          <section className="eln-dev-panel">
            <div className="eln-dev-title"><Bug size={16} /> {t.jsonTitle}</div>
            <JsonEditor error={error} jsonText={jsonText} onJsonTextChange={handleJsonTextChange} />
            <button type="button" onClick={handleFormatJson}>Format / Validate</button>
          </section>
        )}

        <section className="eln-blocks">
          {showTips && (
            <aside className="eln-tips">
              <button type="button" onClick={() => setShowTips(false)}><X size={18} /></button>
              <h3><Lightbulb size={18} /> {t.tipsTitle}</h3>
              <p><strong>{t.tip1Bold}</strong>{t.tip1Text}</p>
              <p><strong>{t.tip2Bold}</strong>{t.tip2Text}</p>
              <p><strong>{t.tip3Bold}</strong>{t.tip3Text}</p>
            </aside>
          )}

          {blocks.length === 0 && <div className="empty-template-state">{t.emptyBlocks}</div>}

          {blocks.map((block, index) => {
            const TargetComponent = COMPONENT_REGISTRY[block.type];
            const isFirst = index === 0;
            const isLast = index === blocks.length - 1;
            const isDraggingEnabled = dragEnabledIndex === index;

            if (!TargetComponent) {
              return (
                <div className="unknown-template-block" key={block.id}>
                  <AlertCircle size={18} /> 未知的组件类型: <strong>{block.type}</strong>
                </div>
              );
            }

            return (
              <article
                className={isDraggingEnabled ? 'eln-block-shell dragging' : 'eln-block-shell'}
                draggable={isDraggingEnabled}
                key={block.id}
                onDragStart={(event) => handleDragStart(event, index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(event) => event.preventDefault()}
              >
                {canUseDeveloperPanel && isDevMode && <div className="block-type-badge">{block.type}</div>}
                <button
                  className="block-drag-handle"
                  type="button"
                  title={t.dragHandle}
                  onMouseEnter={() => setDragEnabledIndex(index)}
                  onMouseLeave={() => setDragEnabledIndex(null)}
                >
                  <GripVertical size={20} />
                </button>
                <div className="block-actions">
                  <button type="button" onClick={() => moveBlock(index, 'up')} disabled={isFirst} title={t.moveUp}><ArrowUp size={16} /></button>
                  <button type="button" onClick={() => moveBlock(index, 'down')} disabled={isLast} title={t.moveDown}><ArrowDown size={16} /></button>
                  <button type="button" onClick={() => setModalConfig({ isOpen: true, mode: 'save_block', targetBlock: block })} title={t.saveBlockTemplate}><BookmarkPlus size={16} /></button>
                  <button type="button" onClick={() => duplicateBlock(index)} title={t.copyBlock}><Copy size={16} /></button>
                  <button type="button" onClick={() => deleteBlock(index)} title={t.deleteBlock}><Trash2 size={16} /></button>
                </div>
                <TargetComponent data={block.data || {}} onChange={(newData) => handleBlockDataChange(block.id, newData)} />
                <div className="insert-block-bar">
                  <span>{t.insertBelow}</span>
                  <button type="button" onClick={() => insertBlock(index, 'note')}><FileText size={14} /> {t.addNote}</button>
                  <button type="button" onClick={() => insertBlock(index, 'reaction_table')}><FlaskConical size={14} /> {t.addReaction}</button>
                  <button type="button" onClick={() => insertBlock(index, 'thermocycle')}><Thermometer size={14} /> {t.addThermo}</button>
                  <button type="button" onClick={() => insertBlock(index, 'plate_colorizer')}><Grip size={14} /> {t.addPlate}</button>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
