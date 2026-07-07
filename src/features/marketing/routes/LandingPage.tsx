// src/features/marketing/routes/LandingPage.tsx
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Zap, ArrowRight, UserCircle, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';

export const LandingPage = () => {
  const user = useAuthStore((state) => state.user);
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const getActiveRole = useAuthStore((state) => state.getActiveRole);

  const getReturnPath = () => {
    if (!activeWorkspaceId) return '/gateway';
    const role = getActiveRole();
    return role === 'member' ? '/v-hub' : '/dashboard';
  };

  const returnPath = getReturnPath();

  return (
    /* Lienzo Base: Papel mate de fondo para maximizar el contraste pasivo. */
    <div className="min-h-screen bg-[#fefdfd] text-[#111111] font-sans selection:bg-[#F3BAC9]/40">{/**1) bg-[#F7F7F5] 2)#fffbfb 3)#fffcfe 4)#fefdfd */}
      
      {/* 1. NAVEGACIÓN */}
      <nav className="flex justify-between items-center px-4 md:px-8 h-20 border-b border-[#EAEAE8] bg-[#fffbfb] sticky top-0 z-50"> {/**ffffff bg-[#F7F7F5] */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white border border-[#D1D1CD] rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-[#E6758B] font-black text-xl font-display">D</span>
          </div>
          <span className="font-display font-bold tracking-tighter text-xl text-[#111111]">DELONIX</span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-[#3A3835] border-r border-[#EAEAE8] pr-6">
                <UserCircle size={18} />
                <span className="text-sm font-medium tracking-wide">{user.full_name}</span>
              </div>
              <Link 
                to={returnPath} 
                className="flex items-center gap-2 bg-white hover:bg-[#F7F7F5] border border-[#D1D1CD] text-[#111111] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-[1px]"
              >
                <LayoutDashboard size={16} className="text-[#E6758B]" />
                Ir a la Consola
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[11px] font-bold text-[#5A5855] hover:text-[#111111] transition-colors uppercase tracking-widest">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-[#E6758B] hover:bg-[#D46077] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-[1px]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      {/* Mobile-First: Compresión en móviles (px-4) y expansión en escritorio (md:px-8). */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-16 md:pt-28 pb-16">
        <div className="text-center space-y-6 md:space-y-8">
          
          {/* Badge Técnico (UI Metadatos: uppercase, tracking-widest, text-xs[cite: 1]). 
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EAEAE8] text-[#5A5855] text-[10px] font-bold uppercase tracking-widest shadow-sm">
            <Zap size={12} className="text-[#E6758B]" /> 
            <span>Version 1.0.4 Ready for Deployment</span>
          </div>*/}

          {/* Título */}
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.05] text-[#111111] font-display"> {/** font-['Space_Grotesk'] */}
            MLOps Validation <br className="hidden md:block" /> 
            <span className="text-[#E6758B] font-bold ">
              For the Real World.
            </span>
          </h1>

          {/* Pitch: Interlineado amplio, gris cálido para evitar fatiga visual[cite: 1]. */}
          <p className="max-w-2xl mx-auto text-[#3A3835] text-base md:text-xl font-medium leading-relaxed">
            Cierra el ciclo. Conecta tus modelos de Hugging Face con retroalimentación humana en tiempo real, en entornos de validación bajo tu control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-8">
            {user ? (
              <Link 
                to={returnPath} 
                className="group flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-4 bg-[#E6758B] hover:bg-[#D46077] text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
              >
                Acceder a Workspace
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link 
                to="/register" 
                className="group flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-4 bg-[#E6758B] hover:bg-[#D46077] text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
              >
                Start Building Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F7F7F5] border border-[#D1D1CD] text-[#111111] font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-[1px]">
              Read Documentation
            </button>
          </div>
        </div>

       {/* 3. FEATURE CARDS (THE CORE) */}
        {/* Espaciado responsivo estricto (gap-6 en móvil, expandiendo en escritorio) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-20 md:mt-32">
          {[
            {
              icon: <Terminal size={24} className="text-[#E6758B]" />,
              title: "Sovereign Hosting",
              desc: "Infrastructure designed for privacy and decentralization."
            },
            {
              icon: <ShieldCheck size={24} className="text-[#E6758B]" />,
              title: "Human-in-the-loop",
              desc: "Real-time UAT interfaces for non-technical stakeholders."
            },
            {
              icon: <Zap size={24} className="text-[#E6758B]" />,
              title: "Hugging Face Sync",
              desc: "Instant integration with your latest model checkpoints."
            }
          ].map((feature, idx) => (
            
            <div key={idx} className="p-8 bg-[#FFF5F7] border border-[#EAEAE8] rounded-2xl hover:border-[#F3BAC9] hover:shadow-lg hover:-translate-y-1 transition-all group">
              
              <div className="mb-6 p-4 bg-white border border-[#EAEAE8] rounded-xl inline-flex shadow-sm group-hover:scale-105 group-hover:bg-[#F3BAC9]/15 transition-transform">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-[#111111] mb-3 font-display">
                {feature.title}
              </h3>
              <p className="text-[#3A3835] text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 py-10 border-t border-[#EAEAE8] text-center text-[#5A5855] text-[10px] font-sans tracking-widest uppercase">
        © 2026 Delonix-Regia // Distributed Systems Division
      </footer>
    </div>
  );
};