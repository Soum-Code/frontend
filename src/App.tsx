import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  DesignMode,
  ProductTab,
  TextDensity,
  Agent,
  Trace,
  Span,
  Incident,
  DriftProfile,
  Dataset,
  Experiment,
  TelemetryProject
} from './types';
import { auth, onAuthStateChanged, subscribeToUserProjects } from './lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import {
  INITIAL_AGENTS,
  INITIAL_TRACES,
  INITIAL_INCIDENTS,
  INITIAL_DRIFT_PROFILES,
  INITIAL_DATASETS,
  INITIAL_EXPERIMENTS
} from './data/mockTelemetry';

// Public Experience components
import { PublicExperience } from './components/public/PublicExperience';
import { LiquidBackgroundCanvas } from './components/public/LiquidBackgroundCanvas';

// Product Experience components
import { ProductHeader } from './components/product/ProductHeader';
import { FloatingDock } from './components/product/FloatingDock';
import { CommandPalette } from './components/product/CommandPalette';
import { OverviewView } from './components/product/OverviewView';
import { AgentsView } from './components/product/AgentsView';
import { TracesView } from './components/product/TracesView';
import { IncidentsView } from './components/product/IncidentsView';
import { PerformanceView } from './components/product/PerformanceView';
import { DriftView } from './components/product/DriftView';
import { ExperimentsView } from './components/product/ExperimentsView';
import { DatasetsView } from './components/product/DatasetsView';
import { ReplayView } from './components/product/ReplayView';
import { TelemetryLabView } from './components/product/TelemetryLabView';
import { SettingsView } from './components/product/SettingsView';
import { ShortcutsHelpModal } from './components/product/ShortcutsHelpModal';
import { ActiveContextPanel } from './components/product/ActiveContextPanel';
import { AuthModal } from './components/product/AuthModal';
import { ProjectSelectorModal } from './components/product/ProjectSelectorModal';
import { AnimeTabTransitionContainer } from './components/product/AnimeTabTransitionContainer';
import { initLiquidCardSpringListener, triggerCardEntranceAnimation } from './utils/liquidHoverAnime';

