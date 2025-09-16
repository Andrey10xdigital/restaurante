-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  cuisine_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('want_to_go', 'been_there')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on restaurants
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Restaurants policies
CREATE POLICY "restaurants_select_own" ON public.restaurants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "restaurants_insert_own" ON public.restaurants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "restaurants_update_own" ON public.restaurants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "restaurants_delete_own" ON public.restaurants FOR DELETE USING (auth.uid() = user_id);

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#84cc16',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tags
INSERT INTO public.tags (name, color) VALUES 
  ('Favorito', '#15803d'),
  ('Não volto', '#ef4444'),
  ('Lugar bonito', '#8b5cf6'),
  ('Saboroso', '#f59e0b')
ON CONFLICT (name) DO NOTHING;

-- Create restaurant_tags junction table
CREATE TABLE IF NOT EXISTS public.restaurant_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, tag_id)
);

-- Enable RLS on restaurant_tags
ALTER TABLE public.restaurant_tags ENABLE ROW LEVEL SECURITY;

-- Restaurant tags policies
CREATE POLICY "restaurant_tags_select_own" ON public.restaurant_tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "restaurant_tags_insert_own" ON public.restaurant_tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "restaurant_tags_delete_own" ON public.restaurant_tags FOR DELETE USING (auth.uid() = user_id);

-- Create dishes table for restaurants that have been visited
CREATE TABLE IF NOT EXISTS public.dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  photo_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on dishes
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- Dishes policies
CREATE POLICY "dishes_select_own" ON public.dishes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "dishes_insert_own" ON public.dishes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dishes_update_own" ON public.dishes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "dishes_delete_own" ON public.dishes FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'display_name', 'Usuário')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dishes_updated_at
  BEFORE UPDATE ON public.dishes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
