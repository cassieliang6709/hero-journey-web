-- Add unique constraint for upsert functionality
ALTER TABLE public.star_map_progress 
ADD CONSTRAINT star_map_progress_user_node_unique UNIQUE (user_id, node_id);