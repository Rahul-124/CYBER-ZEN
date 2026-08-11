import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, XCircle } from 'lucide-react';

export default function FocusMode({ task, onClose }) {
  // 1500 seconds = 25 minutes (Standard Pomodoro)
  const [timeLeft, setTimeLeft] = useState(1500); 
  const [isActive, setIsActive] = useState(false);

  // The Core Timer Logic (useEffect runs every time the component updates)
  useEffect(() => {
    let interval = null;
    
    // If the timer is active and time is greater than 0, count down
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished!
      setIsActive(false);
      clearInterval(interval);
      alert("Matrix Focus Complete. Take a 5 minute break.");
    }

    // Cleanup function: stops the timer if you close the window
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Math to convert total seconds into MM:SS format
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl"
    >
      {/* Background Pulse Effect */}
      <div className={`absolute w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-all duration-1000 ${isActive ? 'bg-cyan-600/20 scale-110' : 'bg-purple-600/10 scale-100'}`} />

      <div className="z-10 flex flex-col items-center">
        <p className="text-cyan-400 tracking-[0.3em] text-sm uppercase mb-8">Deep Work Protocol</p>
        
        {/* The Task Being Focused On */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center max-w-2xl">
          {task.title}
        </h2>

        {/* The Digital Clock */}
        <div className="text-8xl md:text-9xl font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-12 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          {timeDisplay}
        </div>

        {/* HUD Controls */}
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