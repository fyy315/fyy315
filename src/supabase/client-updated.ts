/**
 * Supabase Client Configuration
 * 
 * 配置说明：
 * - 使用环境变量配置 Supabase 连接
 * - 支持本地开发和 Vercel 部署
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// 从环境变量读取配置，如果没有则使用默认值
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                     import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
                     'https://your-project.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                        import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                        'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Storage 配置
export const storageUrl = import.meta.env.VITE_SUPABASE_STORAGE_URL ||
                          import.meta.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL ||
                          `${supabaseUrl}/storage/v1/object/public`;

export const storageBucket = import.meta.env.VITE_STORAGE_BUCKET ||
                             import.meta.env.NEXT_PUBLIC_STORAGE_BUCKET ||
                             'uploads';

export default supabase;
