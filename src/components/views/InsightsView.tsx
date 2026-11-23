/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useBaseTenantActions } from '../../hooks/useBaseTenantActions';
import { apiFetch } from '../../api/client';
import type { GeminiInsightResponse, ActionableSuggestion } from '../../types/altivio';
import { Sparkles, RefreshCw, Send, Check, Headphones, Edit3 } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { tenant } = useTenant();
  const { createSupportTicket } = useBaseTenantActions();
  const navigate = useNavigate();

  const [refreshing, setRefreshing] = useState(false);
  const [askingCustom, setAskingCustom] = useState(false);
  const [insightsState, setInsightsState] = useState<{
    tenantId: string | null;
    data: GeminiInsightResponse | null;
    error: string | null;
  }>({
    tenantId: null,
    data: null,
    error: null,
  });
  const [ticketSentMap, setTicketSentMap] = useState<Record<string, boolean>>({});
  const [customQuestion, setCustomQuestion] = useState('');

  useEffect(() => {
    let cancelled = false;
    apiFetch<GeminiInsightResponse>('/api/gemini/insights', {
      method: 'POST',
      body: JSON.stringify({ tenantId: tenant.id }),
    })
      .then((data) => {
        if (!cancelled) {
          setInsightsState({ tenantId: tenant.id, data, error: null });
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setInsightsState({
            tenantId: tenant.id,
            data: null,
            error: err.message || 'Unable to generate AI insights.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tenant.id]);

  const loading = insightsState.tenantId !== tenant.id || refreshing;
  const insights = insightsState.tenantId === tenant.id ? insightsState.data : null;
  const error = insightsState.tenantId === tenant.id ? insightsState.error : null;

  const fetchInsights = useCallback(
    async (question?: string) => {
      if (question) {
        setAskingCustom(true);
      } else {
        setRefreshing(true);
      }

      try {
        const data = await apiFetch<GeminiInsightResponse>('/api/gemini/insights', {
          method: 'POST',
          body: JSON.stringify({
            tenantId: tenant.id,
            customQuestion: question || undefined,
          }),
        });
        setInsightsState({ tenantId: tenant.id, data, error: null });
      } catch (err: any) {
        setInsightsState((prev) => ({
          tenantId: tenant.id,
          data: prev.tenantId === tenant.id ? prev.data : null,
          error: err.message || 'Unable to generate AI insights.',
        }));
      } finally {
        setRefreshing(false);
        setAskingCustom(false);
      }
    },
    [tenant.id]
  );

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || askingCustom) return;
    fetchInsights(customQuestion.trim());
    setCustomQuestion('');
  };

  const handleDispatchTicket = async (suggestion: ActionableSuggestion) => {
    await createSupportTicket({
      subject: `Implement AI Suggestion: ${suggestion.title}`,
      category: 'Feature Request',
      priority: suggestion.impact === 'High Impact' ? 'High' : 'Normal',
    });
    setTicketSentMap((prev) => ({ ...prev, [suggestion.id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gemini Growth Intelligence · Automated Traffic &amp; Revenue Analysis</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-display">
            Weekly AI Growth Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Server-side analysis of {tenant.name}'s traffic attribution, funnel conversions, and
            deal velocity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchInsights()}
          disabled={loading || askingCustom}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--brand-accent)' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing Data...' : 'Re-Analyze Weekly Data'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => fetchInsights()}
            className="underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {loading && !insights && (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 bg-slate-200 dark:bg-slate-900 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-36 bg-slate-200 dark:bg-slate-900 rounded-xl" />
            <div className="h-36 bg-slate-200 dark:bg-slate-900 rounded-xl" />
            <div className="h-36 bg-slate-200 dark:bg-slate-900 rounded-xl" />
          </div>
        </div>
      )}

      {insights && (
        <>
          {/* Executive Synthesis Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-600 dark:text-slate-300">
                <span>{insights.weekLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {insights.healthRating}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Audited against {tenant.customDomain}
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display leading-snug">
                {insights.headline}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                {insights.executiveOverview}
              </p>
            </div>
          </div>

          {/* 3 Weekly Summary Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Weekly Performance Breakdown Cards
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                3 Dimensions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.summaryCards.map((card) => {
                const isPositive = card.status === 'positive';
                const isWarning = card.status === 'warning';

                return (
                  <div
                    key={card.id}
                    className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                          {card.title}
                        </span>
                        <span
                          className={`font-mono text-[11px] ${
                            isPositive
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isWarning
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-indigo-600 dark:text-indigo-400'
                          }`}
                        >
                          {card.badge}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                          {card.metricValue}
                        </div>
                        <div
                          className={`text-[11px] font-mono mt-0.5 ${
                            isPositive
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isWarning
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-indigo-600 dark:text-indigo-300'
                          }`}
                        >
                          {card.metricDelta}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800">
                      {card.analysis}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Prioritized Actionable Suggestions
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  High-leverage website and sales actions recommended to unlock revenue
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Combined Lift Potential: +$11,800/mo
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {insights.actionableSuggestions.map((sug, idx) => {
                const isSent = ticketSentMap[sug.id];

                return (
                  <div
                    key={sug.id || idx}
                    className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                          <span>{sug.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                            {sug.impact}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{sug.effort}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                          {sug.title}
                        </h4>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Estimated Monthly Lift
                        </div>
                        <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {sug.estimatedLift}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {sug.rationale}
                    </p>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/70 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 font-mono">
                        Tactical Action Plan
                      </div>
                      <div className="space-y-1.5">
                        {sug.actionPlan.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
                          >
                            <span className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => navigate(`/app/${tenant.slug}/content`)}
                        className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Website Copy</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDispatchTicket(sug)}
                        disabled={isSent}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          isSent
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'text-white'
                        }`}
                        style={!isSent ? { backgroundColor: 'var(--brand-accent)' } : undefined}
                      >
                        {isSent ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Dispatched to Altivio Team</span>
                          </>
                        ) : (
                          <>
                            <Headphones className="w-3.5 h-3.5" />
                            <span>Dispatch to Altivio Team</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Explore Bar */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                Ask Gemini About {tenant.name}'s Data
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test growth hypotheses or request custom advice based on your live website telemetry.
            </p>

            <form onSubmit={handleAskCustom} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. How can we convert more of our mobile Instagram visitors?"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!customQuestion.trim() || askingCustom}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{askingCustom ? 'Analyzing...' : 'Ask AI'}</span>
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 font-mono">
              <span>Try:</span>
              <button
                type="button"
                onClick={() =>
                  fetchInsights('What is our biggest conversion bottleneck right now?')
                }
                className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 underline cursor-pointer"
              >
                What is our biggest bottleneck?
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => fetchInsights('How can we increase average deal size?')}
                className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 underline cursor-pointer"
              >
                How to increase average deal size?
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
