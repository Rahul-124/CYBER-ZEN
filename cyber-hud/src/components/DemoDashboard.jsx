import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DemoDashboard({ onStartFocus }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('cyber_zen_demo_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 'demo-1', title: 'Explore the Cyber Zen interface', priority: 'HIGH', completed: false },
      { id: 'demo-2', title: 'Test the Matrix Focus timer', priority: 'MEDIUM', completed: false },
      { id: 'demo-3', title: 'Register to sync tasks with Neon DB', priority: 'LOW', completed: false },
    ];
  });

  const [inputTitle, setInputTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  useEffect(() => {
    localStorage.setItem('cyber_zen_demo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const newTask = {
      id: `demo-${Date.now()}`,
      title: inputTitle.trim(),
      priority,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setInputTitle('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col">
      {/* Top Conversion Bar */}
      <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>You are operating in <strong>Local Demo Mode</strong> (Browser Storage Only).</span>
        </div>
        <Link 
          to="/login"
          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap"
        >
          Save to Cloud (Free)
        </Link>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center py-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-gray-200">DEMO WORKSPACE</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Test task mechanics & focus sessions</p>
        </div>
        <Link 
          to="/"
          className="text-xs text-gray-400 hover:text-gray-200 transition-colors uppercase tracking-wider"
        >
          ← Home
        </Link>
      </header>

      {/* Task Creation Form */}
      <form onSubmit={addTask} className="my-8 flex gap-3">
        <input 
          type="text"
          placeholder="Enter an objective to test..."
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
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

      {/* Task List */}
      <div className="space-y-3 flex-1">
        {tasks.map(task => (
          <div 
            key={task.id}
            className="flex items-center justify-between p-4 bg-[#121318] border border-gray-800/80 rounded-lg hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <input 
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 rounded border-gray-700 text-emerald-500 focus:ring-0 bg-transparent cursor-pointer"
              />
              <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                {task.title}
              </span>
              <span className="text-[10px] px-2 py-0.5 border border-gray-800 text-gray-400 rounded">
                {task.priority}
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
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}