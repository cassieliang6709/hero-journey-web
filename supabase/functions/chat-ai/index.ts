
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, send_message } = await req.json();
    
    console.log('Edge Function 收到请求:', { user_id, send_message });
    
    // 调用你的后端API
    const response = await fetch('http://47.96.231.221:5001/AgentChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        send_message
      })
    });

    console.log('后端API响应状态:', response.status);
    
    if (!response.ok) {
      throw new Error(`后端API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('后端API响应数据:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge Function错误:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        text: '抱歉，AI服务暂时不可用，但我仍然在这里陪伴你。'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
