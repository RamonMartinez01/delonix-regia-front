// src/features/validation/components/FeedbackHistory.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeedbackForDeployment } from '../api/feedback';
import { RefreshCw, CheckCircle2, AlertCircle, History } from 'lucide-react'; // Iconografía técnica

interface Props {
  deploymentId: string;
}

export const FeedbackHistory = ({ deploymentId }: Props) => {
  const { data: feedbackList, isLoading, isError, refetch, isRefetching} = useQuery({
    queryKey: ['feedback-history', deploymentId],
    queryFn: () => getFeedbackForDeployment(deploymentId),
    enabled: !!deploymentId,
  });

  const [isAnimating, setIsAnimating] = useState(false);

  const handleManualRefetch = async () => {
    setIsAnimating(true);
    await refetch();
    setTimeout(() => setIsAnimating(false), 700);
  };

  // Estados Transitorios Estructurados
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-[#A1A19A]">
        <div className="w-5 h-5 border-2 border-[#EAEAE8] border-t-brand-primary rounded-full animate-spin mb-3" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5855] animate-pulse">Cargando bitácora...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-brand-surface border border-brand-accent rounded-xl flex items-center gap-3 text-[#D46077] shadow-sm mt-4">
        <AlertCircle size={16} strokeWidth={2.5} />
        <p className="text-sm font-medium">Error de conexión: No se pudo cargar el historial.</p>
      </div>
    );
  }
  
  if (!feedbackList || feedbackList.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed border-[#D1D1CD] bg-[#F7F7F5] rounded-xl text-center flex flex-col items-center justify-center gap-2 shadow-inner mt-4">
        <History size={24} strokeWidth={1.5} className="text-[#A1A19A] mb-1" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5A5855]">Bitácora en Blanco</p>
        <p className="text-xs font-medium text-[#A1A19A]">Aún no hay evaluaciones registradas para este modelo.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Encabezado Táctico */}
      <div className="flex items-center justify-between mb-5 border-b border-[#EAEAE8] pb-3">
        <h3 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest">Mis Evaluaciones Anteriores</h3>
        
        <button 
          onClick={handleManualRefetch}
          disabled={isRefetching || isAnimating}
          className="text-[#A1A19A] hover:text-[#111111] transition-colors p-1.5 rounded-md hover:bg-[#F7F7F5] disabled:opacity-50 active:scale-95 border border-transparent hover:border-[#D1D1CD]"
          title="Actualizar historial"
        >
          <RefreshCw size={14} strokeWidth={2.5} className={isAnimating || isRefetching ? 'animate-spin text-brand-primary' : ''} />
        </button>
      </div>
      
      {/* Tarjetero de Auditoría */}
      <div className="space-y-3 custom-scrollbar overflow-y-auto pr-2 max-h-125">
        {feedbackList.map((item) => {
          const isCorrect = item.human_evaluation?.is_correct;
          const textInput = item.input_data?.text || "Dato desconocido";
          const predictedLabel = item.prediction?.label || "Sin etiqueta";
          const date = new Date(item.created_at).toLocaleDateString('es-ES', { 
            day: '2-digit', month: 'short', year: 'numeric' 
          }).replace('.', '');

          return (
            <div 
              key={item.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl transition-all duration-300 gap-4 shadow-sm ${
                isAnimating || isRefetching
                  ? 'bg-[#F7F7F5] border-[#EAEAE8] scale-[0.99] opacity-70' // Estado actualizando (papel hundido)
                  : 'bg-white border-[#EAEAE8] hover:border-[#D1D1CD]'     // Estado normal (papel apoyado)
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#111111] font-medium truncate mb-1.5" title={textInput}>
                  <span className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mr-2">Entrada:</span> 
                  "{textInput}"
                </p>
                <p className="text-xs text-[#5A5855] flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest">Predicción IA:</span> 
                  <span className="font-mono font-bold bg-[#F7F7F5] px-2 py-0.5 rounded border border-[#EAEAE8]">{predictedLabel}</span>
                </p>
              </div>

              {/* Bloque de Metadatos (Veredicto y Fecha) */}
              <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5 shrink-0">
                <div className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border ${
                  isCorrect 
                    ? 'bg-role-validator/10 text-role-validator border-role-validator/20' // Verde Salvia
                    : 'bg-brand-surface text-[#D46077] border-brand-accent'       // Salmón/Rosa
                }`}>
                  {isCorrect ? <CheckCircle2 size={12} strokeWidth={2.5} /> : <AlertCircle size={12} strokeWidth={2.5} />}
                  {isCorrect ? 'Aprobado' : 'Rechazado'}
                </div>
                <span className="text-[10px] text-[#A1A19A] font-bold uppercase tracking-widest">{date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};