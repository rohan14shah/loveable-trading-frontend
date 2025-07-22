import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TradeSignalRequest {
  stock_symbol: string;
  signal_type: 'buy' | 'sell';
  signal_name: string;
  confidence: number;
  price?: number;
  signal_data?: any;
  triggered_at?: string;
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

    // This endpoint is primarily for your Python trading script to push signals
    if (req.method === 'POST') {
      const signalData: TradeSignalRequest = await req.json()

      if (!signalData.stock_symbol || !signalData.signal_type || !signalData.signal_name) {
        return new Response(
          JSON.stringify({ error: 'stock_symbol, signal_type, and signal_name are required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const { data: newSignal, error: insertError } = await supabaseClient
        .from('trade_signals')
        .insert({
          stock_symbol: signalData.stock_symbol.toUpperCase(),
          signal_type: signalData.signal_type,
          signal_name: signalData.signal_name,
          confidence: signalData.confidence,
          price: signalData.price,
          signal_data: signalData.signal_data,
          triggered_at: signalData.triggered_at ? new Date(signalData.triggered_at).toISOString() : new Date().toISOString()
        })
        .select()

      if (insertError) {
        console.error('Error inserting trade signal:', insertError)
        return new Response(
          JSON.stringify({ error: insertError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Trade signal created:', newSignal[0])
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: newSignal[0],
          message: 'Trade signal created and notifications sent to relevant users'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // GET request to fetch recent signals
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const stock_symbol = url.searchParams.get('stock_symbol')
      const limit = parseInt(url.searchParams.get('limit') || '50')

      let query = supabaseClient
        .from('trade_signals')
        .select('*')
        .order('triggered_at', { ascending: false })
        .limit(limit)

      if (stock_symbol) {
        query = query.eq('stock_symbol', stock_symbol.toUpperCase())
      }

      const { data: signals, error: fetchError } = await query

      if (fetchError) {
        return new Response(
          JSON.stringify({ error: fetchError.message }),
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
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in trade-signals function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})