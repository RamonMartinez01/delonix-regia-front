// src/features/auth/components/LoginForm.tsx
import { useState } from 'react';
import { useLogin } from '../api/login';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, isError } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    mutate({ email, password });
  };

  return (
    /* Elevación física: Tarjeta blanca pura sobre el lienzo canvas */
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-sm bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-[#EAEAE8]"
    >
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-display text-[#111111] tracking-tight">Delonix Regia</h2>
        <p className="text-sm font-medium text-[#5A5855] mt-2">Acceso a MLOps</p>
      </div>

      {/* Manejo de error estructurado con contraste cálido */}
      {isError && (
        <div className="mb-6 p-4 bg-[#FFF5F7] border border-[#F3BAC9] rounded-xl text-[#D46077] text-sm text-center font-medium">
          Credenciales inválidas o error de conexión.
        </div>
      )}

      <div className="mb-5">
        {/* Jerarquía UI estricta para etiquetas */}
        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5855] mb-2" htmlFor="email">
          Correo Electrónico
        </label>
        {/* Input como hendidura física, transición a border-brand-primary al hacer focus */}
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3.5 rounded-xl bg-brand-canvas border border-[#D1D1CD] text-[#111111] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-[#A1A19A]"
          placeholder="correo@ejemplo.com"
          required
        />
      </div>

      <div className="mb-8">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5855] mb-2" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3.5 rounded-xl bg-brand-canvas border border-[#D1D1CD] text-[#111111] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-[#A1A19A]"
          placeholder="********"
          required
        />
      </div>

      <div className="space-y-4">
        {/* CTA Principal usando nuestro token semántico */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand-primary hover:bg-[#D46077] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isPending ? 'Autenticando...' : 'Iniciar Sesión'}
        </button>

        {/* Botón Secundario: Contraste táctil invertido */}
        <Link
          to="/"
          className="w-full group flex items-center justify-center gap-2 bg-white border border-[#D1D1CD] hover:bg-[#F7F7F5] text-[#111111] font-bold py-3.5 rounded-xl transition-all hover:-translate-y-[1px]"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-[#5A5855] group-hover:text-[#111111]" />
          <span className="text-sm">Cancelar</span>
        </Link>
      </div>
    </form>
  );
};