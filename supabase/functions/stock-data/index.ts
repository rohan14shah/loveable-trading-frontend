import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StockDataRequest {
  action: 'get_predictions' | 'add_prediction' | 'get_signals';
  stock_symbol?: string;
  prediction_data?: {
    year: number;
    predicted_sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    reasoning_summary: string;
    document_type: '10-K' | 'earnings';
    raw_analysis?: any;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { action, stock_symbol, prediction_data }: StockDataRequest = await req.json()

    switch (action) {
      case 'get_predictions':
        if (!stock_symbol) {
          return new Response(
            JSON.stringify({ error: 'stock_symbol is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        const { data: predictions, error: predError } = await supabaseClient
          .from('stock_predictions')
          .select('*')
          .eq('stock_symbol', stock_symbol.toUpperCase())
          .order('year', { ascending: false })

        if (predError) {
          return new Response(
            JSON.stringify({ error: predError.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify({ success: true, data: predictions }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )

      case 'add_prediction':
        if (!stock_symbol || !prediction_data) {
          return new Response(
            JSON.stringify({ error: 'stock_symbol and prediction_data are required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // This endpoint is for your Python script to push FinBERT analysis results
        const { data: newPrediction, error: insertError } = await supabaseClient
          .from('stock_predictions')
          .upsert({
            stock_symbol: stock_symbol.toUpperCase(),
            ...prediction_data
          })
          .select()

        if (insertError) {
          return new Response(
            JSON.stringify({ error: insertError.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify({ success: true, data: newPrediction }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )

      case 'get_signals':
        if (!stock_symbol) {
          return new Response(
            JSON.stringify({ error: 'stock_symbol is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        const { data: signals, error: signalsError } = await supabaseClient
          .from('trade_signals')
          .select('*')
          .eq('stock_symbol', stock_symbol.toUpperCase())
          .order('triggered_at', { ascending: false })
          .limit(20)

        if (signalsError) {
          return new Response(
            JSON.stringify({ error: signalsError.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify({ success: true, data: signals }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }

  } catch (error) {
    console.error('Error in stock-data function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})