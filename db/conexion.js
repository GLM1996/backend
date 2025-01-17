import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

// URL y clave de tu proyecto en Supabase
const SUPABASE_URL = process.env.SUPABASE_URL; // Copia esto de la consola de Supabase
const SUPABASE_KEY = process.env.SUPABASE_KEY; // Copia tu clave de API (de tipo "service_role" si necesitas escritura)

// Inicializa el cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
