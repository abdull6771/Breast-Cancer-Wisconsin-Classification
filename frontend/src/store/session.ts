import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AnalysisSession } from '@/types/clinical';

interface SessionState {
  lastAnalysis: AnalysisSession | null;
  lastRecommendation: string | null;
  lastReportGeneratedAt: string | null;
  sidebarCollapsed: boolean;
  geminiKey: string;
  setAnalysis: (analysis: AnalysisSession) => void;
  setRecommendation: (markdown: string | null) => void;
  markReportGenerated: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setGeminiKey: (key: string) => void;
  clearAnalysis: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      lastAnalysis: null,
      lastRecommendation: null,
      lastReportGeneratedAt: null,
      sidebarCollapsed: false,
      geminiKey: '',
      setAnalysis: (analysis) =>
        set({
          lastAnalysis: analysis,
          lastRecommendation: null,
          lastReportGeneratedAt: null,
        }),
      setRecommendation: (markdown) => set({ lastRecommendation: markdown }),
      markReportGenerated: () =>
        set({ lastReportGeneratedAt: new Date().toISOString() }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setGeminiKey: (key) => set({ geminiKey: key }),
      clearAnalysis: () =>
        set({
          lastAnalysis: null,
          lastRecommendation: null,
          lastReportGeneratedAt: null,
        }),
    }),
    {
      name: 'bcw-clinical-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        lastAnalysis: state.lastAnalysis,
        lastRecommendation: state.lastRecommendation,
        lastReportGeneratedAt: state.lastReportGeneratedAt,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
