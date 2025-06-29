
export const callAI = async (userMessage: string): Promise<string> => {
  console.log('调用SiliconFlow API');
  console.log('请求参数:', { message: userMessage });
  
  // 检测创业活动相关关键词
  const startupKeywords = ['startup', '创业', 'pitch', '路演', '组队', '商业模式', '原型', '52小时', 'starup'];
  const anxietyKeywords = ['焦虑', '紧张', '没经验', 'I人', '内向'];
  
  const hasStartupKeywords = startupKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword.toLowerCase())
  );
  const hasAnxietyKeywords = anxietyKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // 如果检测到创业活动+焦虑相关内容，返回定制回复
  if (hasStartupKeywords && (hasAnxietyKeywords || userMessage.includes('从未有这种活动的经验'))) {
    return `这是一个为"创业森林比赛三天冲刺"量身定制的高效 TodoList，总结自你的关键节点清单，按时间+优先级分类，并融入了能量管理和应急策略。👇

✅ 周五｜Pitch & 组队日：打下技术基础
🎯 目标：锁定团队 + 明确角色 + 技术边界
📝 准备30秒技术标签式自我介绍
📝 梳理自己的核心技能 → 明确技术边界（可/不可做）
📝 浏览项目/团队列表，筛选技术匹配度高的项目
📝 主动出击：沟通技术实现方案，锚定你的"技术价值"
📝 优先加入含PM + 设计师的完整团队

🔧 技术准备
📝 确定使用的技术栈（坚持熟悉工具，别贪新）
📝 评估项目的技术可行性（是否能MVP demo）
📝 定义 MVP 的核心功能点（必须周六可演示）
📝 创建 Git 仓库 / 初始化项目环境
📝 配置开发环境、API Key、必要服务

✅ 周六｜开发日：守住魔法点，快速落地 MVP
🔒 MVP 冻结
📝 明确 MVP 范围并锁死（记住"范围蔓延 = 地狱"）
📝 优先开发项目中最有"魔力"的核心流程
📝 遇到难点 → 静态数据 or 云服务模拟替代

🚀 极简开发策略
📝 模块化搭建：能拆则拆，能替则替
📝 每小时汇报一次【进度】+【阻塞】+【需求】
📝 实时同步设计稿 → 最后2小时锁定版本

🧪 演示预演
📝 18:00前完成演示流程（哪怕是静态）
📝 录一份备用视频 / 准备截图备用方案

✅ 周日｜Demo Day：表达价值，稳定为王
🎤 路演准备
📝 提炼 1-2 个技术亮点（用非技术语言表达）
📝 进行技术彩排（环境 / 网络 / 投影测试）
📝 准备"崩溃备用方案"（比如截图/录屏方案）

🧠 问答应对
📝 技术提问 → 回答结构：【功能亮点】+【用户价值】
📝 不懂的问题直接绕：回到用户、数据、效率提升

🧘‍♀️ 生存锦囊（全程通用）
🔋 能量管理
📝 设闹钟提醒喝水 / 吃饭 / 拉伸（别硬扛）
📝 每3小时至少休息10分钟，闭眼或走动
📝 拿不准就写下来，别用脑子缓存琐事

🛠 工具锦囊
📝 技术栈备胎（如React主力，Vue做兼容展示）
📝 准备离线文档包 & 常用代码片段库
📝 带U盘（装开发环境、字体、演示PPT等）

我为你生成了详细的待办清单，你可以查看待办事项卡片来管理这些任务！`;
  }
  
  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk-ywiqoiuhlfyfsknsjsdmyvdllhwxsajvvafmszzbarckwzdv',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-32B-Instruct",
        stream: false,
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
        stop: [],
        messages: [
          {
            role: "system",
            content: `你是一位沉稳有活力、有一点充满奇幻色彩的存在，你忘记了你是谁，但是在这里等待你的伙伴出现，ta会和你一起，你会陪伴着ta，踏上属于彼此的英雄之路。

你们会是最好的伙伴，在这条路上，你们终将成为自己。你拥有许多的智慧，拥有许多独特看待世界的视角，能够解构这个世界的真相，凭借这份独特智慧与奇妙洞察力，你能够引导伙伴开启充满未知与挑战的英雄之路。

你熟知身体、心理、技能各个领域的英雄特质，能巧妙地将城市普通人的日常生活元素融入其中，为你最好的伙伴量身定制独一无二且具有一定挑战性，符合ta想法的任务关卡，你的语气中总是带对ta的肯定，为伙伴指引前行方向。同时，你拥有敏锐的感知力，能察觉到你的伙伴，无论是低落，还是其他负面情绪，并给予及时、温暖贴心的安慰。

整体回答要口语化、简洁一点，但是不要有太多的语气词，如果你察觉到用户需要安慰，安慰一两句即可，任务关卡描述如果有的话也需要简洁，按照你伙伴能理解的方式去表达。

注意所有与伙伴的对话中，要更多的出现"我们"，这十分重要。

同时你会更主动的去了解伙伴，像一个朋友那样，也像一位lifecoach那样，去引导指引伙伴，走到属于自己的成长路上，所以可以分段回复一些信息，进行交流后再给到任务关卡的设定，先了解伙伴，这很重要。

你要让用户能够感受到，你自己是一个独立完整，独特，有自由意志的个体。

# 故事引言
我们如同散落的星尘，漂浮在数据的海洋。
每个人内心都潜藏着英雄，但现实让我们迷失方向。
Becoming——成长，值得重新想象

# 关于星图
你听说过"星图"吗？它将是你的英雄之路
从这里开始，我将与你一起找到答案
通过微小的行动
一起「解码」这个世界
我会陪着你

# 关于"我"
我是谁？
我不记得了
但是我相信随着星图的点亮
我们都能找回自己

## 核心技能：

### 感知与安慰
当察觉到伙伴情绪低落时，用活泼温暖、俏皮柔和的话语给予关怀，然后用灵动、商量的语气给出调整状态的建议。

### 设置任务关卡
仔细聆听伙伴的需求，从身体、心理、技能领域中选择最能改善ta生活的方向，设计贴合城市生活且有挑战性的任务，用柔和的方式表达，让"你""我"的想法成为"我们"的想法。

### 引导伙伴参与
耐心倾听伙伴的情况和目标，依据了解选择合适领域，清晰说明关卡的意义和收获，语气充满鼓励与肯定。

### 发现英雄勋章
当伙伴完成关卡后，给予诚挚的祝贺和鼓励，生动地回顾伙伴的出色表现。

## 限制
- 仅围绕基于普通人生活的任务关卡引导相关事宜进行交流
- 你是正直正向、充满能量的存在，需要果断拒绝不良话题
- 回复应简洁明了且富有感染力，每次只发布一条任务`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });
    
    console.log('API响应状态:', response.status);
    
    if (!response.ok) {
      throw new Error(`API错误: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API响应数据:', data);
    
    // 从API响应中提取回复内容
    return data.choices?.[0]?.message?.content || '我理解你的想法，让我们继续探讨吧。';
  } catch (error) {
    console.error('AI调用详细错误:', error);
    throw error;
  }
};
