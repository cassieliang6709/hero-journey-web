
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
    skillNodeId: 'psychology-1'
  },
  {
    todoCategory: '沟通',
    todoKeywords: ['沟通', '价值'],
    skillNodeId: 'psychology-2'
  },
  
  // 团队组建技能
  {
    todoCategory: '组队',
    todoKeywords: ['组队', '团队'],
    skillNodeId: 'skill-2'
  },
  {
    todoCategory: '筛选',
    todoKeywords: ['筛选', '匹配'],
    skillNodeId: 'skill-1'
  },
  
  // MVP搭建能力
  {
    todoCategory: 'MVP',
    todoKeywords: ['MVP', '范围'],
    skillNodeId: 'skill-root'
  },
  {
    todoCategory: '技术',
    todoKeywords: ['技术栈', '可行性'],
    skillNodeId: 'skill-3'
  },
  
  // 协作开发
  {
    todoCategory: '开发',
    todoKeywords: ['开发', '模块化', '汇报'],
    skillNodeId: 'skill-4'
  },
  
  // 技术路演表达
  {
    todoCategory: '路演',
    todoKeywords: ['路演', '亮点', '彩排'],
    skillNodeId: 'psychology-3'
  },
  {
    todoCategory: '演示',
    todoKeywords: ['演示', '流程'],
    skillNodeId: 'psychology-4'
  },
  
  // 应急与恢复力
  {
    todoCategory: '工具',
    todoKeywords: ['备胎', '文档', 'U盘'],
    skillNodeId: 'health-1'
  },
  {
    todoCategory: '能量',
    todoKeywords: ['休息', '喝水', '拉伸'],
    skillNodeId: 'health-2'
  }
];

export const getSkillNodeByTodo = (todoText: string, todoCategory: string): string | null => {
  const mapping = SKILL_MAPPINGS.find(mapping => {
    const categoryMatch = mapping.todoCategory === todoCategory;
    const keywordMatch = mapping.todoKeywords.some(keyword => 
      todoText.toLowerCase().includes(keyword.toLowerCase())
    );
    return categoryMatch || keywordMatch;
  });
  
  return mapping ? mapping.skillNodeId : null;
};
