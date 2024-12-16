--! Previous: sha1:f976448088c61d3d058d2eb1c4a0894a14da7aa5
--! Hash: sha1:76e25599a3e3552fe1e0d9eb4228060175dde1ef
--! Message: add-referential-integrity

-- remove-sort-order-from-age-ratings-table
ALTER TABLE app_public.age_ratings DROP COLUMN IF EXISTS sort_order;
GRANT SELECT, DELETE ON app_public.age_ratings TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  name
) ON app_public.age_ratings TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  name
) ON app_public.age_ratings TO ":DATABASE_GQL_ROLE";

-- add-referential-integrity-to-age-rating-in-movies-tv-shows-seasons-and-episodes
ALTER TABLE app_public.movies DROP CONSTRAINT IF EXISTS movies_age_rating_fkey;
ALTER TABLE app_public.movies ADD CONSTRAINT movies_age_rating_fkey FOREIGN KEY (age_rating) REFERENCES app_public.age_ratings(name);

ALTER TABLE app_public.tvshows DROP CONSTRAINT IF EXISTS tvshows_age_rating_fkey;
ALTER TABLE app_public.tvshows ADD CONSTRAINT tvshows_age_rating_fkey FOREIGN KEY (age_rating) REFERENCES app_public.age_ratings(name);

ALTER TABLE app_public.seasons DROP CONSTRAINT IF EXISTS seasons_age_rating_fkey;
ALTER TABLE app_public.seasons ADD CONSTRAINT seasons_age_rating_fkey FOREIGN KEY (age_rating) REFERENCES app_public.age_ratings(name);

ALTER TABLE app_public.episodes DROP CONSTRAINT IF EXISTS episodes_age_rating_fkey;
ALTER TABLE app_public.episodes ADD CONSTRAINT episodes_age_rating_fkey FOREIGN KEY (age_rating) REFERENCES app_public.age_ratings(name);


-- remove-sort-order-from-content-owners-table
ALTER TABLE app_public.content_owners DROP COLUMN IF EXISTS sort_order;
GRANT SELECT, DELETE ON app_public.content_owners TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  name
) ON app_public.content_owners TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  name
) ON app_public.content_owners TO ":DATABASE_GQL_ROLE";

-- add-referential-integrity-to-content-owner-in-movies-tv-shows-seasons-and-episodes
ALTER TABLE app_public.movies DROP CONSTRAINT IF EXISTS movies_content_owner_fkey;
ALTER TABLE app_public.movies ADD CONSTRAINT movies_content_owner_fkey FOREIGN KEY (content_owner) REFERENCES app_public.content_owners(name);

ALTER TABLE app_public.tvshows DROP CONSTRAINT IF EXISTS tvshows_content_owner_fkey;
ALTER TABLE app_public.tvshows ADD CONSTRAINT tvshows_content_owner_fkey FOREIGN KEY (content_owner) REFERENCES app_public.content_owners(name);

ALTER TABLE app_public.seasons DROP CONSTRAINT IF EXISTS seasons_content_owner_fkey;
ALTER TABLE app_public.seasons ADD CONSTRAINT seasons_content_owner_fkey FOREIGN KEY (content_owner) REFERENCES app_public.content_owners(name);

ALTER TABLE app_public.episodes DROP CONSTRAINT IF EXISTS episodes_content_owner_fkey;
ALTER TABLE app_public.episodes ADD CONSTRAINT episodes_content_owner_fkey FOREIGN KEY (content_owner) REFERENCES app_public.content_owners(name);
