import React, { useState } from 'react';
import { useAltivio } from '../../context/AltivioContext';
import { 
  Edit3, 
  Save, 
  Check, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  Clock, 
  Layers,
  Info
} from 'lucide-react';

export const ContentEditorView: React.FC = () => {
  const { activeTenant, updateContentBlock } = useAltivio();
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    activeTenant.contentBlocks.forEach((b) => {
      initial[b.id] = b.content;
    });
    return initial;
  });

  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const handleTextChange = (id: string, text: string) => {
    setDrafts((prev) => ({ ...prev, [id]: text }));
    if (savedStatus[id]) {
      setSavedStatus((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSaveBlock = (blockId: string) => {
    const content = drafts[blockId] ?? '';
    updateContentBlock(activeTenant.id, blockId, content);
    setSavedStatus((prev) => ({ ...prev, [blockId]: true }));
    setTimeout(() => {
      setSavedStatus((prev) => ({ ...prev, [blockId]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Website Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Base Website Tool
            </span>
            <span className="text-slate-400 text-xs">Zero-Code Content Engine</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1 font-display">
            Content Quick Editor
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Safely update website headlines, promotional notices, and business hours. Changes deploy automatically to {activeTenant.customDomain}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://${activeTenant.customDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-lg transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Visit Live Website</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-white">Guaranteed Layout Stability</div>
          <p className="text-slate-400">
            Altivio's design framework protects your site's speed and styling. Editing copy here never breaks mobile responsiveness, SEO tags, or typography systems.
          </p>
        </div>
      </div>

      {/* Editable Content Blocks */}
      <div className="grid grid-cols-1 gap-5">
        {activeTenant.contentBlocks.map((block) => {
          const isSaved = savedStatus[block.id];
          const currentVal = drafts[block.id] ?? block.content;
          const hasChanged = currentVal !== block.content;

          return (
            <div
              key={block.id}
              className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                    {block.section}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {block.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-[11px] font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    Last updated: {block.lastUpdated}
                  </span>
                </div>
              </div>

              <div>
                <textarea
                  rows={currentVal.length > 80 ? 3 : 2}
                  value={currentVal}
                  onChange={(e) => handleTextChange(block.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-sans resize-y"
                  placeholder="Enter text..."
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono">
                  {currentVal.length} characters
                </span>

                <button
                  onClick={() => handleSaveBlock(block.id)}
                  disabled={!hasChanged && !isSaved}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : hasChanged
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Published to Live Site!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{hasChanged ? 'Save & Publish Live' : 'Up to date'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Need something more advanced box */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-white">Need a structural redesign or new page section?</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Your Altivio team handles custom component development, integrations, and new landing pages under your monthly plan.
          </p>
        </div>
        <span className="text-xs font-mono text-indigo-400">Included in Altivio Plan</span>
      </div>
    </div>
  );
};
