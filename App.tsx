import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MOCK_PARTICIPANTS, SHIFT_HOURS } from './constants';
import { ShiftType, SafetyTip, Participant } from './types';
import { getDailySafetyTip } from './services/geminiService';
import Clock from './components/Clock';
import ParticipantCard from './components/ParticipantCard';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [realTimeShift, setRealTimeShift] = useState<ShiftType>(ShiftType.OFF);
  const [activeTab, setActiveTab] = useState<ShiftType>(ShiftType.MORNING);
  const [tipsHistory, setTipsHistory] = useState<SafetyTip[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [autoRotateProgress, setAutoRotateProgress] = useState(0);
  
  const ROTATION_INTERVAL = 40000; // 40 seconds
  const PROGRESS_INTERVAL = 100; // Update progress bar every 100ms
  // Use any to avoid NodeJS namespace errors in browser-only environments
  const timerRef = useRef<any>(null);
  // Use any to avoid NodeJS namespace errors in browser-only environments
  const progressTimerRef = useRef<any>(null);

  // Initialize participants from localStorage or mock data
  useEffect(() => {
    const saved = localStorage.getItem('cipa_participants');
    if (saved) {
      setParticipants(JSON.parse(saved));
    } else {
      setParticipants(MOCK_PARTICIPANTS);
      localStorage.setItem('cipa_participants', JSON.stringify(MOCK_PARTICIPANTS));
    }
  }, []);

  const saveParticipants = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    localStorage.setItem('cipa_participants', JSON.stringify(newParticipants));
  };

  const calculateShift = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= SHIFT_HOURS.MORNING.start && hour < SHIFT_HOURS.MORNING.end) return ShiftType.MORNING;
    if (hour >= SHIFT_HOURS.AFTERNOON.start && hour < SHIFT_HOURS.AFTERNOON.end) return ShiftType.AFTERNOON;
    return ShiftType.NIGHT;
  }, []);

  const fetchNewTip = useCallback(async () => {
    const newTip = await getDailySafetyTip();
    setTipsHistory(prev => {
      if (prev.some(t => t.title === newTip.title)) return prev;
      const updated = [newTip, ...prev].slice(0, 5);
      localStorage.setItem('cipa_tips_history', JSON.stringify(updated));
      return updated;
    });
    setCurrentTipIndex(0);
  }, []);

  // Automatic Rotation Logic
  const resetRotation = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    
    setAutoRotateProgress(0);

    if (tipsHistory.length > 1) {
      const startTime = Date.now();
      
      progressTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed / ROTATION_INTERVAL) * 100;
        setAutoRotateProgress(Math.min(progress, 100));
      }, PROGRESS_INTERVAL);

      timerRef.current = setInterval(() => {
        setCurrentTipIndex(prev => (prev + 1) % tipsHistory.length);
      }, ROTATION_INTERVAL);
    }
  }, [tipsHistory.length]);

  useEffect(() => {
    resetRotation();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentTipIndex, resetRotation]);

  useEffect(() => {
    const initialShift = calculateShift();
    setRealTimeShift(initialShift);
    setActiveTab(initialShift); 

    const savedHistory = localStorage.getItem('cipa_tips_history');
    if (savedHistory) setTipsHistory(JSON.parse(savedHistory));

    fetchNewTip();
    const interval = setInterval(() => setRealTimeShift(calculateShift()), 60000);
    return () => clearInterval(interval);
  }, [calculateShift, fetchNewTip]);

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => p.shift === activeTab);
  }, [activeTab, participants]);

  const tabs = [
    { type: ShiftType.MORNING, label: 'Manhã', icon: 'M12 7V3m-5 4L4 4m13 3 3-3M5 12H1m22 0h-4M7 17l-3 3m13-3 3 3M12 17v4m0-14a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z' },
    { type: ShiftType.AFTERNOON, label: 'Tarde', icon: 'M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.72-12.72 1.41-1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z' },
    { type: ShiftType.NIGHT, label: 'Noite', icon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' }
  ];

  const currentTip = tipsHistory[currentTipIndex];

  const handleNextTip = () => {
    setCurrentTipIndex(prev => (prev + 1) % tipsHistory.length);
  };

  const handlePrevTip = () => {
    setCurrentTipIndex(prev => (prev - 1 + tipsHistory.length) % tipsHistory.length);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 sm:p-8 lg:p-10 flex flex-col gap-8 max-w-[1600px] mx-auto overflow-x-hidden relative">
      <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-8 gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">CIPA Digital</h1>
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
                title="Configurações Admin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <p className="text-sm sm:text-xl text-emerald-400 font-bold tracking-[0.2em] uppercase flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Plantão: {realTimeShift}
            </p>
          </div>
        </div>
        <Clock />
      </header>

      <nav className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 p-2 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md self-center sm:self-start">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 relative group ${
              activeTab === tab.type ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={tab.icon}/></svg>
            <span className="text-sm">{tab.label}</span>
            {realTimeShift === tab.type && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-slate-900" />}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto pr-2 scrollbar-hide py-2">
        {filteredParticipants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredParticipants.map(p => (
              <div key={p.id} className="min-w-0">
                <ParticipantCard participant={p} isActive={p.shift === realTimeShift} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-slate-700">
            <p className="text-xl font-bold uppercase tracking-widest text-center opacity-40">Nenhum membro escalado</p>
          </div>
        )}
      </main>

      <footer className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-stretch pt-8 border-t border-slate-800 mt-auto">
        <div className="md:col-span-8 bg-slate-900/60 rounded-[2.5rem] p-8 sm:p-10 border border-slate-800/50 flex flex-col justify-center relative min-h-[250px] overflow-hidden">
          {/* Progress bar for auto-rotation */}
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
            <div 
              className="h-full bg-emerald-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${autoRotateProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 w-fit">
                Segurança do Trabalho
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-2 px-1">
                Rotação Automática: 40s
              </span>
            </div>
            
            {tipsHistory.length > 1 && (
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevTip} 
                  className="p-2 hover:bg-emerald-500 hover:text-slate-950 rounded-full text-slate-400 transition-all active:scale-90"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={handleNextTip} 
                  className="p-2 hover:bg-emerald-500 hover:text-slate-950 rounded-full text-slate-400 transition-all active:scale-90"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </div>
          
          <div key={currentTipIndex} className="animate-in fade-in slide-in-from-right-6 duration-500">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">{currentTip?.title || 'Carregando...'}</h2>
            <p className="text-base sm:text-xl text-slate-400 leading-relaxed font-medium max-w-3xl">{currentTip?.content}</p>
          </div>
        </div>

        <div className="md:col-span-4 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-white shadow-2xl">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-100 mb-2">Dias sem Acidentes</span>
          <span className="text-6xl sm:text-8xl font-black tabular-nums">452</span>
          <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-[200px]">
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-white w-[90.4%] rounded-full shadow-[0_0_10px_white]" /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/70">Meta: 500 Dias</span>
          </div>
        </div>
      </footer>

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        participants={participants}
        onUpdateParticipants={saveParticipants}
      />
    </div>
  );
};

export default App;