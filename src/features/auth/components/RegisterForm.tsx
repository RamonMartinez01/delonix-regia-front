// src/features/auth/components/RegisterForm.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCheckEmail } from '../api/checkEmail';
import { useRegister } from '../api/register';
import { useActivateOwner } from '../api/activateOwner';
import { UserPlus, ArrowRight, ArrowLeft, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullName, setFullName] = useState('');

  // 1. Revisa si el email existe en la DB
  const { data: status, isLoading: isChecking } = useCheckEmail(email);

  // 2. Si el email no  existe
  // Se comunica con el endpoint de registro, y con el endpoint que crea un workspace
  const registerMutation = useRegister();
  const activateMutation = useActivateOwner();

  // Determinamos el modo de operación
  const isUpgradeMode = status?.exists && status?.requires_upgrade; // si el usuario existe y tiene rol distinto de <ownwer>
  const isAlreadyOwner = status?.exists && !status?.requires_upgrade; // si el usuario existe y ya es <ownwer>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Validación de contraseñas
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    if (isUpgradeMode) {
      // Caso Azul (ya existe como <member>): Solo necesitamos email y password para el upgrade
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
        <div className="mx-auto w-14 h-14 bg-white border border-[#D1D1CD] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          {isUpgradeMode ? <ShieldCheck className="text-brand-primary" /> : <UserPlus className="text-brand-primary" />}
        </div>
        <h2 className="text-3xl font-bold font-display text-[#111111] tracking-tight">
          {isUpgradeMode ? 'Activar Centro de Operaciones ML' : 'Crear tu Workspace'}
        </h2>
        <p className="text-sm font-medium text-[#5A5855] mt-2">
          {isUpgradeMode
            ? `Hola ${status.full_name}, reclama tu workspace personal.`
            : 'Inicia la orquestación de tus modelos hoy mismo.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-10 rounded-2xl border border-[#EAEAE8] shadow-sm">

        {/* Mensaje para usuarios que ya son dueños */}
        {isAlreadyOwner && (
          <div className="p-4 bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl text-[#3A3835] text-sm flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-brand-primary" />
            <p>Ya posees un Workspace activo. <Link to="/login" className="font-bold underline hover:text-[#111111] transition-colors">Inicia sesión aquí.</Link></p>
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5855] ml-1">Email</label>
            <div className="relative">
              <input
                required
                type="email"
                value={email}
                className="w-full p-3.5 rounded-xl bg-brand-canvas border border-[#D1D1CD] text-[#111111] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-[#A1A19A]"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
              {isChecking && <Loader2 className="absolute right-4 top-4 animate-spin text-[#A1A19A]" size={20} />}
            </div>
          </div>

          {!status?.exists && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5855] ml-1">Nombre</label>
              <input
                required
                type="text"
                value={fullName}
                className="w-full p-3.5 rounded-xl bg-brand-canvas border border-[#D1D1CD] text-[#111111] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-[#A1A19A]"
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5855] ml-1">
              {isUpgradeMode ? 'Confirma tu Contraseña' : 'Crea una Contraseña'}
            </label>
            <input
              required
              type="password"
              value={password}
              className="w-full p-3.5 rounded-xl bg-brand-canvas border border-[#D1D1CD] text-[#111111] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-[#A1A19A]"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5855] ml-1">
              Confirma tu Contraseña
            </label>
            <input
              required
              type="password"
              value={confirmPassword}
              className={`w-full p-3.5 rounded-xl bg-brand-canvas border ${passwordError ? 'border-red-500' : 'border-[#D1D1CD]'} text-[#111111] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-[#A1A19A]`}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              placeholder="********"
            />
            {passwordError && (
              <p className="text-xs text-red-500 font-medium ml-1 mt-1 flex items-center gap-1 animate-in fade-in">
                <AlertCircle size={14} />
                {passwordError}
              </p>
            )}
          </div>

        </div>

        {/* LA ESCOTILLA DE ESCAPE */}
        <div className="space-y-4 pt-4">
          <button
            type="submit"
            disabled={isPending || isAlreadyOwner || isChecking}
            className="w-full group relative flex items-center justify-center gap-2 bg-brand-primary hover:bg-[#D46077] disabled:bg-[#D1D1CD] disabled:text-[#A1A19A] text-white font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-95"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isUpgradeMode ? 'Activar mi Workspace' : 'Registrarme'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Botón Secundario alineado al Login */}
          <Link
            to="/"
            className="w-full group flex items-center justify-center gap-2 bg-white border border-[#D1D1CD] hover:bg-[#F7F7F5] text-[#111111] font-bold py-3.5 rounded-xl transition-all hover:-translate-y-[1px] active:scale-95"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-[#5A5855] group-hover:text-[#111111]" />
            <span className="text-sm">Cancelar</span>
          </Link>
        </div>
      </form>
    </div>
  );
};