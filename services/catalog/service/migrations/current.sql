--! Message: add-descriptive-audio-stream-type

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM app_public.video_stream_type 
    WHERE value = 'DESCRIPTIVE_AUDIO'
  ) THEN
    INSERT INTO app_public.video_stream_type (value, description)
    VALUES ('DESCRIPTIVE_AUDIO', 'Descriptive Audio');
  END IF;
END $$;
