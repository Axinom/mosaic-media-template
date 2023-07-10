--! Previous: sha1:66a3704e0515a63889b50a53166b99fc6e10e458
--! Hash: sha1:c9457b917399b9a43ac0fc04d0e130cf728bfcb7
--! Message: channel-id-values-updated

DO $$ BEGIN
  IF EXISTS(SELECT constraint_name FROM information_schema.constraint_column_usage 
    WHERE table_schema='app_public' AND table_name='channel' AND constraint_name ='channel_images_channel_id_fkey')
  THEN
    ALTER TABLE app_public.channel_images DROP CONSTRAINT channel_images_channel_id_fkey;
  END IF;
END $$;

UPDATE app_public.channel 
  SET id = 'channel-' || id 
  WHERE id NOT ILIKE 'channel-%';

UPDATE app_public.channel_images
  SET channel_id = 'channel-' || channel_id 
  WHERE channel_id NOT ILIKE 'channel-%';

DO $$ BEGIN
  IF NOT EXISTS(SELECT constraint_name FROM information_schema.constraint_column_usage 
    WHERE table_schema='app_public' AND table_name='channel' AND constraint_name ='channel_images_channel_id_fkey')
  THEN
    ALTER TABLE app_public.channel_images 
      ADD CONSTRAINT channel_images_channel_id_fkey 
      FOREIGN KEY (channel_id) REFERENCES app_public.channel(id) 
      ON DELETE CASCADE;
  END IF;
END $$;
