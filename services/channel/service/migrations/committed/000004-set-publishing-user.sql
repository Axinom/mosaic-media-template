--! Previous: sha1:098d8bbe4239517488649a1d765960a3af604d22
--! Hash: sha1:52abbb9213fd3185b16dbeeac849074c5fe06a07
--! Message: set-publishing-user

-- creation method to create publish audit field triggers
CREATE OR REPLACE FUNCTION app_hidden.define_publish_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP TRIGGER IF EXISTS _900__publish_user ON ' || schemaName || '.' || tableName || ';';
  EXECUTE 'CREATE trigger _900__publish_user BEFORE INSERT OR UPDATE ON ' || schemaName || '.' || tableName ||
          ' FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__publish_audit_fields();';
END;
$$;

SELECT app_hidden.define_publish_trigger('channels', 'app_public');
SELECT app_hidden.define_publish_trigger('playlists', 'app_public');
