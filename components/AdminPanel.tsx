
import React, { useState } from 'react';
import { Participant, ShiftType } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onUpdateParticipants: (newParticipants: Participant[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, participants, onUpdateParticipants }) => {
  const [newMember, setNewMember] = useState<Partial<Participant>>({
    shift: ShiftType.MORNING,
    role: 'Membro Titular'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMember(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.sector || !newMember.photo) {
      alert("Por favor, preencha nome, setor e adicione uma foto.");
      return;
    }

    const member: Participant = {
      id: Date.now().toString(),
      name: newMember.name!,
      role: newMember.role!,
      sector: newMember.sector!,
      photo: newMember.photo!,
      shift: newMember.shift as ShiftType,
      extension: newMember.extension
    };

    onUpdateParticipants([...participants, member]);
    setNewMember({ shift: ShiftType.MORNING, role: 'Membro Titular' });
    alert("Membro adicionado com sucesso!");
  };

  const removeMember = (id: string) => {
    if (confirm("Tem certeza que deseja remover este membro?")) {
      onUpdateParticipants(participants.filter(p => p.id !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Gerenciar Membros</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 scrollbar-hide">
          {/* Add Form */}
          <section>
            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6">Novo Integrante</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={newMember.name || ''} 
                    onChange={e => setNewMember({...newMember, name: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Ex: João da Silva"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cargo CIPA</label>
                  <select 
                    value={newMember.role}
                    onChange={e => setNewMember({...newMember, role: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>Presidente</option>
                    <option>Vice-Presidente</option>
                    <option>Secretário</option>
                    <option>Membro Titular</option>
                    <option>Suplente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Turno</label>
                  <select 
                    value={newMember.shift}
                    onChange={e => setNewMember({...newMember, shift: e.target.value as ShiftType})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {Object.values(ShiftType).filter(s => s !== ShiftType.OFF).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Setor</label>
                  <input 
                    type="text" 
                    value={newMember.sector || ''} 
                    onChange={e => setNewMember({...newMember, sector: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Ex: Manutenção"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ramal (Opcional)</label>
                  <input 
                    type="text" 
                    value={newMember.extension || ''} 
                    onChange={e => setNewMember({...newMember, extension: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Ex: 4501"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Foto do Membro</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-700 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all cursor-pointer">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 mb-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                      <span className="text-[10px] font-bold text-slate-400">Upload Foto</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    {newMember.photo && (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500">
                        <img src={newMember.photo} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                Adicionar Membro
              </button>
            </form>
          </section>

          {/* List Section */}
          <section>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Membros Cadastrados ({participants.length})</h3>
            <div className="space-y-2">
              {participants.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 group">
                  <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{p.role} • {p.shift}</p>
                  </div>
                  <button 
                    onClick={() => removeMember(p.id)}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-lg transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
