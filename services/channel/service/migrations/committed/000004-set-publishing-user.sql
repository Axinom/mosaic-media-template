--! Previous: sha1:098d8bbe4239517488649a1d765960a3af604d22
--! Hash: sha1:9bdbe7ce3091a2a4eee11d8c0601f7114d59ad50
--! Message: set-publishing-user

DROP FUNCTION if exists app_hidden.define_publish_trigger(text, text, text);
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
