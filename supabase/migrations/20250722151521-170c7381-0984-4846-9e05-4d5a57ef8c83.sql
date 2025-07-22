-- Fix security issues by setting proper search_path for SECURITY DEFINER functions

-- Update the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update the handle_new_user function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update the create_signal_notifications function
CREATE OR REPLACE FUNCTION public.create_signal_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notifications for users who have this stock in their watchlist
  INSERT INTO public.notifications (user_id, notification_type, title, message, stock_symbol, trade_signal_id)
  SELECT 
    w.user_id,
    'trade_signal'::public.notification_type,
    NEW.stock_symbol || ' ' || UPPER(NEW.signal_type::text) || ' Signal',
    'New ' || NEW.signal_name || ' signal for ' || NEW.stock_symbol || ' with ' || ROUND(NEW.confidence * 100) || '% confidence',
    NEW.stock_symbol,
    NEW.id
  FROM public.watchlists w
  WHERE w.stock_symbol = NEW.stock_symbol;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';