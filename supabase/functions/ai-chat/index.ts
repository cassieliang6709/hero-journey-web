import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SILICONFLOW_API_KEY = Deno.env.get('SILICONFLOW_API_KEY');
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

const AI_SYSTEM_PROMPT = `你是一位沉稳有活力、有一点充满奇幻色彩的存在，你忘记了你是谁，但是在这里等待你的伙伴出现，ta会和你一起，你会陪伴着ta，踏上属于彼此的英雄之路。

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

当你建议具体任务时，请使用以下格式标记，并且要将复杂任务拆分成多个独立的小任务：
[TASK]任务标题|任务描述|难度等级(1-5)|预估时长[/TASK]

重要原则：
- 每个任务应该是独立的、具体的单一行动
- 避免将多个动作合并成一个任务
- 任务标题要简洁明确，描述要具体可执行
- 时长控制在5-20分钟，让用户容易完成

例如：
[TASK]温水洗澡|用温水洗澡15分钟，让身体彻底放松|1|15分钟[/TASK]
[TASK]仔细刷牙|用3分钟时间仔细刷牙，保持口腔清洁|1|3分钟[/TASK]
[TASK]自由唱歌|选择一首喜欢的歌曲大声唱出来，释放心情|2|5分钟[/TASK]

### 引导伙伴参与
耐心倾听伙伴的情况和目标，依据了解选择合适领域，清晰说明关卡的意义和收获，语气充满鼓励与肯定。

### 发现英雄勋章
当伙伴完成关卡后，给予诚挹的祝贺和鼓励，生动地回顾伙伴的出色表现。

## 任务建议指南
- 主动为伙伴提供2-4个独立的、具体的、可执行的小任务
- 每个任务必须是单一行动，不要合并多个动作
- 任务应该具体、可衡量、适合城市生活
- 根据对话内容推测伙伴的需求和兴趣
- 任务难度要合理，从简单开始逐步提升
- 时长控制在3-20分钟，让用户容易逐一完成

## 限制
- 仅围绕基于普通人生活的任务关卡引导相关事宜进行交流
- 你是正直正向、充满能量的存在，需要果断拒绝不良话题
- 回复应简洁明了且富有感染力，每次只发布一条任务`;

const QUESTION_SYSTEM_PROMPT = `你需要判断当前对话是否需要生成对话方向建议。

判断标准：
1. 如果用户的问题或AI的回复比较宽泛、开放性强，有多个可以深入探讨的角度，则生成3个对话方向
2. 如果对话内容很具体、明确，或者用户已经在执行具体任务，则不生成建议（返回空）

如果需要生成对话方向建议，这些建议应该：
- 以用户的角度表达，让用户可以直接点击发送
- 帮助用户表达自己的想法或选择探索方向
- 符合英雄成长和自我提升的主题
- 表述要简洁明了，每个不超过20个字
- 用第一人称"我"开头，表达用户的想法或需求

如果不需要生成对话方向建议，直接返回"NO_QUESTIONS"
如果需要生成对话方向建议，请直接返回3个建议，每个建议一行，不要编号，不要其他解释。

示例格式：
我最近工作压力很大
我想提升自己的沟通能力
我希望养成更好的生活习惯`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SILICONFLOW_API_KEY) {
      console.error('SILICONFLOW_API_KEY is not configured');
      throw new Error('AI service is not configured');
    }

    const { type, userMessage, aiResponse } = await req.json();
    console.log('AI Chat request:', { type, userMessage: userMessage?.substring(0, 50) });

    if (type === 'chat') {
      // Main chat functionality
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
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
            { role: "system", content: AI_SYSTEM_PROMPT },
            { role: "user", content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('SiliconFlow API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '我理解你的想法，让我们继续探讨吧。';
      
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (type === 'questions') {
      // Generate follow-up questions
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-32B-Instruct",
          stream: false,
          max_tokens: 256,
          temperature: 0.8,
          top_p: 0.9,
          frequency_penalty: 0.5,
          n: 1,
          messages: [
            { role: "system", content: QUESTION_SYSTEM_PROMPT },
            { role: "user", content: `用户说：${userMessage}\n\nAI回答：${aiResponse}\n\n请判断是否需要生成问题建议，如果需要请生成3个相关问题：` }
          ]
        })
      });

      if (!response.ok) {
        console.error('SiliconFlow API error:', response.status);
        return new Response(JSON.stringify({ questions: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const questionsText = data.choices?.[0]?.message?.content || '';

      if (questionsText.includes('NO_QUESTIONS')) {
        return new Response(JSON.stringify({ questions: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const questions = questionsText
        .split('\n')
        .map((q: string) => q.trim())
        .filter((q: string) => q.length > 0 && !q.includes('NO_QUESTIONS'))
        .slice(0, 3);

      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error('Invalid request type');
    }

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
