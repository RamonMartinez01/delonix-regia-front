// src/features/validation/components/InferenceArena.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedback } from '../api/feedback';
import { simulateInference } from '../../deployments/api/infer';



interface Props {
  deployment: any;
  projectDescription?: string;
}

export const InferenceArena = ({ deployment, projectDescription }: Props) => {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [isInferring, setIsInferring] = useState(false);

  // para manejar la notificación de UX en lugar del alert()
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const queryClient = useQueryClient(); // para la caché del historial de inferencias

  // Función auxiliar para mostrar notificaciones efímeras (desaparecen en 3s)
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
      // 3. Reemplazamos el alert() nativo
      showNotification('success', '¡Evaluación registrada en la bóveda con éxito!');
      setPrediction(null);
      setInputText("");

      // Invalidamos la caché de este despliegue específico
      queryClient.invalidateQueries({ queryKey: ['feedback-history', deployment.id] });
    },
    onError: () => {
      showNotification('error', 'Error al guardar la evaluación. Intenta de nuevo.');
    }
  });

  const handleInference = async () => {
    if (!inputText.trim()) return;
    
    setIsInferring(true);
    setPrediction(null);
    setNotification(null); // Limpiamos errores previos

    try {
      // 4. Usamos nuestra capa API abstraída. ¡Adiós código espagueti!
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

      {/* El componente visual de Notificación (Toast in-line) */}
      {notification && (
        <div className={`absolute top-0 left-0 w-full py-2 px-4 text-center text-sm font-medium animate-in slide-in-from-top-full duration-300 z-10 ${
          notification.type === 'success' ? 'bg-emerald-600/90 text-white' : 'bg-red-600/90 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <header className="mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">{deployment.name}</h2>
        <p className="text-sm text-slate-400 italic mt-2">"{deployment.instructions || projectDescription}"</p>
      </header>

       {/* La Arena de Pruebas */}
      <section className="grid grid-cols-1 gap-6">
        {/* Entrada de Azul */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Dato de Entrada</label>
          <textarea 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:border-emerald-500 outline-none transition-all resize-none min-h-[120px]"
            placeholder="Escribe algo aquí para que la IA lo analice..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            onClick={handleInference}
            disabled={isInferring || !inputText}
            className="mt-4 w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
          >
            {isInferring ? "Despertando Modelo (Cold Start)..." : "Analizar con IA"}
          </button>
        </div>

        {/* Zona de Resultados y Feedback Loop */}
        {prediction && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Resultado de IA</span>
              <span className="text-xs text-slate-500 font-mono">Confianza: {(prediction.confidence * 100).toFixed(0)}%</span>
            </div>
            
            <div className="text-3xl font-black text-white mb-8 text-center bg-slate-950 py-8 rounded-xl border border-slate-800">
              {prediction.label}
            </div>

            {/* El Bucle de Feedback Polimórfico */}
            <div className="border-t border-slate-800 pt-6">
              <p className="text-sm text-slate-400 mb-4 text-center">¿Es correcta esta predicción para el negocio?</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => feedbackMutation.mutate({ is_correct: true })}
                  className="py-3 px-4 bg-slate-800 hover:bg-emerald-900/30 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  👍 Sí, es correcta
                </button>
                <button 
                  onClick={() => feedbackMutation.mutate({ is_correct: false, feedback_type: 'correction_needed' })}
                  className="py-3 px-4 bg-slate-800 hover:bg-red-900/30 border border-slate-700 hover:border-red-500/50 rounded-xl text-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  👎 No, necesita ajuste
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};