import { supabase } from './supabase';

export interface FeedbackData {
  tipo: 'sugerencia' | 'error' | 'felicitacion' | 'otro';
  mensaje: string;
  app_origen: 'sase' | 'feria_alternativa';
  modulo?: string;
  ruta?: string;
  nombre?: string;
  grupo?: string;
  rol?: string;
  user_id?: string;
  session_id?: string;
  user_agent?: string;
  metadata?: any;
}

export const sendFeedback = async (data: FeedbackData) => {
  try {
    const { error } = await supabase
      .from('feedback_institucional')
      .insert([{
        ...data,
        user_agent: data.user_agent || window.navigator.userAgent,
        ruta: data.ruta || window.location.pathname,
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error sending feedback to Supabase:', error);
    
    // Fallback to localStorage
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('feria_feedback_fallback') || '[]');
      const fallbackData = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        synced: false
      };
      localStorage.setItem('feria_feedback_fallback', JSON.stringify([...existingFeedback, fallbackData]));
      return { success: false, fallback: true };
    } catch (fallbackError) {
      console.error('Critical failure: Could not save feedback to localStorage:', fallbackError);
      return { success: false, fallback: false };
    }
  }
};
