// src/features/auth/components/RegisterForm.tsx
import { useState} from 'react';
import { Link } from 'react-router-dom';
import { useCheckEmail } from '../api/checkEmail';
import { useRegister } from '../api/register';
import { useActivateOwner } from '../api/activateOwner';
import { UserPlus, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // 1. Activamos el Radar
  const { data: status, isLoading: isChecking } = useCheckEmail(email);

  // 2. Preparamos ambos Martillos
  const registerMutation = useRegister();
  const activateMutation = useActivateOwner();

  // Determinamos el modo de operación
  const isUpgradeMode = status?.exists && status?.requires_upgrade;
  const isAlreadyOwner = status?.exists && !status?.requires_upgrade;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpgradeMode) {
      // Caso Azul: Solo necesitamos email y password para el upgrade
      activateMutation.mutate({ email, password });
    } else {
      // Caso Nuevo Usuario: Flujo estándar
      registerMutation.mutate({ email, full_name: fullName, password });
    }
  };

  const isPending = registerMutation.isPending || activateMutation.isPending;

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
          {isUpgradeMode ? <ShieldCheck className="text-emerald-400" /> : <UserPlus className="text-emerald-500" />}
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          {isUpgradeMode ? 'Activar Centro de Operaciones ML' : 'Crear tu Workspace'}
        </h2>
        <p className="text-slate-400 mt-2">
          {isUpgradeMode 
            ? `Hola ${status.full_name}, reclama tu workspace personal.` 
            : 'Inicia la orquestación de tus modelos hoy mismo.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/40 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-xl shadow-2xl">
        
        {/* Mensaje para usuarios que ya son dueños */}
        {isAlreadyOwner && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>Ya posees un Workspace activo. <Link to="/login" className="font-bold underline">Inicia sesión aquí.</Link></p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <input
                required
                type="email"
                value={email}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
              {isChecking && <Loader2 className="absolute right-4 top-4 animate-spin text-slate-600" size={20} />}
            </div>
          </div>

          {/* EL CAMALEÓN: El campo Nombre desaparece si el usuario ya existe */}
          {!status?.exists && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
              <input
                required
                type="text"
                value={fullName}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              {isUpgradeMode ? 'Confirma tu Contraseña' : 'Crea una Contraseña'}
            </label>
            <input
              required
              type="password"
              value={password}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          disabled={isPending || isAlreadyOwner || isChecking}
          className="w-full group relative flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] active:scale-95"
        >
          {isPending ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              {isUpgradeMode ? 'Activar mi Workspace' : 'Registrarme'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};