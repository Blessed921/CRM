/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useBaseTenantActions } from '../../hooks/useBaseTenantActions';
import { Save, Check, Globe, ExternalLink, Clock, Info } from 'lucide-react';

export const ContentEditorView: React.FC = () => {
  const { tenant } = useTenant();
  const { updateContentBlock } = useBaseTenantActions();

  const [edits, setEdits] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const editKeyFor = (blockId: string) => `${tenant.id}:${blockId}`;

  const handleTextChange = (blockId: string, text: string) => {
    const key = editKeyFor(blockId);
    setEdits((prev) => ({ ...prev, [key]: text }));
    if (savedStatus[key]) {
      setSavedStatus((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSaveBlock = async (blockId: string, fallbackContent: string) => {
    const key = editKeyFor(blockId);
    const content = edits[key] ?? fallbackContent;
    setSavingId(blockId);
    try {
      await updateContentBlock(blockId, content);
      setEdits((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setSavedStatus((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setSavedStatus((prev) => ({ ...prev, [key]: false }));
      }, 2500);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Website Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Base Website Tool
            </span>
            <span aria-hidden="true">·</span>
            <span>Zero-Code Content Engine</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-display">
            Content Quick Editor
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Safely update website headlines, promotional notices, and business hours. Changes deploy
            automatically to {tenant.customDomain}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://${tenant.customDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Visit Live Website</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <div className="font-semibold text-slate-900 dark:text-white">
            Guaranteed Layout Stability
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Altivio&apos;s design framework protects your site&apos;s speed and styling. Editing
            copy here never breaks mobile responsiveness, SEO tags, or typography systems.
          </p>
        </div>
      </div>

      {/* Editable Content Blocks */}
      <div className="grid grid-cols-1 gap-5">
        {tenant.contentBlocks.map((block) => {
          const key = editKeyFor(block.id);
          const isSaved = savedStatus[key];
          const currentVal = edits[key] ?? block.content;
          const hasChanged = currentVal !== block.content;
          const isSaving = savingId === block.id;

          return (
            <div
              key={block.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    {block.section}
                  </span>
                  <span className="text-slate-400" aria-hidden="true">
                    ·
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {block.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-[11px] font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Last updated: {block.lastUpdated}
                  </span>
                </div>
              </div>

              <div>
                <textarea
                  rows={currentVal.length > 80 ? 3 : 2}
                  value={currentVal}
                  onChange={(e) => handleTextChange(block.id, e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-sans resize-y"
                  placeholder="Enter text..."
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                  {currentVal.length} characters
                </span>

                <button
                  type="button"
                  onClick={() => handleSaveBlock(block.id, block.content)}
                  disabled={(!hasChanged && !isSaved) || isSaving}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : hasChanged
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
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
                      <span>
                        {isSaving
                          ? 'Publishing...'
                          : hasChanged
                            ? 'Save & Publish Live'
                            : 'Up to date'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold text-slate-900 dark:text-white">
            Need a structural redesign or new page section?
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Your Altivio team handles custom component development, integrations, and new landing
            pages under your monthly plan.
          </p>
        </div>
        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 shrink-0">
          Included in Altivio Plan
        </span>
      </div>
    </div>
  );
};
