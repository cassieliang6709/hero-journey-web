
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useTestResults = () => {
  const [physicalTestResults, setPhysicalTestResults] = useState<PhysicalTestResult[]>([]);
  const [talentTestResults, setTalentTestResults] = useState<TalentTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTestResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 加载体能测试结果
      const { data: physicalData, error: physicalError } = await supabase
        .from('physical_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (physicalError) {
        console.error('Error loading physical test results:', physicalError);
      } else {
        setPhysicalTestResults(physicalData || []);
      }

      // 加载天赋测试结果
      const { data: talentData, error: talentError } = await supabase
        .from('talent_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (talentError) {
        console.error('Error loading talent test results:', talentError);
      } else {
        setTalentTestResults(talentData || []);
      }
    } catch (error) {
      console.error('Error loading test results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestResults();
  }, []);

  const savePhysicalTestResult = async (result: Omit<PhysicalTestResult, 'id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('physical_test_results')
        .insert([{ ...result, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error saving physical test result:', error);
        return null;
      }

      setPhysicalTestResults(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error saving physical test result:', error);
      return null;
    }
  };

  const saveTalentTestResult = async (result: Omit<TalentTestResult, 'id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('talent_test_results')
        .insert([{ ...result, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error saving talent test result:', error);
        return null;
      }

      setTalentTestResults(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error saving talent test result:', error);
      return null;
    }
  };

  return {
    physicalTestResults,
    talentTestResults,
    loading,
    savePhysicalTestResult,
    saveTalentTestResult,
    refreshTestResults: loadTestResults
  };
};
