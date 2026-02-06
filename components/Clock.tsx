
import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center md:items-end">
      <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter">
        {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="text-sm sm:text-base md:text-xl font-medium text-slate-400 uppercase tracking-widest text-center md:text-right">
        {time.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  );
};

export default Clock;
