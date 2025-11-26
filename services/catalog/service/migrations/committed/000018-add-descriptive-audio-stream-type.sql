--! Previous: sha1:677b5e78a2bfb199af4c633568e2c80a8aebc78b
--! Hash: sha1:6d0b59c877d4630dff8913664b37abcecfad9423
--! Message: add-descriptive-audio-stream-type

INSERT INTO app_public.video_stream_type (value, description)
VALUES ('DESCRIPTIVE_AUDIO', 'Descriptive Audio')
ON CONFLICT (value) DO NOTHING;
