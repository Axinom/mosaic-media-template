--
-- PostgreSQL database dump
--

-- Dumped from database version 11.12
-- Dumped by pg_dump version 11.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app_hidden; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_hidden;


--
-- Name: app_private; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_private;


--
-- Name: app_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_public;


--
-- Name: ax_define; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA ax_define;


--
-- Name: ax_utils; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA ax_utils;


--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA postgraphile_watch;


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: constraint_has_allowed_value(text, text[], text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_has_allowed_value(input_value text, allowed_values text[], error_message text DEFAULT 'The value "%s" is not in the list of allowed values ("%s").'::text, error_code text DEFAULT 'ALWDV'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if input_value = ANY(allowed_values) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code, input_value, array_to_string(allowed_values, '", "'));
end;
$$;


--
-- Name: constraint_is_base64(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_is_base64(input_value text, error_message text DEFAULT 'The property must be a Base64 encoded value.'::text, error_code text DEFAULT 'BAS64'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_is_base64(input_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code);
end;
$$;


--
-- Name: constraint_is_identifier_key(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_is_identifier_key(input_value text, error_message text DEFAULT 'The property must only contain letters, numbers, underscores, and dashes.'::text, error_code text DEFAULT 'IDKEY'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_is_identifier_key(input_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code);
end;
$$;


--
-- Name: constraint_is_trimmed(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_is_trimmed(input_value text, error_message text DEFAULT 'The property value must not start or end with whitespace characters.'::text, error_code text DEFAULT 'NTRIM'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_is_trimmed(input_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code);
end;
$$;


--
-- Name: constraint_is_url(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_is_url(input_value text, error_message text DEFAULT 'The property must be a valid URL.'::text, error_code text DEFAULT 'NVURL'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF ax_utils.validation_is_optional_url(input_value) THEN
    RETURN true;
  END IF;
  perform ax_utils.raise_error(error_message, error_code);
END;
$$;


--
-- Name: constraint_matches_pattern(text, text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_matches_pattern(input_value text, pattern text, error_message text DEFAULT 'The value "%s" does not match the pattern "%s".'::text, error_code text DEFAULT 'PATRN'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF input_value !~* pattern THEN
      perform ax_utils.raise_error(error_message, error_code, input_value, pattern);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_max_length(text, integer, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_max_length(input_value text, max_length integer, error_message text DEFAULT 'The value "%s" is too long. It must be a maximum of %s characters long.'::text, error_code text DEFAULT 'MXLEN'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF length(input_value) > max_length THEN
      perform ax_utils.raise_error(error_message, error_code, input_value, max_length::text);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_max_value(numeric, numeric, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_max_value(input_value numeric, max_value numeric, error_message text DEFAULT 'The value "%s" is too big. The maximum is %s.'::text, error_code text DEFAULT 'MXVAL'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF input_value > max_value THEN
      perform ax_utils.raise_error(error_message, error_code, input_value::text, max_value::text);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_min_length(text, integer, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_min_length(input_value text, min_length integer, error_message text DEFAULT 'The value "%s" is not long enough. It must be at least %s characters long.'::text, error_code text DEFAULT 'MNLEN'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF length(input_value) < min_length THEN
  	perform ax_utils.raise_error(error_message, error_code, input_value, min_length::text);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_min_value(numeric, numeric, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_min_value(input_value numeric, min_value numeric, error_message text DEFAULT 'The value "%s" is too small. The minimum is %s.'::text, error_code text DEFAULT 'MNVAL'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF input_value < min_value THEN
  	perform ax_utils.raise_error(error_message, error_code, input_value::text, min_value::text);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_not_default_uuid(uuid, uuid, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_not_default_uuid(input_value uuid, default_uuid uuid DEFAULT 'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid, error_message text DEFAULT 'A valid UUID must be provided - the value "%s" is not valid.'::text, error_code text DEFAULT 'UUID0'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if input_value IS NULL OR input_value = default_uuid then
    perform ax_utils.raise_error(error_message, error_code, input_value::text);
  end if;
  return true;
end;
$$;


--
-- Name: constraint_not_empty(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_not_empty(input_value text, error_message text DEFAULT 'The property value must not be empty.'::text, error_code text DEFAULT 'EMPTY'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_not_empty(input_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code);
end;
$$;


--
-- Name: constraint_not_empty_array(text[], text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_not_empty_array(input_value text[], error_message text DEFAULT 'The property must not be an empty array or contain empty/whitespace elements.'::text, error_code text DEFAULT 'EMPTY'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF ax_utils.validation_not_empty_array(input_value) THEN
    RETURN true;
  END IF;
  perform ax_utils.raise_error(error_message, error_code);
END;
$$;


--
-- Name: constraint_starts_with(text, text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_starts_with(input_value text, prefix_value text, error_message text DEFAULT 'The property must start with "%2$s".'::text, error_code text DEFAULT 'STRWT'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_starts_with(input_value, prefix_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code, input_value, prefix_value::text);
end;
$$;


--
-- Name: current_environment_id(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.current_environment_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT coalesce(nullif(current_setting('mosaic.environment_id', TRUE), ''), 'ffffffff-ffff-ffff-ffff-ffffffffffff')::UUID;
$$;


--
-- Name: current_tenant_id(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.current_tenant_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT coalesce(nullif(current_setting('mosaic.tenant_id', TRUE), ''), 'ffffffff-ffff-ffff-ffff-ffffffffffff')::UUID;
$$;


--
-- Name: current_user_id(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.current_user_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT coalesce(nullif(current_setting('mosaic.auth.user_id', TRUE), ''), uuid_nil()::TEXT)::UUID;
$$;


--
-- Name: raise_error(text, text, text[]); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.raise_error(error_message text, error_code text, VARIADIC placeholder_values text[] DEFAULT '{}'::text[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  RAISE EXCEPTION '%', format(error_message, VARIADIC placeholder_values) using errcode = error_code;
END;
$$;


--
-- Name: tg__graphql_subscription(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__graphql_subscription() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  v_process_new bool = (TG_OP = 'INSERT' OR TG_OP = 'UPDATE');
  v_process_old bool = (TG_OP = 'UPDATE' OR TG_OP = 'DELETE');
  v_event text = TG_ARGV[0];
  v_topic_template text = TG_ARGV[1];
  v_attribute text = TG_ARGV[2];
  v_record record;
  v_sub text;
  v_topic text;
  v_i int = 0;
  v_last_topic text;
BEGIN
  FOR v_i IN 0..1 LOOP
    IF (v_i = 0) AND v_process_new IS TRUE THEN
      v_record = new;
    ELSIF (v_i = 1) AND v_process_old IS TRUE THEN
      v_record = old;
    ELSE
      CONTINUE;
    END IF;
    IF v_attribute IS NOT NULL THEN
      EXECUTE 'select $1.' || quote_ident(v_attribute)
        USING v_record
        INTO  v_sub;
    END IF;
    IF v_sub IS NOT NULL THEN
      v_topic = replace(v_topic_template, '$1', v_sub);
    ELSE
      v_topic = v_topic_template;
    END IF;
    IF v_topic IS DISTINCT FROM v_last_topic THEN
      -- This if statement prevents us from triggering the same notification twice
      v_last_topic = v_topic; 
      perform pg_notify(v_topic, json_build_object(
        'event', v_event,
        'subject', v_sub
      )::text);
    END IF;
  END LOOP;
  RETURN v_record;
END;
$_$;


--
-- Name: FUNCTION tg__graphql_subscription(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__graphql_subscription() IS 'This function enables the creation of simple focussed GraphQL subscriptions using database triggers. Read more here: https://www.graphile.org/postgraphile/subscriptions/#custom-subscriptions';


--
-- Name: tg__tenant_environment(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__tenant_environment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	tenant_id text = current_setting('mosaic.tenant_id', TRUE);
  environment_id text = current_setting('mosaic.environment_id', TRUE);
  is_superuser text = current_setting('is_superuser', TRUE);
  ignore_multitenancy text = current_setting('mosaic.ignore_multitenancy', TRUE);
BEGIN
  IF tenant_id <> '' THEN   -- Not null and not empty
    IF NEW.tenant_id::TEXT <> 'ffffffff-ffff-ffff-ffff-ffffffffffff' AND NEW.tenant_id::TEXT <> tenant_id THEN
      perform ax_utils.raise_error('The "mosaic.tenant_id" set via set_config must match the updated/inserted row.', 'TENAN');
    END IF;
    NEW.tenant_id = tenant_id;
  ELSIF is_superuser <> 'on' AND ignore_multitenancy <> 'on' THEN
    perform ax_utils.raise_error('The "mosaic.tenant_id" must be set via set_config value.', 'TENAN');
  END IF;
  IF environment_id <> '' THEN   -- Not null and not empty
    IF NEW.environment_id::TEXT <> 'ffffffff-ffff-ffff-ffff-ffffffffffff' AND NEW.environment_id::TEXT <> environment_id THEN
      perform ax_utils.raise_error('The "mosaic.environment_id" set via set_config must match the updated/inserted row.', 'ENVVV');
    END IF;
    NEW.environment_id = environment_id;
  ELSIF is_superuser <> 'on' AND ignore_multitenancy <> 'on' THEN
    perform ax_utils.raise_error('The "mosaic.environment_id" must be set via set_config value.', 'ENVVV');
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: FUNCTION tg__tenant_environment(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__tenant_environment() IS 'This trigger should be called on tables needing automatic tenant_id, environment_id - to support multi-tenancy';


--
-- Name: tg__tenant_environment_on_delete(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__tenant_environment_on_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	tenant_id text = current_setting('mosaic.tenant_id', TRUE);
  environment_id text = current_setting('mosaic.environment_id', TRUE);
  is_superuser text = current_setting('is_superuser', TRUE);
  ignore_multitenancy text = current_setting('mosaic.ignore_multitenancy', TRUE);
BEGIN
  IF tenant_id <> '' THEN   -- Not null and not empty
    IF OLD.tenant_id::TEXT <> tenant_id THEN
      perform ax_utils.raise_error('The "mosaic.tenant_id" set via set_config must match the deleted row.', 'TENAN');
    END IF;
  ELSIF is_superuser <> 'on' AND ignore_multitenancy <> 'on' THEN
    perform ax_utils.raise_error('The "mosaic.tenant_id" must be set via set_config value.', 'TENAN');
  END IF;
  IF environment_id <> '' THEN   -- Not null and not empty
    IF OLD.environment_id::TEXT <> environment_id THEN
      perform ax_utils.raise_error('The "mosaic.environment_id" set via set_config must match the deleted row.', 'ENVVV');
    END IF;
  ELSIF is_superuser <> 'on' AND ignore_multitenancy <> 'on' THEN
    perform ax_utils.raise_error('The "mosaic.environment_id" must be set via set_config value.', 'ENVVV');
  END IF;
  RETURN OLD;
END;
$$;


--
-- Name: FUNCTION tg__tenant_environment_on_delete(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__tenant_environment_on_delete() IS 'This trigger should be called on tables needing automatic tenant_id, environment_id - to support multi-tenancy';


--
-- Name: tg__timestamps(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__timestamps() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
BEGIN
  NEW.created_date = (CASE WHEN TG_OP = 'INSERT' THEN (now() at time zone 'utc') ELSE OLD.created_date END);
  NEW.updated_date = (CASE WHEN TG_OP = 'UPDATE' AND OLD.updated_date  >= (now() at time zone 'utc') THEN OLD.updated_date  + interval '1 millisecond' ELSE (now() at time zone 'utc') END);
  RETURN NEW;
END;
$$;


--
-- Name: FUNCTION tg__timestamps(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__timestamps() IS 'This trigger should be called on all tables with created_date , updated_date  - it ensures that they cannot be manipulated and that updated_date  will always be larger than the previous updated_date .';


--
-- Name: tg__user_id(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__user_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  user_id_ text = current_setting('mosaic.auth.user_id', TRUE);
BEGIN
  IF user_id_ <> '' AND user_id_ <> uuid_nil()::TEXT THEN -- NOT NULL AND NOT DEFAULT
    NEW.user_id = user_id_;
  ELSEIF NEW.user_id IS NULL THEN
    perform ax_utils.raise_error('The "mosaic.auth.user_id" must be set via set_config value.', 'USRID');
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: FUNCTION tg__user_id(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__user_id() IS 'This trigger should be called on tables needing automatic user_id.';


--
-- Name: tg__username(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__username() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
DECLARE
	username text = pg_catalog.current_setting('mosaic.auth.subject_name', true);
BEGIN
  if username IS NULL OR username::char(5) = ''::char(5) then
  	RETURN NEW;
  end if;
  
  NEW.created_user = (CASE WHEN TG_OP = 'INSERT' THEN username ELSE OLD.created_user END);
  NEW.updated_user = (CASE WHEN TG_OP = 'UPDATE' OR TG_OP = 'INSERT' THEN username ELSE OLD.updated_user END);
  RETURN NEW;
END;
$$;


--
-- Name: user_has_permission(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.user_has_permission(required_permissions text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
   if ax_utils.user_has_setting(required_permissions, 'mosaic.auth.permissions') = false then
    PERFORM ax_utils.raise_error('At least one of these permissions must be granted: %s', 'PERMI', required_permissions);
   end if;
   return true;
END;
$$;


--
-- Name: user_has_permission_and_tag(text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.user_has_permission_and_tag(required_permissions text, fieldvalue text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
	v_part text;
	v_user_permissions text = ',' || pg_catalog.current_setting('mosaic.auth.permissions', true) || ',';
	v_user_tags text = pg_catalog.current_setting('mosaic.auth.tags', true);
BEGIN
   -- check if the user has the needed permission - otherwise skip
   if ax_utils.user_has_setting(required_permissions, 'mosaic.auth.permissions') = false then
       RAISE EXCEPTION 'At least one of these permissions must be granted: (%)', required_permissions using errcode = 'PERMI'; 
   end if;   
   -- check if any tag matches the discrete column value
   foreach v_part in array string_to_array(v_user_tags, ',')
   loop
       if v_part = CAST (fieldValue AS TEXT) then
           return true;
       end if;
   end loop;
   return false;
END;
$$;


--
-- Name: user_has_setting(text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.user_has_setting(required_settings text, local_variable_field text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
	v_part text;
	v_user_settings text = ',' || pg_catalog.current_setting(local_variable_field, true) || ',';
BEGIN
   foreach v_part in array string_to_array(required_settings, ',')
   loop
       if v_user_settings like '%,' || v_part || ',%' then
           return true;
       end if;
   end loop;
   return false;
END;
$$;


--
-- Name: user_has_tag(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.user_has_tag(required_permissions text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
   return ax_utils.user_has_setting(required_permissions, 'mosaic.auth.tags');
END;
$$;


--
-- Name: validate_identifier_length(text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validate_identifier_length(identifier text, hint text DEFAULT ''::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  stack text; fcesig text; callinfo text;
BEGIN
  IF LENGTH(identifier) > 63 THEN
    -- get sig of calling function
    GET DIAGNOSTICS stack = PG_CONTEXT;
    fcesig := substring(substring(stack from 'function (.*)') from 'function (.*?) line');
    callinfo := CASE WHEN fcesig IS NULL THEN '' ELSE 'Long identifier in ' || fcesig::regprocedure::text || '. ' END;
    perform ax_utils.raise_error('%sIdentifier "%s" exceeds 63 bytes. %s', 'SETUP', callinfo, identifier, hint);
  END IF;
END;
$$;


--
-- Name: validation_is_base64(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_base64(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if input_value !~* '^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_is_identifier_key(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_identifier_key(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if input_value !~* '^([A-Za-z0-9_\-])*$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_is_optional_url(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_optional_url(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if not ax_utils.validation_not_empty(input_value) THEN
    return true;
  end if;

  if input_value !~* 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,255}(\.[a-z]{2,9})?\y([-a-zA-Z0-9@:%_\+.~#?&//=]*)$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_is_trimmed(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_trimmed(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if input_value !~* '^(?!.*^[\s])(?!.*[\s]$).*$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_is_url(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_url(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if input_value !~* 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,255}(\.[a-z]{2,9})?\y([-a-zA-Z0-9@:%_\+.~#?&//=]*)$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_not_empty(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_not_empty(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if input_value IS NULL OR input_value !~* '.*\S.*' then
  	return false;
  end if;
  return true;
end;
$$;


--
-- Name: validation_not_empty_array(text[]); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_not_empty_array(input_value text[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  val_ TEXT;
BEGIN
  IF array_length(input_value, 1) IS NULL THEN 
    RETURN FALSE;
  END IF;
 
 
  FOREACH val_ IN ARRAY input_value LOOP
 	  IF val_ IS NULL OR val_ !~* '.*\S.*' THEN
  	  	RETURN FALSE;
  	END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$;


--
-- Name: validation_starts_with(text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_starts_with(input_value text, prefix_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if input_value like prefix_value || '%' then
  	return true;
  end if;
  return false;
end;
$$;


--
-- Name: validation_valid_url_array(text[]); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_valid_url_array(input_value text[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  val_ TEXT;
BEGIN
  IF array_length(input_value, 1) IS NOT NULL THEN 
    FOREACH val_ IN ARRAY input_value LOOP
      IF val_ IS NOT NULL THEN
        IF NOT ax_utils.validation_is_url(val_) THEN
          RETURN FALSE;
        END IF;
      ELSIF val_ IS NULL OR val_ !~* '.*\S.*' THEN
  	  	RETURN FALSE;
      END IF;
    END LOOP;
  END IF;
  RETURN TRUE;
END;
$$;


--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: subscription_devices; Type: TABLE; Schema: app_hidden; Owner: -
--

CREATE TABLE app_hidden.subscription_devices (
    id uuid NOT NULL,
    subscription_code text NOT NULL,
    device_id text NOT NULL,
    device_name text NOT NULL,
    last_active timestamp with time zone,
    manual_closed boolean DEFAULT false NOT NULL
);


--
-- Name: subscription_devices subscription_devices_pkey; Type: CONSTRAINT; Schema: app_hidden; Owner: -
--

ALTER TABLE ONLY app_hidden.subscription_devices
    ADD CONSTRAINT subscription_devices_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA app_hidden; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_hidden TO entitlement_service_gql_role;


--
-- Name: SCHEMA app_public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_public TO entitlement_service_gql_role;
GRANT USAGE ON SCHEMA app_public TO entitlement_service_login;


--
-- Name: SCHEMA ax_define; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA ax_define TO entitlement_service_gql_role;


--
-- Name: SCHEMA ax_utils; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA ax_utils TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_has_allowed_value(input_value text, allowed_values text[], error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_has_allowed_value(input_value text, allowed_values text[], error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_has_allowed_value(input_value text, allowed_values text[], error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_is_base64(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_base64(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_base64(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_is_identifier_key(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_identifier_key(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_identifier_key(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_is_trimmed(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_trimmed(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_trimmed(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_is_url(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_url(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_url(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_matches_pattern(input_value text, pattern text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_matches_pattern(input_value text, pattern text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_matches_pattern(input_value text, pattern text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_max_length(input_value text, max_length integer, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_max_length(input_value text, max_length integer, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_max_length(input_value text, max_length integer, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_max_value(input_value numeric, max_value numeric, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_max_value(input_value numeric, max_value numeric, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_max_value(input_value numeric, max_value numeric, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_min_length(input_value text, min_length integer, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_min_length(input_value text, min_length integer, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_min_length(input_value text, min_length integer, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_min_value(input_value numeric, min_value numeric, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_min_value(input_value numeric, min_value numeric, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_min_value(input_value numeric, min_value numeric, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_not_default_uuid(input_value uuid, default_uuid uuid, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_not_default_uuid(input_value uuid, default_uuid uuid, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_not_default_uuid(input_value uuid, default_uuid uuid, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_not_empty(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_not_empty(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_not_empty(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_not_empty_array(input_value text[], error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_not_empty_array(input_value text[], error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_not_empty_array(input_value text[], error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_starts_with(input_value text, prefix_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_starts_with(input_value text, prefix_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_starts_with(input_value text, prefix_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION current_environment_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.current_environment_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.current_environment_id() TO entitlement_service_gql_role;


--
-- Name: FUNCTION current_tenant_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.current_tenant_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.current_tenant_id() TO entitlement_service_gql_role;


--
-- Name: FUNCTION current_user_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.current_user_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.current_user_id() TO entitlement_service_gql_role;


--
-- Name: FUNCTION raise_error(error_message text, error_code text, VARIADIC placeholder_values text[]); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.raise_error(error_message text, error_code text, VARIADIC placeholder_values text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.raise_error(error_message text, error_code text, VARIADIC placeholder_values text[]) TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__graphql_subscription(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__graphql_subscription() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__graphql_subscription() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__tenant_environment(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__tenant_environment() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__tenant_environment() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__tenant_environment_on_delete(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__tenant_environment_on_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__tenant_environment_on_delete() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__timestamps(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__timestamps() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__timestamps() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__user_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__user_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__user_id() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__username(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__username() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__username() TO entitlement_service_gql_role;


--
-- Name: FUNCTION user_has_permission(required_permissions text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_permission(required_permissions text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_permission(required_permissions text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION user_has_permission_and_tag(required_permissions text, fieldvalue text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_permission_and_tag(required_permissions text, fieldvalue text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_permission_and_tag(required_permissions text, fieldvalue text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION user_has_setting(required_settings text, local_variable_field text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_setting(required_settings text, local_variable_field text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_setting(required_settings text, local_variable_field text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION user_has_tag(required_permissions text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_tag(required_permissions text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_tag(required_permissions text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validate_identifier_length(identifier text, hint text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validate_identifier_length(identifier text, hint text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validate_identifier_length(identifier text, hint text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_base64(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_base64(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_base64(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_identifier_key(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_identifier_key(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_identifier_key(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_optional_url(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_optional_url(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_optional_url(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_trimmed(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_trimmed(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_trimmed(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_url(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_url(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_url(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_not_empty(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_not_empty(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_not_empty(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_not_empty_array(input_value text[]); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_not_empty_array(input_value text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_not_empty_array(input_value text[]) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_starts_with(input_value text, prefix_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_starts_with(input_value text, prefix_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_starts_with(input_value text, prefix_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_valid_url_array(input_value text[]); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_valid_url_array(input_value text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_valid_url_array(input_value text[]) TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_hidden REVOKE ALL ON SEQUENCES  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_hidden GRANT SELECT,USAGE ON SEQUENCES  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_hidden REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_hidden REVOKE ALL ON FUNCTIONS  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_hidden GRANT ALL ON FUNCTIONS  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_public REVOKE ALL ON SEQUENCES  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_public GRANT SELECT,USAGE ON SEQUENCES  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_public REVOKE ALL ON FUNCTIONS  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_public GRANT ALL ON FUNCTIONS  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: ax_define; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_define REVOKE ALL ON SEQUENCES  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_define GRANT SELECT,USAGE ON SEQUENCES  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: ax_define; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_define REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_define REVOKE ALL ON FUNCTIONS  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_define GRANT ALL ON FUNCTIONS  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: ax_utils; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_utils REVOKE ALL ON SEQUENCES  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_utils GRANT SELECT,USAGE ON SEQUENCES  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: ax_utils; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_utils REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_utils REVOKE ALL ON FUNCTIONS  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_utils GRANT ALL ON FUNCTIONS  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA public REVOKE ALL ON SEQUENCES  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM entitlement_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA public GRANT ALL ON FUNCTIONS  TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner REVOKE ALL ON FUNCTIONS  FROM PUBLIC;


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE PROCEDURE postgraphile_watch.notify_watchers_ddl();


--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE PROCEDURE postgraphile_watch.notify_watchers_drop();


--
-- PostgreSQL database dump complete
--

