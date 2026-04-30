// src/features/validation/components/FeedbackHistory.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeedbackForDeployment } from '../api/feedback';

interface Props {
  deploymentId: string;
}

export const FeedbackHistory = ({ deploymentId }: Props) => {
  const { data: feedbackList, isLoading, isError, refetch, isRefetching} = useQuery({
    queryKey: ['feedback-history', deploymentId],
    queryFn: () => getFeedbackForDeployment(deploymentId),
    enabled: !!deploymentId,
  });

  // Estado local para garantizar que la animación sea visible
  const [isAnimating, setIsAnimating] = useState(false);

  // Función envolvente para el botón "Refresh"
  const handleManualRefetch = async () => {
    setIsAnimating(true);
    await refetch();
    // Forzamos que la animación dure al menos 700ms
    setTimeout(() => setIsAnimating(false), 700);
  };

  if (isLoading) return <div className="mt-8 text-slate-500 animate-pulse text-sm">Cargando bitácora de evaluaciones...</div>;
  if (isError) return <div className="mt-8 text-red-500 text-sm">No se pudo cargar el historial.</div>;
  
  if (!feedbackList || feedbackList.length === 0) {
    return (
      <div className="mt-8 p-6 border border-slate-800 border-dashed rounded-xl text-center text-slate-500 text-sm">
        Aún no hay evaluaciones registradas para este modelo.
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* 2. Modificamos el encabezado para incluir el botón */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mis Evaluaciones Anteriores</h3>
        
        <button 
          onClick={handleManualRefetch}
          disabled={isRefetching || isAnimating}
          className="text-slate-500 hover:text-emerald-400 transition-colors p-1 rounded-md hover:bg-slate-800 disabled:opacity-50"
          title="Actualizar historial"
        >
          {/* Un ícono SVG simple de Refresh que girará cuando isRefetching sea true */}
          <svg 
            className={`w-4 h-4 ${isAnimating || isRefetching ? 'animate-spin text-emerald-500' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-3">
        {feedbackList.map((item) => {
          // Extraemos la polimorfia (asumiendo nuestra estructura actual)
          const isCorrect = item.human_evaluation?.is_correct;
          const textInput = item.input_data?.text || "Dato desconocido";
          const predictedLabel = item.prediction?.label || "Sin etiqueta";
          const date = new Date(item.created_at).toLocaleDateString();

         return (
            <div 
              key={item.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl transition-all duration-300 gap-4 ${
                isAnimating || isRefetching
                  ? 'bg-slate-800/70 border-slate-700 scale-[0.99] opacity-80' // actualizando
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'     // Estado normal
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate" title={textInput}>
                  <span className="text-slate-500 mr-2">Entrada:</span> 
                  "{textInput}"
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Predicción IA: <span className="text-emerald-500/70 font-mono">{predictedLabel}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                  isCorrect 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {isCorrect ? '👍 Aprobado' : '👎 Rechazado'}
                </div>
                <span className="text-[10px] text-slate-600 font-mono">{date}</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};