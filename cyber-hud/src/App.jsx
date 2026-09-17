import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DemoDashboard from './components/DemoDashboard';
import FocusMode from './components/FocusMode';
import ForgotPassword from './components/ForgotPassword';
import ResetPasswordConfirm from './components/ResetPasswordConfirm';
import api from './services/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [activeFocusTask, setActiveFocusTask] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 selection:bg-emerald-500 selection:text-black font-sans">
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Zero-Friction Client-Side Demo */}
        <Route 
          path="/demo" 
          element={<DemoDashboard onStartFocus={(task) => setActiveFocusTask(task)} />} 
        />

        {/* Authentication Wall */}
        <Route 
          path="/login" 
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthWall onLoginSuccess={(newToken) => setToken(newToken)} />
            )
          } 
        />

        {/* Authenticated Cloud Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            token ? (
              <CloudDashboard 
                onLogout={handleLogout} 
                onStartFocus={(task) => setActiveFocusTask(task)} 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Password Recovery Flows */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Focus Engine Overlay */}
      {activeFocusTask && (
        <FocusMode 
          task={activeFocusTask} 
          onClose={() => setActiveFocusTask(null)} 
        />
      )}
    </div>
  );
}

// --- Sub-View: Auth Wall (Login & Registration) ---
function AuthWall({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const endpoint = isRegistering ? '/api/register/' : '/api/token/';
    try {
      const response = await api.post(endpoint, { username, password });
      
      if (isRegistering) {
        // Automatically login after successful registration
        const loginRes = await api.post('/api/token/', { username, password });
        localStorage.setItem('access_token', loginRes.data.access);
        localStorage.setItem('refresh_token', loginRes.data.refresh);
        onLoginSuccess(loginRes.data.access);
      } else {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        onLoginSuccess(response.data.access);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#121318] border border-gray-800 rounded-xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {isRegistering ? 'INITIALIZE IDENTITY' : 'QUANTUM ACCESS'}
          </h2>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">
            {isRegistering ? 'Register your node on the network' : 'Authenticate to sync tasks to cloud'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-800/80 rounded text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-gray-400 mb-1">Username</label>
            <input 
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-300"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-black font-semibold text-xs uppercase tracking-wider rounded transition-all disabled:opacity-50"
          >
            {isLoading ? 'Decrypting...' : isRegistering ? 'Create Quantum Identity' : 'Establish Link'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 text-xs text-gray-400">
          <button 
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
            className="hover:text-emerald-400 underline underline-offset-4"
          >
            {isRegistering ? 'Already registered? Log In' : 'Need credentials? Register here'}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/demo')}
            className="text-gray-500 hover:text-gray-300"
          >
            ← Return to Offline Demo Mode
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Sub-View: Authenticated Cloud Dashboard ---
function CloudDashboard({ onLogout, onStartFocus }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to pull tasks from cloud node', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.post('/api/tasks/', { title: newTitle, priority });
      setTasks([res.data, ...tasks]);
      setNewTitle('');
    } catch (err) {
      console.error('Task creation failed', err);
    }
  };

  const handleToggle = async (task) => {
    try {
      const res = await api.patch(`/api/tasks/${task.id}/`, { completed: !task.completed });
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}/`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Deletion failed', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center py-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-emerald-400">CYBER ZEN // CLOUD NODE</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Neon PostgreSQL Linked • Realtime Persistent</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 border border-red-900/60 hover:bg-red-950/40 text-red-400 rounded text-xs tracking-wider uppercase transition-colors"
        >
          Disconnect
        </button>
      </header>

      <form onSubmit={handleCreate} className="my-8 flex gap-3">
        <input 
          type="text"
          placeholder="Queue next quantum objective..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-[#121318] border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
        />
        <select 
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-[#121318] border border-gray-800 rounded-lg px-3 py-3 text-xs text-gray-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        <button 
          type="submit"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors"
        >
          Add Task
        </button>
      </form>

      <div className="space-y-3">
        {loading ? (
          <p className="text-xs text-gray-500 tracking-widest uppercase">Querying cluster...</p>
        ) : tasks.length === 0 ? (
          <p className="text-xs text-gray-500 tracking-widest uppercase">No tasks active. Add one above.</p>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id}
              className="flex items-center justify-between p-4 bg-[#121318] border border-gray-800/80 rounded-lg hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task)}
                  className="w-4 h-4 rounded border-gray-700 text-emerald-500 focus:ring-0 bg-transparent cursor-pointer"
                />
                <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                  {task.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 border border-gray-800 text-gray-400 rounded">
                  {task.priority || 'MEDIUM'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartFocus(task)}
                  className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs transition-colors"
                >
                  ⚡ Focus
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}