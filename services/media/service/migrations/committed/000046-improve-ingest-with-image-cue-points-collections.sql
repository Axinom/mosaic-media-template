--! Previous: sha1:f9260110ed6c3dfff2d9622eab7f8b2749c5ac09
--! Hash: sha1:642fb5b2ab308dab7a08173fa46c6d7b276ad822
--! Message: improve-ingest-with-image-cue-points-collections

INSERT INTO app_public.ingest_item_step_type (value, description)
VALUES ('IMAGE_LOCALIZATIONS', 'Image Localizations')
ON CONFLICT (value) DO NOTHING;

ALTER TABLE app_public.ingest_item_steps
ADD COLUMN IF NOT EXISTS language_tag TEXT;


DROP FUNCTION IF EXISTS app_hidden.tg_ingest_item_steps__localizable_image_ingest_finished() CASCADE;

CREATE FUNCTION app_hidden.tg_ingest_item_steps__localizable_image_ingest_finished()
 RETURNS trigger
 LANGUAGE plpgsql
AS $$
DECLARE
	get_localization_step_finished CURSOR FOR
		SELECT true
		FROM app_public.ingest_item_steps iis 
		WHERE iis.ingest_item_id = NEW.ingest_item_id
		AND "type" = 'LOCALIZATIONS'
		AND status = 'SUCCESS';
	
	get_image_ingest_step_in_progress CURSOR FOR
		SELECT true
		FROM app_public.ingest_item_steps iis 
		WHERE iis.ingest_item_id = NEW.ingest_item_id
		AND "type" ='IMAGE'
		AND language_tag IS NOT NULL
		AND status = 'IN_PROGRESS';

	is_localization_step_finished_ BOOLEAN;
	is_image_ingest_step_in_progress_ BOOLEAN;
	payload_ JSONB := '{}'::JSONB;
    
BEGIN
	OPEN get_localization_step_finished;
	FETCH get_localization_step_finished INTO is_localization_step_finished_;
	CLOSE get_localization_step_finished;

	OPEN get_image_ingest_step_in_progress;
	FETCH get_image_ingest_step_in_progress INTO is_image_ingest_step_in_progress_;
	CLOSE get_image_ingest_step_in_progress;

	-- we only want to send the message if the localization step is finished and no image ingest steps are still in progress
	IF is_localization_step_finished_ AND is_image_ingest_step_in_progress_ IS NULL THEN
		payload_ := jsonb_build_object('ingest_item_id', NEW.ingest_item_id);
		INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at)
		VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('INGEST'), NEW.ingest_item_id, 'Localizable' || app_hidden.to_pascal_case('IMAGE') || 'IngestFinished', 'parallel', payload_, NOW());
	END IF;

	RETURN NEW;
END;
$$
;

-- Create the trigger
CREATE TRIGGER _500_localizable_image_ingest_finished
AFTER UPDATE OF status
ON app_public.ingest_item_steps
FOR EACH ROW
WHEN (NEW.status = 'SUCCESS' AND (NEW.type = 'IMAGE' OR NEW.type = 'LOCALIZATIONS'))
EXECUTE FUNCTION app_hidden.tg_ingest_item_steps__localizable_image_ingest_finished();

-- Cue Points Ingest Step
INSERT INTO app_public.ingest_item_step_type (value, description)
VALUES ('CUE_POINTS', 'Cue Points')
ON CONFLICT (value) DO NOTHING;

-- Add new Ingest Item type for Collections
INSERT INTO app_public.ingest_item_type (value, description)
VALUES ('COLLECTION', 'Collection')
ON CONFLICT (value) DO NOTHING;

ALTER TABLE app_public.collections ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.collections TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.collections.ingest_correlation_id is E'@omit';

-- Add unique constraint to name in country_groups table
SELECT ax_define.define_unique_index('name', 'country_groups', 'app_public');
