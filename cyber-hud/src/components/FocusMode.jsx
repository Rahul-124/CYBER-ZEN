import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, XCircle } from 'lucide-react';

export default function FocusMode({ task, onClose }) {
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      alert("Matrix Focus Complete. Take a 5 minute break.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950"
    >
      <div className="z-10 flex flex-col items-center">
        <p className="text-cyan-400 tracking-[0.3em] text-sm uppercase mb-8">Deep Work Protocol</p>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center max-w-2xl">
          {task.title}
        </h2>

        <div className="text-8xl md:text-9xl font-mono text-cyan-50 mb-12 tracking-tighter">
          {timeDisplay}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full transition-all"
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            <span className="font-bold tracking-widest">{isActive ? 'PAUSE' : 'INITIALIZE'}</span>
          </button>

          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-red-400/70 hover:text-red-400 px-6 py-4 transition-all"
          >
            <XCircle className="w-6 h-6" />
            <span className="text-sm tracking-widest uppercase">Abort</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}