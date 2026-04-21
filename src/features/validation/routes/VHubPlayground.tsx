// src/features/validation/routes/VHubPlayground.tsx
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProject } from '../../projects/api/getProject'; 
import { createFeedback } from '../api/feedback';

export const VHubPlayground = () => {
  const { projectId } = useParams();
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [isInferring, setIsInferring] = useState(false);

  // 1. Cargamos los detalles del proyecto (Instrucciones de Penélope)
  const { data: project, isLoading } = useQuery({
    queryKey: ['project-detail', projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId
  });

  // 2. Mutación para guardar el Feedback en la Bóveda Polimórfica
  const feedbackMutation = useMutation({
    mutationFn: (evalData: any) => createFeedback('DEPLOYMENT_ID_MOCK', {
      input_data: { text: inputText },
      prediction: prediction,
      human_evaluation: evalData
    }),
    onSuccess: () => {
      alert("¡Gracias! Penélope recibirá tu evaluación pronto.");
      setPrediction(null);
      setInputText("");
    }
  });

  // 3. Simulación de la Inferencia (Mock del Cold Start)
  const handleInference = async () => {
    setIsInferring(true);
    // Simulamos el despertar de la GPU (Cold Start)
    await new Promise(res => setTimeout(res, 3000));
    
    setPrediction({
      label: "Neutral",
      confidence: 0.85,
      timestamp: new Date().toISOString()
    });
    setIsInferring(false);
  };

  if (isLoading) return <div className="text-emerald-500 animate-pulse">Sincronizando con el servidor...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">

        {/* Botón de Navegación (Volver) */}
      <div className="mb-6">
        <Link 
          to="/v-hub" 
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform mr-2">←</span>
          Volver a Mis Proyectos
        </Link>
      </div>

      {/* Encabezado: El contexto de Penélope */}
      <section className="mb-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-2">{project?.name}</h3>
        <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <span className="text-xl">💡</span>
          <p className="text-sm text-emerald-100/80 leading-relaxed italic">
            "{project?.description || 'Instrucciones: Evalúa si el modelo detecta correctamente el tono de los mensajes.'}"
          </p>
        </div>
      </section>

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