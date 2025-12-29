import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCallback } from 'react';

interface PhysicalTestResult {
  id: string;
  overall_score: number;
  recommendations: string[];
  level: string;
  age: number;
  weight: number;
  height: number;
  pushups: number;
  situps: number;
  running_time: number;
  flexibility_score?: number;
  created_at: string;
}

interface TalentTestResult {
  id: string;
  leadership_score: number;
  innovation_score: number;
  harmony_score: number;
  execution_score: number;
  primary_talent: string;
  talent_description?: string;
  strengths: string[];
  recommendations: string[];
  created_at: string;
}

// Query keys
export const testResultsKeys = {
  all: ['testResults'] as const,
  physical: () => [...testResultsKeys.all, 'physical'] as const,
  talent: () => [...testResultsKeys.all, 'talent'] as const,
};

// Fetch functions
const fetchPhysicalResults = async (): Promise<PhysicalTestResult[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('physical_test_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

const fetchTalentResults = async (): Promise<TalentTestResult[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('talent_test_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const useTestResults = () => {
  const queryClient = useQueryClient();

  // Query for physical test results
  const { 
    data: physicalTestResults = [], 
    isLoading: physicalLoading 
  } = useQuery({
    queryKey: testResultsKeys.physical(),
    queryFn: fetchPhysicalResults,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Query for talent test results
  const { 
    data: talentTestResults = [], 
    isLoading: talentLoading 
  } = useQuery({
    queryKey: testResultsKeys.talent(),
    queryFn: fetchTalentResults,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Mutation for saving physical test result
  const savePhysicalMutation = useMutation({
    mutationFn: async (result: Omit<PhysicalTestResult, 'id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('physical_test_results')
        .insert([{ ...result, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<PhysicalTestResult[]>(testResultsKeys.physical(), (old) => 
        [data, ...(old || [])]
      );
    },
  });

  // Mutation for saving talent test result
  const saveTalentMutation = useMutation({
    mutationFn: async (result: Omit<TalentTestResult, 'id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('talent_test_results')
        .insert([{ ...result, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<TalentTestResult[]>(testResultsKeys.talent(), (old) => 
        [data, ...(old || [])]
      );
    },
  });

  const savePhysicalTestResult = useCallback(async (result: Omit<PhysicalTestResult, 'id' | 'created_at'>) => {
    try {
      return await savePhysicalMutation.mutateAsync(result);
    } catch {
      return null;
    }
  }, [savePhysicalMutation]);

  const saveTalentTestResult = useCallback(async (result: Omit<TalentTestResult, 'id' | 'created_at'>) => {
    try {
      return await saveTalentMutation.mutateAsync(result);
    } catch {
      return null;
    }
  }, [saveTalentMutation]);

  const refreshTestResults = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: testResultsKeys.all });
  }, [queryClient]);

  return {
    physicalTestResults,
    talentTestResults,
    loading: physicalLoading || talentLoading,
    savePhysicalTestResult,
    saveTalentTestResult,
    refreshTestResults
  };
};