export default function App() {
  // Mode state: 'public' (editorial, spatial) vs 'product' (calm, precise, investigative)
  const [mode, setMode] = useState<DesignMode>('public');

  // Product tab state
  const [productTab, setProductTab] = useState<ProductTab>('overview');

  // Context-Preserving selection states (The Most Important UX Pattern: Agent A ↳ Trace 483 ↳ Span 7)
  const [selectedAgent, setSelectedAgent] = useState<Agent | undefined>(undefined);
  const [selectedTrace, setSelectedTrace] = useState<Trace | undefined>(undefined);
  const [selectedSpan, setSelectedSpan] = useState<Span | undefined>(undefined);
  const [selectedIncident, setSelectedIncident] = useState<Incident | undefined>(undefined);

  // Active Context Side-Panel open & pinned states
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true);
  const [isContextPanelPinned, setIsContextPanelPinned] = useState(true);

  // Core telemetry state collections
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [traces, setTraces] = useState<Trace[]>(INITIAL_TRACES);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [driftProfiles, setDriftProfiles] = useState<DriftProfile[]>(INITIAL_DRIFT_PROFILES);
  const [datasets, setDatasets] = useState<Dataset[]>(INITIAL_DATASETS);
  const [experiments, setExperiments] = useState<Experiment[]>(INITIAL_EXPERIMENTS);

  // Command palette and shortcuts help modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  // Live telemetry pulse simulator toggle
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);
  const [resolutionToast, setResolutionToast] = useState<{ id: string; title: string; isWarning?: boolean } | null>(null);

  // Refs for fresh state access in keyboard listeners without unnecessary re-attaching
  const selectedIncidentRef = useRef(selectedIncident);
  selectedIncidentRef.current = selectedIncident;
  const incidentsRef = useRef(incidents);
  incidentsRef.current = incidents;
  const productTabRef = useRef(productTab);
  productTabRef.current = productTab;

  // Calm Mode ('Deep Zen' ultra-low-contrast grayscale theme for long-duration investigations)
  const [isCalmMode, setIsCalmMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('agentpulse_calm_mode') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleCalmMode = () => {
    setIsCalmMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('agentpulse_calm_mode', String(next));
      } catch {}
      return next;
    });
  };

  // Text Density ('compact' | 'comfortable' typography scale across the app)
  const [textDensity, setTextDensity] = useState<TextDensity>(() => {
    try {
      const saved = localStorage.getItem('agentpulse_text_density');
      return saved === 'compact' ? 'compact' : 'comfortable';
    } catch {
      return 'comfortable';
    }
  });

  // Firebase Authentication & Multi-Project State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [projects, setProjects] = useState<TelemetryProject[]>([]);
  const [activeProject, setActiveProject] = useState<TelemetryProject | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Sync User's Firestore projects
  useEffect(() => {
    if (!currentUser) {
      setProjects([]);
      setActiveProject(null);
      return;
    }
    const unsubscribe = subscribeToUserProjects(currentUser.uid, (projs) => {
      setProjects(projs);
      setActiveProject((curr) => {
        if (curr && projs.some((p) => p.id === curr.id)) {
          return projs.find((p) => p.id === curr.id) || null;
        }
        return projs[0] || null;
      });
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleChangeTextDensity = (density: TextDensity) => {
    setTextDensity(density);
    try {
      localStorage.setItem('agentpulse_text_density', density);
    } catch {}
  };

  // Synchronize density class and data attribute on document element
  useEffect(() => {
    document.documentElement.setAttribute('data-density', textDensity);
    if (textDensity === 'compact') {
      document.documentElement.classList.add('density-compact');
      document.documentElement.classList.remove('density-comfortable');
    } else {
      document.documentElement.classList.add('density-comfortable');
      document.documentElement.classList.remove('density-compact');
    }
  }, [textDensity]);

  // Global Keyboard shortcut listener (Cmd+K, Cmd+Shift+R, ?, chord navigation 'g' + key)
  useEffect(() => {
    let chordKey: string | null = null;
    let chordTimer: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);

      // Cmd+K / Ctrl+K toggle command palette anywhere
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Cmd+Shift+R / Ctrl+Shift+R: Mark currently selected incident as resolved
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        const targetIncident = selectedIncidentRef.current || (productTabRef.current === 'incidents' ? incidentsRef.current[0] : undefined);
        if (targetIncident) {
          handleResolveIncident(targetIncident.id);
        } else {
          setResolutionToast({
            id: 'none',
            title: 'No incident selected to resolve. Select an incident in Overview or Incidents.',
            isWarning: true
          });
          setTimeout(() => setResolutionToast(null), 3000);
        }
        return;
      }

      // Escape closes open modals
      if (e.key === 'Escape') {
        if (isShortcutsHelpOpen) {
          setIsShortcutsHelpOpen(false);
          return;
        }
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
          return;
        }
      }

      // Don't trigger single-key global shortcuts while typing in input fields
      if (isInputActive) return;

      // Question mark '?' toggles keyboard shortcuts cheat sheet
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsHelpOpen(prev => !prev);
        return;
      }

      // 'g' key chord navigation (VIM style)
      if (e.key.toLowerCase() === 'g' && !chordKey) {
        chordKey = 'g';
        clearTimeout(chordTimer);
        chordTimer = setTimeout(() => {
          chordKey = null;
        }, 1200);
        return;
      }

      if (chordKey === 'g') {
        const k = e.key.toLowerCase();
        chordKey = null;
        clearTimeout(chordTimer);

        if (k === 'o') {
          e.preventDefault();
          setProductTab('overview');
        } else if (k === 't') {
          e.preventDefault();
          setProductTab('traces');
        } else if (k === 'a') {
          e.preventDefault();
          setProductTab('agents');
        } else if (k === 'i') {
          e.preventDefault();
          setProductTab('incidents');
        } else if (k === 'd') {
          e.preventDefault();
          setProductTab('drift');
        } else if (k === 'r') {
          e.preventDefault();
          setProductTab('replay');
        } else if (k === 'e') {
          e.preventDefault();
          setProductTab('experiments');
        } else if (k === 's') {
          e.preventDefault();
          setProductTab('settings');
        } else if (k === 'l') {
          e.preventDefault();
          setProductTab('telemetry-lab');
        } else if (k === 'c') {
          e.preventDefault();
          setIsContextPanelOpen(prev => !prev);
        } else if (k === 'z') {
          e.preventDefault();
          handleToggleCalmMode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(chordTimer);
    };
  }, [isShortcutsHelpOpen, isCommandPaletteOpen]);

  // Anime.js spring physics hover listener for all .ios-liquid-card-interactive elements
  useEffect(() => {
    const cleanup = initLiquidCardSpringListener();
    return cleanup;
  }, []);

  // Trigger sequential Anime.js card entrance cascade on tab/view switch
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerCardEntranceAnimation(null, true);
    }, 45);
    return () => clearTimeout(timer);
  }, [productTab, mode]);

  // Background Live Synthetic Telemetry Pulse (every 14 seconds when live is enabled)
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const traceNum = Math.floor(10000 + Math.random() * 90000);
      const isAnomalous = Math.random() < 0.25;

      const newTrace: Trace = {
        id: `tr-${traceNum}`,
        agentId: randomAgent.id,
        agentName: randomAgent.name,
        sessionId: `sess-${Math.floor(10000 + Math.random() * 90000)}`,
        rootSpanId: `sp-root`,
        status: isAnomalous ? 'warning' : 'ok',
        durationMs: Math.floor(280 + Math.random() * 900),
        totalTokens: Math.floor(800 + Math.random() * 2500),
        cost: Number((Math.random() * 0.006).toFixed(4)),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        inputPreview: `Streamed background run: execute tool dispatch on ${randomAgent.framework} swarm`,
        outputPreview: isAnomalous ? 'Completed with minor parameter deviation flag.' : 'Pipeline executed with 100% verified grounding.',
        tags: ['live-stream', randomAgent.framework.toLowerCase()],
        spans: [
          {
            id: 'sp-root',
            traceId: `tr-${traceNum}`,
            name: `${randomAgent.framework.toLowerCase()}.dispatch`,
            type: 'agent',
            status: isAnomalous ? 'warning' : 'ok',
            startOffsetMs: 0,
            durationMs: 450,
            agentLane: 'Live Dispatcher',
            prompt: `Live agent run for ${randomAgent.name}`,
            completion: 'State updated.',
            evidence: {
              observed: 'Live streaming telemetry packet received.',
              measured: `Latency: 450ms. Evaluator score: ${isAnomalous ? '0.78' : '0.99'}`,
              explained: isAnomalous ? 'Slight variance in tool parameter formatting.' : 'Standard baseline execution.'
            }
          }
        ]
      };

      setTraces(prev => [newTrace, ...prev.slice(0, 24)]);
    }, 12000);

    return () => clearInterval(interval);
  }, [isSimulatingLive, agents]);

  // Handler: Curate span into dataset (Langfuse Loop)
  const handleCurateToDataset = (span: Span, trace: Trace) => {
    const newItem = {
      id: `dsi-${Math.floor(100 + Math.random() * 900)}`,
      originTraceId: trace.id,
      originSpanId: span.id,
      curatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      input: span.prompt || trace.inputPreview,
      expectedOutput: span.completion || trace.outputPreview,
      notes: `Curated from trace ${trace.id} during active investigation.`
    };

    setDatasets(prev => {
      const targetDataset = prev[0];
      const updated = {
        ...targetDataset,
        itemCount: targetDataset.itemCount + 1,
        items: [newItem, ...targetDataset.items]
      };
      return [updated, ...prev.slice(1)];
    });
  };

  // Handler: Ingest synthetic trace from Telemetry Lab
  const handleInjectSyntheticTrace = (newTrace: Trace) => {
    setTraces(prev => [newTrace, ...prev]);

    // If it's an error/warning, create an incident
    if (newTrace.status === 'error' || newTrace.status === 'warning') {
      const newInc: Incident = {
        id: `inc-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: newTrace.errorSummary || 'Synthetic Anomaly Detected',
        severity: newTrace.status === 'error' ? 'critical' : 'warning',
        agentId: newTrace.agentId,
        agentName: newTrace.agentName,
        traceId: newTrace.id,
        spanId: newTrace.spans[0]?.id,
        detectedAt: new Date().toLocaleTimeString(),
        status: 'open',
        rootCause: newTrace.errorSummary || 'Anomaly triggered during stress test in Telemetry Lab.',
        summary: `Failing trace ${newTrace.id} generated in live environment.`,
        affectedRunsCount: 1,
        suggestedAction: 'Inspect prompt grounding constraints and add failing span to golden test dataset.'
      };
      setIncidents(prev => [newInc, ...prev]);
    }
  };

  // Handler: Resolve incident
  const handleResolveIncident = (incidentId: string) => {
    const target = incidents.find(i => i.id === incidentId) || (selectedIncident?.id === incidentId ? selectedIncident : undefined);
    setIncidents(prev => prev.filter(i => i.id !== incidentId));
    setSelectedIncident(prev => (prev?.id === incidentId ? undefined : prev));

    if (target) {
      setResolutionToast({
        id: target.id,
        title: `Resolved: ${target.title}`
      });
      setTimeout(() => setResolutionToast(null), 3200);
    }
  };

  // Clear context selections
  const handleClearSelection = () => {
    setSelectedAgent(undefined);
    setSelectedTrace(undefined);
    setSelectedSpan(undefined);
    setSelectedIncident(undefined);
  };

  // RENDER: Public Editorial Experience
  if (mode === 'public') {
    return (
      <>
        <PublicExperience
          onEnterProduct={() => {
            setMode('product');
            setProductTab('overview');
          }}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={currentUser}
        />
      </>
    );
  }

  // RENDER: Product Investigation Experience (Calm, Precise, Investigative with iOS 26 Liquid Glass)
  return (
    <div
      data-density={textDensity}
      className={`min-h-screen bg-[#06070a] text-[#F5F5F7] selection:bg-neutral-800 selection:text-white flex flex-col relative overflow-x-hidden ${
        isCalmMode ? 'calm-mode-zen' : ''
      } ${textDensity === 'compact' ? 'density-compact' : 'density-comfortable'}`}
    >
      {/* Interactive Liquid Fluid Background */}
      <LiquidBackgroundCanvas palette="dark" className="fixed inset-0 pointer-events-none opacity-45 z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Context-Preserving Header */}
        <ProductHeader
          currentTab={productTab}
          onSelectTab={setProductTab}
          selectedAgent={selectedAgent}
          selectedTrace={selectedTrace}
          selectedSpan={selectedSpan}
          selectedIncident={selectedIncident}
          onClearSelection={handleClearSelection}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onSwitchToPublic={() => setMode('public')}
          isSimulatingLive={isSimulatingLive}
          onToggleLive={() => setIsSimulatingLive(prev => !prev)}
          onOpenShortcutsModal={() => setIsShortcutsHelpOpen(true)}
          isContextPanelOpen={isContextPanelOpen}
          onToggleContextPanel={() => setIsContextPanelOpen(prev => !prev)}
          isCalmMode={isCalmMode}
          onToggleCalmMode={handleToggleCalmMode}
          currentUser={currentUser}
          activeProject={activeProject}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenProjectSelector={() => setIsProjectSelectorOpen(true)}
        />

        {/* Main Product Layout Container with Pinned / Interactive Active Context Side-Panel */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Investigative Content Surface */}
          <main className="flex-1 min-w-0 w-full">
            <AnimeTabTransitionContainer activeTab={productTab}>
              {productTab === 'overview' && (
                <OverviewView
                  agents={agents}
                  traces={traces}
                  incidents={incidents}
                  driftProfiles={driftProfiles}
                  onSelectAgent={(agent) => {
                    setSelectedAgent(agent);
                    setProductTab('agents');
                    setIsContextPanelOpen(true);
                  }}
                  onSelectTrace={(trace) => {
                    setSelectedTrace(trace);
                    setProductTab('traces');
                    setIsContextPanelOpen(true);
                  }}
                  onSelectSpan={(span) => {
                    setSelectedSpan(span);
                    setIsContextPanelOpen(true);
                  }}
                  onSelectIncident={(incident) => {
                    setSelectedIncident(incident);
                    setProductTab('incidents');
                    setIsContextPanelOpen(true);
                  }}
                  onNavigateTab={(tab) => setProductTab(tab)}
                />
              )}

              {productTab === 'agents' && (
                <AgentsView
                  agents={agents}
                  selectedAgent={selectedAgent}
                  onSelectAgent={(agent) => {
                    setSelectedAgent(agent);
                    setIsContextPanelOpen(true);
                  }}
                  onNavigateToTraces={(agentId) => {
                    const targetAgent = agents.find(a => a.id === agentId);
                    setSelectedAgent(targetAgent);
                    setProductTab('traces');
                    setIsContextPanelOpen(true);
                  }}
                  onNavigateToDrift={(agentId) => {
                    const targetAgent = agents.find(a => a.id === agentId);
                    setSelectedAgent(targetAgent);
                    setProductTab('drift');
                    setIsContextPanelOpen(true);
                  }}
                />
              )}

              {productTab === 'traces' && (
                <TracesView
                  traces={traces}
                  selectedTrace={selectedTrace}
                  selectedSpan={selectedSpan}
                  onSelectTrace={(trace) => {
                    setSelectedTrace(trace);
                    setIsContextPanelOpen(true);
                  }}
                  onSelectSpan={(span) => {
                    setSelectedSpan(span);
                    setIsContextPanelOpen(true);
                  }}
                  onCurateToDataset={handleCurateToDataset}
                  filterAgentId={selectedAgent?.id}
                  onOpenShortcutsModal={() => setIsShortcutsHelpOpen(true)}
                />
              )}

              {productTab === 'performance' && (
                <PerformanceView
                  onNavigateToTrace={(traceId) => {
                    const foundTrace = traces.find(t => t.id === traceId);
                    if (foundTrace) setSelectedTrace(foundTrace);
                    setProductTab('traces');
                    setIsContextPanelOpen(true);
                  }}
                  onNavigateTab={(tab) => setProductTab(tab)}
                  traces={traces}
                  isSimulatingLive={isSimulatingLive}
                />
              )}

              {productTab === 'incidents' && (
                <IncidentsView
                  incidents={incidents}
                  selectedIncident={selectedIncident}
                  onSelectIncident={(incident) => {
                    setSelectedIncident(incident);
                    setIsContextPanelOpen(true);
                  }}
                  onNavigateToTrace={(traceId) => {
                    const foundTrace = traces.find(t => t.id === traceId);
                    if (foundTrace) setSelectedTrace(foundTrace);
                    setProductTab('traces');
                    setIsContextPanelOpen(true);
                  }}
                  onNavigateToAgent={(agentId) => {
                    const foundAgent = agents.find(a => a.id === agentId);
                    if (foundAgent) setSelectedAgent(foundAgent);
                    setProductTab('agents');
                    setIsContextPanelOpen(true);
                  }}
                  onResolveIncident={handleResolveIncident}
                />
              )}

              {productTab === 'drift' && (
                <DriftView
                  driftProfiles={driftProfiles}
                  agents={agents}
                  selectedAgentId={selectedAgent?.id}
                  onNavigateToTrace={(traceId) => {
                    const foundTrace = traces.find(t => t.id === traceId);
                    if (foundTrace) setSelectedTrace(foundTrace);
                    setProductTab('traces');
                    setIsContextPanelOpen(true);
                  }}
                />
              )}

              {productTab === 'replay' && (
                <ReplayView
                  traces={traces}
                  selectedTrace={selectedTrace}
                  onSelectTrace={(trace) => {
                    setSelectedTrace(trace);
                    setIsContextPanelOpen(true);
                  }}
                />
              )}

              {productTab === 'experiments' && (
                <ExperimentsView
                  experiments={experiments}
                  datasets={datasets}
                />
              )}

              {productTab === 'datasets' && (
                <DatasetsView
                  datasets={datasets}
                  onNavigateToExperiments={() => setProductTab('experiments')}
                />
              )}

              {productTab === 'telemetry-lab' && (
                <TelemetryLabView
                  agents={agents}
                  onInjectSyntheticTrace={handleInjectSyntheticTrace}
                />
              )}

              {productTab === 'settings' && (
                <SettingsView
                  isCalmMode={isCalmMode}
                  onToggleCalmMode={handleToggleCalmMode}
                  textDensity={textDensity}
                  onChangeTextDensity={handleChangeTextDensity}
                  currentUser={currentUser}
                  activeProject={activeProject}
                  onOpenProjectSelector={() => setIsProjectSelectorOpen(true)}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                />
              )}
            </AnimeTabTransitionContainer>
          </main>

          {/* Persistent Active Context Side-Panel */}
          <ActiveContextPanel
            currentTab={productTab}
            onSelectTab={setProductTab}
            selectedAgent={selectedAgent}
            selectedTrace={selectedTrace}
            selectedSpan={selectedSpan}
            selectedIncident={selectedIncident}
            onResolveIncident={handleResolveIncident}
            onClearSelection={handleClearSelection}
            onSelectAgent={setSelectedAgent}
            onSelectTrace={setSelectedTrace}
            onSelectSpan={setSelectedSpan}
            onCurateToDataset={handleCurateToDataset}
            isOpen={isContextPanelOpen}
            onToggleOpen={() => setIsContextPanelOpen(prev => !prev)}
            isPinned={isContextPanelPinned}
            onTogglePin={() => setIsContextPanelPinned(prev => !prev)}
          />
        </div>

      {/* Apple Liquid Glass Floating Navigation Dock */}
      <FloatingDock
        currentTab={productTab}
        onSelectTab={setProductTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsHelpOpen(true)}
        incidentCount={incidents.length}
        driftWarningCount={agents.filter(a => a.driftStatus !== 'normal').length}
      />

      {/* Raycast-Style Liquid Glass Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setProductTab}
        onSelectAgent={(agent) => {
          setSelectedAgent(agent);
          setProductTab('agents');
        }}
        onSelectTrace={(trace) => {
          setSelectedTrace(trace);
          setProductTab('traces');
        }}
        onSelectIncident={(incident) => {
          setSelectedIncident(incident);
          setProductTab('incidents');
        }}
        selectedIncident={selectedIncident}
        onResolveIncident={handleResolveIncident}
        agents={agents}
        traces={traces}
        incidents={incidents}
        onSwitchToPublic={() => setMode('public')}
        isSimulatingLive={isSimulatingLive}
        onToggleLive={() => setIsSimulatingLive(prev => !prev)}
        isCalmMode={isCalmMode}
        onToggleCalmMode={handleToggleCalmMode}
        textDensity={textDensity}
        onChangeTextDensity={handleChangeTextDensity}
      />

      {/* Power User Global Shortcuts Cheat Sheet Modal (?) */}
      <ShortcutsHelpModal
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />

      {/* Floating HUD Feedback for Incident Resolution & Shortcuts */}
      {resolutionToast && (
        <div className="fixed top-20 right-6 z-50 pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`px-4 py-2.5 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center space-x-3 font-mono text-xs ${
            resolutionToast.isWarning
              ? 'bg-amber-950/85 border-amber-500/40 text-amber-200'
              : 'bg-[#0a1f18]/90 border-emerald-500/50 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
          }`}>
            {resolutionToast.isWarning ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="font-semibold text-white flex items-center space-x-2">
                <span>{resolutionToast.isWarning ? 'Shortcut Notice' : 'Incident Resolved'}</span>
                <kbd className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-white/90 border border-white/20">⌘⇧R</kbd>
              </div>
              <div className="text-[11px] opacity-90 truncate max-w-sm mt-0.5">{resolutionToast.title}</div>
            </div>
          </div>
        </div>
      )}
      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Firestore Project Management Modal */}
      <ProjectSelectorModal
        isOpen={isProjectSelectorOpen}
        onClose={() => setIsProjectSelectorOpen(false)}
        currentUser={currentUser}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(proj) => {
          setActiveProject(proj);
          setIsProjectSelectorOpen(false);
        }}
        onOpenAuth={() => {
          setIsProjectSelectorOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
      </div>
    </div>
  );
}
