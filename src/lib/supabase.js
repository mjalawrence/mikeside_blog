
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itabkkobpuvnbuqtqmjm.supabase.co';
const supabaseKey = 'sb_publishable_fE1mWFy21_s123CmXVUChQ_TrIiR_sv';

export const supabase = createClient(supabaseUrl, supabaseKey);
