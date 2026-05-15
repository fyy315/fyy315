/**
 * Supabase Client Configuration
 * 使用环境变量配置，支持 Vite 和 Next.js 环境
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
  (typeof window !== 'undefined' && (window as any).__ENV__?.SUPABASE_URL) ||
  '';

const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
  (typeof window !== 'undefined' && (window as any).__ENV__?.SUPABASE_ANON_KEY) ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 环境变量未配置，请检查 .env 文件');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export { supabaseUrl, supabaseAnonKey };

export const getSupabaseStorageUrl = (): string => {
  return (import.meta.env.VITE_SUPABASE_STORAGE_URL as string) ||
    (import.meta.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL as string) ||
    `${supabaseUrl}/storage/v1/object/public`;
};

export const getStorageBucket = (): string => {
  return (import.meta.env.VITE_STORAGE_BUCKET as string) ||
    (import.meta.env.NEXT_PUBLIC_STORAGE_BUCKET as string) ||
    'uploads';
};
