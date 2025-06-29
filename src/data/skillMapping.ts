
export interface SkillMapping {
  todoCategory: string;
  todoKeywords: string[];
  skillNodeId: string;
}

export const SKILL_MAPPINGS: SkillMapping[] = [
  // Pitch表达技能
  {
    todoCategory: '准备',
    todoKeywords: ['自我介绍', '技术标签'],
    skillNodeId: 'pitch-intro'
  },
  {
    todoCategory: '沟通',
    todoKeywords: ['沟通', '价值', '扫描', '需求'],
    skillNodeId: 'pitch-communication'
  },
  {
    todoCategory: '沟通',
    todoKeywords: ['倾听', '对齐'],
    skillNodeId: 'pitch-alignment'
  },
  
  // 团队组建技能
  {
    todoCategory: '组队',
    todoKeywords: ['组队', '团队'],
    skillNodeId: 'team-identification'
  },
  {
    todoCategory: '筛选',
    todoKeywords: ['筛选', '匹配', '技术匹配'],
    skillNodeId: 'team-value'
  },
  {
    todoCategory: '组队',
    todoKeywords: ['主动', '协作'],
    skillNodeId: 'team-collaboration'
  },
  
  // MVP搭建能力
  {
    todoCategory: 'MVP',
    todoKeywords: ['MVP', '范围', '功能'],
    skillNodeId: 'mvp-definition'
  },
  {
    todoCategory: '技术',
    todoKeywords: ['技术栈', '可行性', '判断'],
    skillNodeId: 'mvp-feasibility'
  },
  {
    todoCategory: 'MVP',
    todoKeywords: ['极简', 'mock', '云服务', '替代'],
    skillNodeId: 'mvp-strategy'
  },
  
  // 协作开发
  {
    todoCategory: '技术',
    todoKeywords: ['Git', '仓库', '环境'],
    skillNodeId: 'dev-git'
  },
  {
    todoCategory: '开发',
    todoKeywords: ['开发', '模块化', '汇报', '进度'],
    skillNodeId: 'dev-sync'
  },
  {
    todoCategory: '开发',
    todoKeywords: ['设计', '接口', '对齐'],
    skillNodeId: 'dev-interface'
  },
  
  // 技术路演表达
  {
    todoCategory: '路演',
    todoKeywords: ['路演', '亮点', '技术亮点'],
    skillNodeId: 'demo-expression'
  },
  {
    todoCategory: '路演',
    todoKeywords: ['彩排', '演示', '稳定性'],
    skillNodeId: 'demo-rehearsal'
  },
  {
    todoCategory: '路演',
    todoKeywords: ['答辩', '回应', '技术提问'],
    skillNodeId: 'demo-qa'
  },
  
  // 应急与恢复力
  {
    todoCategory: '工具',
    todoKeywords: ['备胎', '文档', 'U盘', '预案'],
    skillNodeId: 'emergency-backup'
  },
  {
    todoCategory: '路演',
    todoKeywords: ['崩溃', '截图', '录屏', '备用'],
    skillNodeId: 'emergency-fallback'
  },
  {
    todoCategory: '工具',
    todoKeywords: ['技术栈', '离线', '急救'],
    skillNodeId: 'emergency-toolkit'
  },
  
  // 基础能量管理
  {
    todoCategory: '能量',
    todoKeywords: ['休息', '喝水', '拉伸'],
    skillNodeId: 'health-energy'
  }
];

export const getSkillNodeByTodo = (todoText: string, todoCategory: string): string | null => {
  const mapping = SKILL_MAPPINGS.find(mapping => {
    const categoryMatch = mapping.todoCategory === todoCategory;
    const keywordMatch = mapping.todoKeywords.some(keyword => 
      todoText.toLowerCase().includes(keyword.toLowerCase())
    );
    return categoryMatch && keywordMatch;
  });
  
  return mapping ? mapping.skillNodeId : null;
};
