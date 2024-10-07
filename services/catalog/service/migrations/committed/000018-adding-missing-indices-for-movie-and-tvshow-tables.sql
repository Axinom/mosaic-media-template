--! Previous: sha1:085f8e7247129b485177087615270bc46409011b
--! Hash: sha1:45816381484a6ffcccb3e0c15b6fe36ed12355ff
--! Message: Adding missing indices for movie and tvshow tables

-- Indices for season licenses table
SELECT ax_define.define_index('season_id', 'season_licenses', 'app_public');
SELECT ax_define.define_index('countries', 'season_licenses', 'app_public');
SELECT ax_define.define_index('start_time', 'season_licenses', 'app_public');
SELECT ax_define.define_index('end_time', 'season_licenses', 'app_public');
-- End indices for season licenses table

-- Indices for season licenses table
SELECT ax_define.define_index('episode_id', 'episode_licenses', 'app_public');
SELECT ax_define.define_index('countries', 'episode_licenses', 'app_public');
SELECT ax_define.define_index('start_time', 'episode_licenses', 'app_public');
SELECT ax_define.define_index('end_time', 'episode_licenses', 'app_public');
-- End indices for season licenses table

---
