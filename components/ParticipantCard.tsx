
import React from 'react';
import { Participant } from '../types';

interface ParticipantCardProps {
  participant: Participant;
  isActive: boolean;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, isActive }) => {
  return (
    <div className={`relative flex flex-col items-center p-5 rounded-[2rem] transition-all duration-300 border-2 h-full ${
      isActive 
        ? 'bg-slate-800/90 border-emerald-500/40 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/20' 
        : 'bg-slate-900/40 border-slate-800/50 grayscale opacity-70'
    }`}>
      {isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter shadow-lg shadow-emerald-500/20 animate-pulse whitespace-nowrap z-20">
          Plantão Ativo
        </div>
      )}
      
      <div className={`relative aspect-square w-24 sm:w-28 lg:w-32 mb-4 rounded-3xl overflow-hidden border-2 transition-transform duration-500 ${isActive ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/10' : 'border-slate-700'}`}>
        <img 
          src={participant.photo} 
          alt={participant.name} 
          className="w-full h-full object-cover"
        />
        {isActive && <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />}
      </div>

      <div className="w-full text-center flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 line-clamp-1 leading-tight">{participant.name}</h3>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
          {participant.role}
        </p>
        
        <div className="mt-auto pt-3 border-t border-slate-800/50 flex flex-col gap-2">
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Setor</span>
            <span className="text-xs sm:text-sm text-slate-300 font-semibold truncate w-full px-2">{participant.sector}</span>
          </div>

          {participant.extension && (
            <div className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono mx-auto ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800/50 text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {participant.extension}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantCard;
