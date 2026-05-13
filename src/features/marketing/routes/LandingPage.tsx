// src/features/marketing/routes/LandingPage.tsx
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30">
      
      {/* 1. NAVEGACIÓN MINIMALISTA */}
      <nav className="flex justify-between items-center px-8 h-20 border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/40 rounded-lg flex items-center justify-center">
            <span className="text-emerald-500 font-black text-xl">D</span>
          </div>
          <span className="font-mono font-bold tracking-tighter text-xl">DELONIX-REGIA</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="max-w-6xl mx-auto px-8 pt-24 pb-16">
        <div className="text-center space-y-8">
          {/* Badge Técnico */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-fade-in">
            <Zap size={12} /> Version 1.0.4 Ready for Deployment
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none text-white">
            MLOps Validation <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              For the Real World.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
            Cierra el bucle de entrenamiento. Conecta tus modelos de Hugging Face con 
            feedback humano en tiempo real en entornos de validación soberanos.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              to="/register" 
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-900/40"
            >
              Start Building Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl transition-all">
              Read Documentation
            </button>
          </div>
        </div>

        {/* 3. FEATURE CARDS (THE CORE) */}
        <div className="grid md:grid-cols-3 gap-6 mt-32">
          {[
            {
              icon: <Terminal className="text-emerald-500" />,
              title: "Sovereign Hosting",
              desc: "Infrastructure designed for privacy and decentralization."
            },
            {
              icon: <ShieldCheck className="text-emerald-500" />,
              title: "Human-in-the-loop",
              desc: "Real-time UAT interfaces for non-technical stakeholders."
            },
            {
              icon: <Zap className="text-emerald-500" />,
              title: "Hugging Face Sync",
              desc: "Instant integration with your latest model checkpoints."
            }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all group">
              <div className="mb-4 p-3 bg-slate-950 rounded-xl inline-block group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 py-10 border-t border-slate-800/50 text-center text-slate-600 text-[10px] font-mono tracking-widest uppercase">
        © 2026 Delonix-Regia // Distributed Systems Division
      </footer>
    </div>
  );
};