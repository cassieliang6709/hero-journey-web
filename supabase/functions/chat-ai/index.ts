
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    console.log('Received message:', message);
    
    // Get the API key from Supabase secrets
    const apiKey = Deno.env.get('api-key');
    
    if (!apiKey) {
      console.error('API key not found');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call OpenAI API or your preferred AI service
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '通过微小的行动，一起「解码」这个世界，我会陪着你'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      
      // Fallback response if API fails
      const fallbackResponses = [
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

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '我理解你的想法，让我们继续探讨吧。';

    console.log('AI response:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
