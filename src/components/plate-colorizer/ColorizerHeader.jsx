import { Download, Globe, Palette, RefreshCw } from 'lucide-react';

const LANG_OPTIONS = ['zh-TW', 'zh-CN', 'en'];

function getLangLabel(lang) {
  if (lang === 'zh-TW') return '繁';
  if (lang === 'zh-CN') return '简';
  return 'EN';
}

export default function ColorizerHeader({ lang, onClearCanvas, onExportImage, onLangChange, t }) {
  return (
    <header className="colorizer-header">
      <div className="brand-lockup">
        <div className="brand-icon">
          <Palette size={24} />
        </div>
        <h1>{t.title}</h1>
      </div>

      <div className="header-actions">
        <div className="language-switcher" aria-label="Language">
          <Globe size={16} />
          {LANG_OPTIONS.map((option) => (
            <button
              className={lang === option ? 'active' : ''}
              key={option}
              type="button"
              onClick={() => onLangChange(option)}
            >
              {getLangLabel(option)}
            </button>
          ))}
        </div>
        <button type="button" onClick={onClearCanvas}>
          <RefreshCw size={18} />
          {t.clearCanvas}
        </button>
        <button className="primary" type="button" onClick={onExportImage}>
          <Download size={18} />
          {t.exportImage}
        </button>
      </div>
    </header>
  );
}
