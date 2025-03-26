--! Previous: sha1:1be209b7ec2d8619088c4c6f087a53ffb1532d64
--! Hash: sha1:4925cd1d33a61ad862288246b71c983e62450432
--! Message: reviews-snapshots-added

-- Reviews
ALTER TABLE app_public.reviews DROP COLUMN IF EXISTS publish_status;
SELECT ax_define.set_enum_as_column_type('publish_status', 'reviews', 'app_public', 'publish_status', 'app_public', 'NOT_PUBLISHED');
SELECT ax_define.set_enum_domain('publish_status', 'reviews', 'app_public', 'publish_status_enum', 'app_public');

ALTER TABLE app_public.reviews ADD COLUMN IF NOT EXISTS published_date TIMESTAMPTZ;
ALTER TABLE app_public.reviews ADD COLUMN IF NOT EXISTS published_user TEXT;
GRANT UPDATE (publish_status) ON app_public.reviews TO ":DATABASE_GQL_ROLE";
SELECT ax_define.define_index('publish_status', 'reviews', 'app_public');


-- Snapshots
DROP TABLE IF EXISTS app_public.reviews_snapshots CASCADE;
CREATE TABLE app_public.reviews_snapshots (
  review_id int REFERENCES app_public.reviews ON DELETE CASCADE,
  snapshot_id int REFERENCES app_public.snapshots ON DELETE CASCADE,
  UNIQUE(review_id, snapshot_id),
  PRIMARY KEY(review_id, snapshot_id)
);
GRANT INSERT, UPDATE (review_id, snapshot_id) ON app_public.reviews_snapshots TO ":DATABASE_GQL_ROLE";
GRANT SELECT, DELETE ON app_public.reviews_snapshots TO ":DATABASE_GQL_ROLE";

DROP TRIGGER IF EXISTS tg_cleanup_orphaned_review_snapshots ON reviews_snapshots;
CREATE TRIGGER tg_cleanup_orphaned_review_snapshots
AFTER DELETE ON reviews_snapshots
FOR EACH ROW EXECUTE PROCEDURE remove_orphaned_snapshot();

INSERT INTO app_public.entity_type (value, description)
VALUES ('REVIEW', 'Review')
ON CONFLICT (value) DO NOTHING;

SELECT app_hidden.create_active_snapshots_before_delete_trigger('reviews', 'reviews_snapshots', 'review_id', 'Review');
SELECT app_hidden.create_propagate_publish_state_trigger('reviews', 'REVIEW');
SELECT ax_define.define_authentication('REVIEWS_VIEW,REVIEWS_EDIT,ADMIN', 'REVIEWS_EDIT,ADMIN', 'reviews_snapshots', 'app_public');

SELECT app_hidden.define_snapshot_authentication(
  'MOVIE',
  'REVIEWS_VIEW,REVIEWS_EDIT,MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'MOVIES_VIEW,MOVIES_EDIT,ADMIN', 
  'MOVIES_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'TVSHOW',
  'REVIEWS_VIEW,REVIEWS_EDIT,MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 
  'TVSHOWS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'SEASON',
  'REVIEWS_VIEW,REVIEWS_EDIT,MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 
  'TVSHOWS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'EPISODE',
  'REVIEWS_VIEW,REVIEWS_EDIT,MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 
  'TVSHOWS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'MOVIE_GENRE',
  'REVIEWS_VIEW,REVIEWS_EDIT,MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 
  'SETTINGS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'TVSHOW_GENRE',
  'REVIEWS_VIEW,REVIEWS_EDIT,MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 
  'SETTINGS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'COLLECTION',
  'REVIEWS_VIEW,REVIEWS_EDIT,MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 
  'COLLECTIONS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'REVIEW',
  'REVIEWS_VIEW,REVIEWS_EDIT,MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'REVIEWS_VIEW,REVIEWS_EDIT,ADMIN', 
  'REVIEWS_EDIT,ADMIN');
