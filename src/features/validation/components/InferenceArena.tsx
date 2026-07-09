// src/features/validation/components/InferenceArena.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedback } from '../api/feedback';
import { simulateInference } from '../../deployments/api/infer';
import { Sparkles, BrainCircuit, ThumbsUp, ThumbsDown, CheckCircle2, AlertCircle } from 'lucide-react'; // Iconografía táctil y profesional

interface Props {
  deployment: any;
  projectDescription?: string;
}

export const InferenceArena = ({ deployment, projectDescription }: Props) => {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [isInferring, setIsInferring] = useState(false);

  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const queryClient = useQueryClient(); 

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const feedbackMutation = useMutation({
    mutationFn: (evalData: any) => createFeedback(deployment.id, {
      input_data: { text: inputText },
      prediction: prediction,
      human_evaluation: evalData
    }),
    onSuccess: () => {
      showNotification('success', 'Auditoría registrada en la bóveda con éxito.');
      setPrediction(null);
      setInputText("");

      queryClient.invalidateQueries({ queryKey: ['feedback-history', deployment.id] });
    },
    onError: () => {
      showNotification('error', 'Error al guardar la evaluación. Verifica la conexión.');
    }
  });

  const handleInference = async () => {
    if (!inputText.trim()) return;
    
    setIsInferring(true);
    setPrediction(null);
    setNotification(null); 

    try {
      const data = await simulateInference(deployment.id, inputText);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Falla en la comunicación con el motor de inferencia:", error);
      showNotification('error', 'El motor de inferencia no respondió a tiempo.');
    } finally {
      setIsInferring(false);
    }
  };

  return (
    /* Contenedor principal: Lienzo blanco, relativo para contener la notificación */
    <div className="bg-white border border-[#EAEAE8] rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden transition-all">

      {/* Componente visual de Notificación (Banda de estatus física) */}
      {notification && (
        <div className={`absolute top-0 left-0 w-full py-2.5 px-4 text-center text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 animate-in slide-in-from-top-full duration-300 z-10 ${
          notification.type === 'success' 
            ? 'bg-role-validator text-white border-b border-[#5A5855]' 
            : 'bg-[#D46077] text-white border-b border-[#A1A19A]'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <AlertCircle size={14} strokeWidth={2.5} />}
          {notification.message}
        </div>
      )}

      {/* Cabecera del Documento */}
      <header className="mb-8 border-b border-[#EAEAE8] pb-5 mt-2">
        <h2 className="text-xl md:text-2xl font-bold font-display text-[#111111]">{deployment.name}</h2>
        <p className="text-sm font-medium text-[#5A5855] leading-relaxed mt-2 relative before:absolute before:-left-3 before:top-1 before:bottom-1 before:w-1 before:bg-[#D1D1CD] before:rounded-r-md ml-3">
          {deployment.instructions || projectDescription}
        </p>
      </header>

      {/* La Arena de Pruebas */}
      <section className="space-y-8">
        
        {/* Zona de Captura (Hendidura Física) */}
        <div className="bg-[#F7F7F5] border border-[#EAEAE8] rounded-xl p-5 shadow-inner">
          <label className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-3 flex items-center gap-2 ml-1">
            <Sparkles size={12} strokeWidth={2.5} className="text-[#5A5855]" />
            Dato de Entrada para Análisis
          </label>
          <textarea 
            className="w-full bg-white border border-[#D1D1CD] rounded-lg p-4 text-[#111111] font-medium focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all resize-none min-h-30 shadow-sm custom-scrollbar"
            placeholder="Introduce el texto que deseas someter a la evaluación del modelo..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isInferring}
          />
          <button 
            onClick={handleInference}
            disabled={isInferring || !inputText.trim()}
            className="mt-4 w-full py-3.5 bg-brand-primary hover:bg-[#D46077] disabled:bg-white disabled:border disabled:border-[#D1D1CD] disabled:text-[#A1A19A] text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            {isInferring ? (
              <>
                <div className="w-4 h-4 border-2 border-[#A1A19A] border-t-brand-primary rounded-full animate-spin" />
                Sincronizando Motor (Cold Start)...
              </>
            ) : (
              <>
                <BrainCircuit size={18} strokeWidth={2.5} />
                Ejecutar Inferencia Analítica
              </>
            )}
          </button>
        </div>

        {/* Zona de Resultados y Bucle de Auditoría */}
        {prediction && (
          <div className="bg-white border-2 border-[#EAEAE8] rounded-xl p-6 animate-in slide-in-from-top-4 shadow-sm">
            
            {/* Metadatos del Resultado */}
            <div className="flex justify-between items-end mb-5 border-b border-[#F7F7F5] pb-3">
              <span className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest">Veredicto del Modelo</span>
              <span className="text-[10px] text-[#5A5855] font-bold uppercase tracking-widest flex items-center gap-1.5">
                Nivel de Certeza: 
                <span className="font-mono text-role-engineer bg-[#F7F7F5] px-2 py-0.5 rounded border border-[#EAEAE8]">
                  {(prediction.confidence * 100).toFixed(1)}%
                </span>
              </span>
            </div>
            
            {/* El Veredicto (Display Tipográfico) */}
            <div className="text-2xl md:text-3xl font-black font-display text-[#111111] mb-8 text-center bg-[#F7F7F5] py-10 rounded-xl border border-[#D1D1CD] shadow-inner">
              {prediction.label}
            </div>

            {/* El Bucle de Feedback Estructurado */}
            <div className="border-t border-[#EAEAE8] pt-6">
              <p className="text-[11px] font-bold text-[#5A5855] uppercase tracking-widest mb-4 text-center">
                Auditoría del Resultado
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Botón de Aprobación (Verde Salvia) */}
                <button 
                  onClick={() => feedbackMutation.mutate({ is_correct: true })}
                  className="py-3.5 px-4 bg-white border border-[#D1D1CD] hover:border-role-validator hover:bg-role-validator/5 rounded-xl text-[#5A5855] hover:text-role-validator font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 group"
                >
                  <ThumbsUp size={16} strokeWidth={2.5} className="text-[#A1A19A] group-hover:text-role-validator transition-colors" />
                  Clasificación Correcta
                </button>
                
                {/* Botón de Rechazo (Rosa/Salmón) */}
                <button 
                  onClick={() => feedbackMutation.mutate({ is_correct: false, feedback_type: 'correction_needed' })}
                  className="py-3.5 px-4 bg-white border border-[#D1D1CD] hover:border-[#D46077] hover:bg-brand-surface rounded-xl text-[#5A5855] hover:text-[#D46077] font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 group"
                >
                  <ThumbsDown size={16} strokeWidth={2.5} className="text-[#A1A19A] group-hover:text-[#D46077] transition-colors" />
                  Requiere Calibración
                </button>

              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};