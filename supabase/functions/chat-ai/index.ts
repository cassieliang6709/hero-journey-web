
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, user_id } = await req.json();
    
    console.log('Received message:', message, 'from user:', user_id);
    
    // Call the correct external API endpoint
    const response = await fetch('http://47.96.231.221:5001/AgentChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        send_message: message
      })
    });

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.text || '我理解你的想法，让我们继续探讨吧。';

    console.log('External API response:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    
    // Fallback response
    const fallbackResponses = [
      "这是一个很好的想法！让我们深入探讨一下。",
      "我理解你的感受。这种情况下，你觉得什么行动最有帮助？",
      "很棒！你已经迈出了重要的一步。继续保持这种积极的态度。",
      "让我们一起制定一个可行的计划来解决这个问题。",
      "你的成长意识很强！这正是英雄品质的体现。"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return new Response(
      JSON.stringify({ response: randomResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
