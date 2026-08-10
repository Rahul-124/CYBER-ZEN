import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle, Circle, Lock, UserPlus, KeyRound, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'reset_request' | 'reset_confirm'

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [resetUid, setResetUid] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & App Data
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [calendarData, setCalendarData] = useState({ 
    tithi: 'Scanning Cosmos...', 
    energy_status: 'Calculating...' 
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      fetchTasks(token);
    }
  }, []);

  const clearFeedback = () => {
    setError('');
    setMessage('');
  };

  const fetchTasks = async (token) => {
    try {
      const taskRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(taskRes.data);

      const calRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/calendar/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCalendarData(calRes.data);
    } catch (err) {
      console.error("Session error:", err);
      handleLogout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/`, { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setIsAuthenticated(true);
      fetchTasks(res.data.access);
    } catch (err) {
      setError('Invalid Quantum Credentials');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/register/`, { username, email, password });
      setMessage('Identity created! Authenticating...');
      // Auto login after registration
      setTimeout(() => handleLogin(e), 1000);
    } catch (err) {
      setError(err.response?.data?.username?.[0] || 'Registration failed.');
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/password-reset/`, { email });
      setMessage(res.data.message);
      if (res.data.uid) setResetUid(res.data.uid);
      setAuthMode('reset_confirm');
    } catch (err) {
      setError('Error dispatching token.');
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/password-reset/confirm/`, {
        uid: resetUid,
        token: resetToken,
        new_password: newPassword
      });
      setMessage(res.data.message);
      setTimeout(() => {
        setAuthMode('login');
        clearFeedback();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setTasks([]);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks/`,
        { title: newTask, is_completed: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([res.data, ...tasks]);
      setNewTask('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}/`, 
        { is_completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}/`,
       {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-50 font-sans p-8 flex justify-center items-start overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)] z-10 mt-12"
          >
            {/* LOGIN MODE */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <Lock className="w-10 h-10 text-cyan-400 mb-2 animate-pulse" />
                  <h2 className="text-2xl font-bold tracking-widest text-cyan-400">IDENTITY AUTH</h2>
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-50 focus:outline-none focus:border-cyan-400/50"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-50 focus:outline-none focus:border-cyan-400/50"
                  required
                />
                <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  INITIALIZE LINK
                </button>
                <div className="flex justify-between text-xs text-white/50 pt-2">
                  <button type="button" onClick={() => { setAuthMode('register'); clearFeedback(); }} className="hover:text-cyan-400">Create Identity</button>
                  <button type="button" onClick={() => { setAuthMode('reset_request'); clearFeedback(); }} className="hover:text-purple-400">Forgot Password?</button>
                </div>
              </form>
            )}

            {/* REGISTER MODE */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <UserPlus className="w-10 h-10 text-purple-400 mb-2" />
                  <h2 className="text-2xl font-bold tracking-widest text-purple-400">NEW IDENTITY</h2>
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-50 focus:outline-none focus:border-purple-400/50"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-50 focus:outline-none focus:border-purple-400/50"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-50 focus:outline-none focus:border-purple-400/50"
                  required
                />
                <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  REGISTER CORE NODE
                </button>
                <button type="button" onClick={() => { setAuthMode('login'); clearFeedback(); }} className="w-full flex items-center justify-center gap-2 text-xs text-white/50 hover:text-cyan-400 pt-2">
                  <ArrowLeft className="w-3 h-3" /> Back to Auth
                </button>
              </form>
            )}

            {/* RESET REQUEST MODE */}
            {authMode === 'reset_request' && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <KeyRound className="w-10 h-10 text-cyan-400 mb-2" />
                  <h2 className="text-xl font-bold tracking-widest text-cyan-400">RECOVER IDENTITY</h2>
                </div>
                <input
                  type="email"
                  placeholder="Registered Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-50 focus:outline-none focus:border-cyan-400/50"
                  required
                />
                <button type="submit" className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl">
                  DISPATCH TOKEN
                </button>
                <button type="button" onClick={() => { setAuthMode('login'); clearFeedback(); }} className="w-full flex items-center justify-center gap-2 text-xs text-white/50 hover:text-cyan-400 pt-2">
                  <ArrowLeft className="w-3 h-3" /> Back to Auth
                </button>
              </form>
            )}

            {/* RESET CONFIRM MODE */}
            {authMode === 'reset_confirm' && (
              <form onSubmit={handleConfirmReset} className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <KeyRound className="w-10 h-10 text-purple-400 mb-2" />
                  <h2 className="text-xl font-bold tracking-widest text-purple-400">ENTER RESET TOKEN</h2>
                </div>
                <input
                  type="text"
                  placeholder="UID (Check Terminal)"
                  value={resetUid}
                  onChange={(e) => setResetUid(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-50 focus:outline-none focus:border-purple-400/50"
                  required
                />
                <input
                  type="text"
                  placeholder="Token (Check Terminal)"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-50 focus:outline-none focus:border-purple-400/50"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-50 focus:outline-none focus:border-purple-400/50"
                  required
                />
                <button type="submit" className="w-full bg-purple-500 text-slate-950 font-bold py-3 rounded-xl">
                  CONFIRM NEW PASSWORD
                </button>
              </form>
            )}

            {/* ERROR AND SUCCESS FEEDBACK */}
            {error && <p className="text-red-400 text-xs text-center mt-4 font-semibold">{error}</p>}
            {message && <p className="text-cyan-400 text-xs text-center mt-4 font-semibold">{message}</p>}
          </motion.div>
        ) : (
          /* DASHBOARD HUD */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(8,_112,_184,_0.15)] z-10"
          >
            <header className="mb-8 flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  CYBER-ZEN
                </h1>
                <button onClick={handleLogout} className="text-xs text-red-400/60 hover:text-red-400 underline transition-colors">
                  Disconnect Core
                </button>
              </div>
              <div className="text-right">
                <p className="text-sm text-cyan-200/70 uppercase tracking-widest">{calendarData.tithi}</p>
                <p className="text-xs text-white/40">Energy: {calendarData.energy_status}</p>
              </div>
            </header>

            <form onSubmit={addTask} className="mb-8">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Initialize new objective..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-cyan-50 focus:outline-none focus:border-cyan-400/50 placeholder:text-white/20"
              />
            </form>

            <div className="space-y-3">
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, filter: "blur(10px)" }}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      task.is_completed 
                        ? 'bg-white/5 border-white/5 text-white/30' 
                        : 'bg-white/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,_182,_212,_0.05)]'
                    }`}
                  >
                    <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleTask(task.id, task.is_completed)}>
                      {task.is_completed ? (
                        <CheckCircle className="text-purple-400 w-6 h-6 shrink-0" />
                      ) : (
                        <Circle className="text-cyan-400 w-6 h-6 shrink-0" />
                      )}
                      <span className={`text-lg transition-all ${task.is_completed ? 'line-through' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-white/20 hover:text-red-400 transition-colors p-2 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tasks.length === 0 && (
                <p className="text-center text-white/20 py-8">No active matrix nodes. Add a task above.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
}