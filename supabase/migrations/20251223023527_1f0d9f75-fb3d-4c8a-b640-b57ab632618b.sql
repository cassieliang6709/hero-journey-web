-- Create star_map_nodes table for node configurations
CREATE TABLE public.star_map_nodes (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_en text NOT NULL,
  description text NOT NULL,
  description_en text NOT NULL,
  category text NOT NULL CHECK (category IN ('psychology', 'health', 'skill')),
  position_x integer NOT NULL,
  position_y integer NOT NULL,
  connections text[] NOT NULL DEFAULT '{}',
  requirements text[] DEFAULT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS (public read for all authenticated users)
ALTER TABLE public.star_map_nodes ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read node configurations
CREATE POLICY "Authenticated users can view star map nodes"
ON public.star_map_nodes
FOR SELECT
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_star_map_nodes_updated_at
BEFORE UPDATE ON public.star_map_nodes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial node data
INSERT INTO public.star_map_nodes (id, name, name_en, description, description_en, category, position_x, position_y, connections, requirements, display_order) VALUES
-- 中心节点
('center', '成长中心', 'Growth Center', '你的成长中心', 'Your growth center', 'psychology', 500, 400, '{}', NULL, 0),

-- 心理优势分支
('psychology-root', '心理优势', 'Psychology', '心理优势能力发展', 'Psychological advantage development', 'psychology', 500, 150, ARRAY['psychology-emotion', 'psychology-thinking', 'psychology-confidence', 'psychology-stress'], NULL, 1),
('psychology-emotion', '情绪管理', 'Emotion Management', '提升情绪识别和调节能力', 'Improve emotional recognition and regulation', 'psychology', 350, 80, '{}', ARRAY['psychology-root'], 2),
('psychology-thinking', '思维模式', 'Thinking Patterns', '培养积极思维和成长心态', 'Develop positive thinking and growth mindset', 'psychology', 650, 80, '{}', ARRAY['psychology-root'], 3),
('psychology-confidence', '自信建立', 'Confidence Building', '增强自信心和自我价值感', 'Enhance self-confidence and self-worth', 'psychology', 400, 50, '{}', ARRAY['psychology-root'], 4),
('psychology-stress', '压力管理', 'Stress Management', '有效应对和管理压力', 'Effectively cope with and manage stress', 'psychology', 600, 50, '{}', ARRAY['psychology-root'], 5),

-- 身体健康分支
('health-root', '身体健康', 'Physical Health', '全面的身体健康管理', 'Comprehensive physical health management', 'health', 200, 550, ARRAY['health-exercise', 'health-diet', 'health-sleep', 'health-weight', 'health-fitness'], NULL, 10),
('health-exercise', '运动锻炼', 'Exercise', '制定并执行运动计划', 'Create and execute exercise plans', 'health', 80, 650, '{}', ARRAY['health-root'], 11),
('health-diet', '饮食管理', 'Diet Management', '建立健康的饮食习惯', 'Establish healthy eating habits', 'health', 180, 680, '{}', ARRAY['health-root'], 12),
('health-sleep', '睡眠优化', 'Sleep Optimization', '优化睡眠质量和作息规律', 'Optimize sleep quality and schedule', 'health', 280, 650, '{}', ARRAY['health-root'], 13),
('health-weight', '体重管理', 'Weight Management', '科学的体重控制方法', 'Scientific weight control methods', 'health', 120, 750, '{}', ARRAY['health-root'], 14),
('health-fitness', '体能提升', 'Fitness Improvement', '全面提升身体素质', 'Comprehensive physical fitness improvement', 'health', 240, 780, '{}', ARRAY['health-root'], 15),

-- 技能发展分支
('skill-root', '技能发展', 'Skill Development', '职场与生活技能全面提升', 'Comprehensive workplace and life skills improvement', 'skill', 800, 550, ARRAY['skill-interview', 'skill-communication', 'skill-career', 'skill-resume', 'skill-etiquette'], NULL, 20),
('skill-interview', '面试技巧', 'Interview Skills', '掌握面试表达和技巧', 'Master interview expression and skills', 'skill', 680, 650, '{}', ARRAY['skill-root'], 21),
('skill-communication', '沟通能力', 'Communication', '提升人际沟通技能', 'Improve interpersonal communication skills', 'skill', 780, 680, '{}', ARRAY['skill-root'], 22),
('skill-career', '职业规划', 'Career Planning', '制定清晰的职业发展路径', 'Create a clear career development path', 'skill', 880, 650, '{}', ARRAY['skill-root'], 23),
('skill-resume', '简历优化', 'Resume Optimization', '制作吸引人的简历', 'Create attractive resumes', 'skill', 720, 750, '{}', ARRAY['skill-root'], 24),
('skill-etiquette', '职场礼仪', 'Workplace Etiquette', '掌握职场基本礼仪', 'Master basic workplace etiquette', 'skill', 840, 780, '{}', ARRAY['skill-root'], 25);