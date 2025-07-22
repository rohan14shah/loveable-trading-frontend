-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data integrity
CREATE TYPE sentiment_label AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE signal_type AS ENUM ('buy', 'sell');
CREATE TYPE document_type AS ENUM ('10-K', 'earnings');
CREATE TYPE notification_type AS ENUM ('trade_signal', 'price_alert', 'news_alert');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  push_notification_token TEXT,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create watchlists table for user stock tracking
CREATE TABLE public.watchlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stock_symbol TEXT NOT NULL,
  company_name TEXT,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stock_symbol)
);

-- Create stock_predictions table for FinBERT analysis results
CREATE TABLE public.stock_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_symbol TEXT NOT NULL,
  year INTEGER NOT NULL,
  predicted_sentiment sentiment_label NOT NULL,
  confidence DECIMAL(5,4) CHECK (confidence >= 0 AND confidence <= 1),
  reasoning_summary TEXT NOT NULL,
  document_type document_type NOT NULL,
  raw_analysis JSONB, -- Store additional analysis data
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(stock_symbol, year, document_type)
);

-- Create trade_signals table for technical analysis signals
CREATE TABLE public.trade_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_symbol TEXT NOT NULL,
  signal_type signal_type NOT NULL,
  signal_name TEXT NOT NULL, -- e.g., "Smart MCDX Golden Cross"
  confidence DECIMAL(5,4) CHECK (confidence >= 0 AND confidence <= 1),
  price DECIMAL(10,2),
  signal_data JSONB, -- Store technical indicators and additional signal data
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table for user alerts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  stock_symbol TEXT,
  trade_signal_id UUID REFERENCES public.trade_signals(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX idx_watchlists_stock_symbol ON public.watchlists(stock_symbol);
CREATE INDEX idx_stock_predictions_symbol_year ON public.stock_predictions(stock_symbol, year);
CREATE INDEX idx_trade_signals_symbol ON public.trade_signals(stock_symbol);
CREATE INDEX idx_trade_signals_triggered_at ON public.trade_signals(triggered_at DESC);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for watchlists
CREATE POLICY "Users can view their own watchlist" ON public.watchlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own watchlist" ON public.watchlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist" ON public.watchlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist" ON public.watchlists
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for stock_predictions (public read access for all authenticated users)
CREATE POLICY "All authenticated users can view stock predictions" ON public.stock_predictions
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for trade_signals (public read access for all authenticated users)
CREATE POLICY "All authenticated users can view trade signals" ON public.trade_signals
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to automatically create notifications for users when new trade signals are created
CREATE OR REPLACE FUNCTION public.create_signal_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notifications for users who have this stock in their watchlist
  INSERT INTO public.notifications (user_id, notification_type, title, message, stock_symbol, trade_signal_id)
  SELECT 
    w.user_id,
    'trade_signal'::notification_type,
    NEW.stock_symbol || ' ' || UPPER(NEW.signal_type::text) || ' Signal',
    'New ' || NEW.signal_name || ' signal for ' || NEW.stock_symbol || ' with ' || ROUND(NEW.confidence * 100) || '% confidence',
    NEW.stock_symbol,
    NEW.id
  FROM public.watchlists w
  WHERE w.stock_symbol = NEW.stock_symbol;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notifications when new trade signals are inserted
CREATE TRIGGER on_trade_signal_created
  AFTER INSERT ON public.trade_signals
  FOR EACH ROW EXECUTE FUNCTION public.create_signal_notifications();