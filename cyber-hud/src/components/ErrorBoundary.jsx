import React from 'react';
import { ShieldAlert } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In an enterprise app, you would send this to Sentry or Datadog
    console.error("Matrix UI Malfunction:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-50 p-8">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
          <h1 className="text-3xl font-bold tracking-widest text-red-400 mb-4">SYSTEM MALFUNCTION</h1>
          <p className="text-white/50 mb-8 max-w-md text-center">
            A critical error occurred in the visual cortex. Our engineering drones have logged the anomaly.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all font-bold tracking-wider"
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;