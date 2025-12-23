import { supabase } from '@/integrations/supabase/client';

export interface ApiResult<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Unified API call wrapper for Supabase Edge Functions
 * Provides consistent error handling and response formatting
 */
export async function invokeEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<ApiResult<T>> {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body
    });

    if (error) {
      console.error(`Edge function ${functionName} error:`, error);
      return { data: null, error };
    }

    if (data?.error) {
      console.error(`Edge function ${functionName} service error:`, data.error);
      return { data: null, error: new Error(data.error) };
    }

    return { data: data as T, error: null };
  } catch (error) {
    console.error(`Edge function ${functionName} call failed:`, error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

/**
 * Unified database query wrapper
 * Provides consistent error handling for Supabase queries
 */
export async function handleDbQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: Error | null }>
): Promise<ApiResult<T>> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error('Database query error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Database query failed:', error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}
