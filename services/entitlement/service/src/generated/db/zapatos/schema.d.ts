/*
** DON'T EDIT THIS FILE **
It's been generated by Zapatos (v3.6.0), and is liable to be overwritten

Zapatos: https://jawj.github.io/zapatos/
Copyright (C) 2020 George MacKerron
Released under the MIT licence: see LICENCE file
*/

declare module 'zapatos/schema' {

  import type * as db from 'zapatos/db';

  // got a type error on schemaVersionCanary below? update by running `npx zapatos`
  export interface schemaVersionCanary extends db.SchemaVersionCanary { version: 101 }

  /* === schema: app_hidden === */

  /* --- enums --- */


  /* --- tables --- */

  export namespace claim_sets {
    export type Table = 'claim_sets';
    export interface Selectable {
      /**
      * **claim_sets.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key: string;
      /**
      * **claim_sets.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title: string;
      /**
      * **claim_sets.description**
      * - `text` in database
      * - Nullable, no default
      */
      description: string | null;
      /**
      * **claim_sets.claims**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claims: string[];
      /**
      * **claim_sets.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date: Date;
      /**
      * **claim_sets.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date: Date;
      /**
      * **claim_sets.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user: string;
      /**
      * **claim_sets.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user: string;
    }
    export interface JSONSelectable {
      /**
      * **claim_sets.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key: string;
      /**
      * **claim_sets.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title: string;
      /**
      * **claim_sets.description**
      * - `text` in database
      * - Nullable, no default
      */
      description: string | null;
      /**
      * **claim_sets.claims**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claims: string[];
      /**
      * **claim_sets.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date: db.DateString;
      /**
      * **claim_sets.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date: db.DateString;
      /**
      * **claim_sets.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user: string;
      /**
      * **claim_sets.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user: string;
    }
    export interface Whereable {
      /**
      * **claim_sets.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **claim_sets.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **claim_sets.description**
      * - `text` in database
      * - Nullable, no default
      */
      description?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **claim_sets.claims**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claims?: string[] | db.Parameter<string[]> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string[] | db.Parameter<string[]> | db.SQLFragment | db.ParentColumn>;
      /**
      * **claim_sets.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn>;
      /**
      * **claim_sets.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn>;
      /**
      * **claim_sets.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **claim_sets.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **claim_sets.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **claim_sets.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **claim_sets.description**
      * - `text` in database
      * - Nullable, no default
      */
      description?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment;
      /**
      * **claim_sets.claims**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claims?: string[] | db.Parameter<string[]> | db.DefaultType | db.SQLFragment;
      /**
      * **claim_sets.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment;
      /**
      * **claim_sets.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment;
      /**
      * **claim_sets.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment;
      /**
      * **claim_sets.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **claim_sets.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **claim_sets.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **claim_sets.description**
      * - `text` in database
      * - Nullable, no default
      */
      description?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment>;
      /**
      * **claim_sets.claims**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claims?: string[] | db.Parameter<string[]> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string[] | db.Parameter<string[]> | db.DefaultType | db.SQLFragment>;
      /**
      * **claim_sets.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment>;
      /**
      * **claim_sets.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment>;
      /**
      * **claim_sets.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.DefaultType | db.SQLFragment>;
      /**
      * **claim_sets.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.DefaultType | db.SQLFragment>;
    }
    export type UniqueIndex = 'claim_sets_pkey';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = db.GenericSQLExpression | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Table | Whereable | Column;
    export type SQL = SQLExpression | SQLExpression[];
  }

  export namespace subscription_plans {
    export type Table = 'subscription_plans';
    export interface Selectable {
      /**
      * **subscription_plans.id**
      * - `uuid` in database
      * - `NOT NULL`, no default
      */
      id: string;
      /**
      * **subscription_plans.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title: string;
      /**
      * **subscription_plans.description**
      * - `text` in database
      * - Nullable, no default
      */
      description: string | null;
      /**
      * **subscription_plans.claim_set_keys**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claim_set_keys: string[];
      /**
      * **subscription_plans.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date: Date;
      /**
      * **subscription_plans.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date: Date;
      /**
      * **subscription_plans.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user: string;
      /**
      * **subscription_plans.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user: string;
    }
    export interface JSONSelectable {
      /**
      * **subscription_plans.id**
      * - `uuid` in database
      * - `NOT NULL`, no default
      */
      id: string;
      /**
      * **subscription_plans.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title: string;
      /**
      * **subscription_plans.description**
      * - `text` in database
      * - Nullable, no default
      */
      description: string | null;
      /**
      * **subscription_plans.claim_set_keys**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claim_set_keys: string[];
      /**
      * **subscription_plans.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date: db.DateString;
      /**
      * **subscription_plans.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date: db.DateString;
      /**
      * **subscription_plans.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user: string;
      /**
      * **subscription_plans.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user: string;
    }
    export interface Whereable {
      /**
      * **subscription_plans.id**
      * - `uuid` in database
      * - `NOT NULL`, no default
      */
      id?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **subscription_plans.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **subscription_plans.description**
      * - `text` in database
      * - Nullable, no default
      */
      description?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **subscription_plans.claim_set_keys**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claim_set_keys?: string[] | db.Parameter<string[]> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string[] | db.Parameter<string[]> | db.SQLFragment | db.ParentColumn>;
      /**
      * **subscription_plans.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn>;
      /**
      * **subscription_plans.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn>;
      /**
      * **subscription_plans.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **subscription_plans.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **subscription_plans.id**
      * - `uuid` in database
      * - `NOT NULL`, no default
      */
      id: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **subscription_plans.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **subscription_plans.description**
      * - `text` in database
      * - Nullable, no default
      */
      description?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment;
      /**
      * **subscription_plans.claim_set_keys**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claim_set_keys?: string[] | db.Parameter<string[]> | db.DefaultType | db.SQLFragment;
      /**
      * **subscription_plans.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment;
      /**
      * **subscription_plans.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment;
      /**
      * **subscription_plans.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment;
      /**
      * **subscription_plans.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **subscription_plans.id**
      * - `uuid` in database
      * - `NOT NULL`, no default
      */
      id?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **subscription_plans.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **subscription_plans.description**
      * - `text` in database
      * - Nullable, no default
      */
      description?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment>;
      /**
      * **subscription_plans.claim_set_keys**
      * - `_text` in database
      * - `NOT NULL`, default: `'{}'::text[]`
      */
      claim_set_keys?: string[] | db.Parameter<string[]> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string[] | db.Parameter<string[]> | db.DefaultType | db.SQLFragment>;
      /**
      * **subscription_plans.created_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      created_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment>;
      /**
      * **subscription_plans.updated_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `(now() AT TIME ZONE 'utc'::text)`
      */
      updated_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment>;
      /**
      * **subscription_plans.created_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      created_user?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.DefaultType | db.SQLFragment>;
      /**
      * **subscription_plans.updated_user**
      * - `text` in database
      * - `NOT NULL`, default: `'Unknown'::text`
      */
      updated_user?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.DefaultType | db.SQLFragment>;
    }
    export type UniqueIndex = 'subscription_plans_pkey';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = db.GenericSQLExpression | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Table | Whereable | Column;
    export type SQL = SQLExpression | SQLExpression[];
  }


  /* === schema: app_private === */

  /* --- enums --- */


  /* --- tables --- */

  export namespace messaging_counter {
    export type Table = 'messaging_counter';
    export interface Selectable {
      /**
      * **messaging_counter.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key: string;
      /**
      * **messaging_counter.counter**
      * - `int4` in database
      * - Nullable, default: `1`
      */
      counter: number | null;
      /**
      * **messaging_counter.expiration_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `((now() + '1 day'::interval) AT TIME ZONE 'utc'::text)`
      */
      expiration_date: Date;
    }
    export interface JSONSelectable {
      /**
      * **messaging_counter.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key: string;
      /**
      * **messaging_counter.counter**
      * - `int4` in database
      * - Nullable, default: `1`
      */
      counter: number | null;
      /**
      * **messaging_counter.expiration_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `((now() + '1 day'::interval) AT TIME ZONE 'utc'::text)`
      */
      expiration_date: db.DateString;
    }
    export interface Whereable {
      /**
      * **messaging_counter.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **messaging_counter.counter**
      * - `int4` in database
      * - Nullable, default: `1`
      */
      counter?: number | db.Parameter<number> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment | db.ParentColumn>;
      /**
      * **messaging_counter.expiration_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `((now() + '1 day'::interval) AT TIME ZONE 'utc'::text)`
      */
      expiration_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **messaging_counter.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **messaging_counter.counter**
      * - `int4` in database
      * - Nullable, default: `1`
      */
      counter?: number | db.Parameter<number> | null | db.DefaultType | db.SQLFragment;
      /**
      * **messaging_counter.expiration_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `((now() + '1 day'::interval) AT TIME ZONE 'utc'::text)`
      */
      expiration_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **messaging_counter.key**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      key?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **messaging_counter.counter**
      * - `int4` in database
      * - Nullable, default: `1`
      */
      counter?: number | db.Parameter<number> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, number | db.Parameter<number> | null | db.DefaultType | db.SQLFragment>;
      /**
      * **messaging_counter.expiration_date**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `((now() + '1 day'::interval) AT TIME ZONE 'utc'::text)`
      */
      expiration_date?: (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (Date | db.DateString) | db.Parameter<(Date | db.DateString)> | db.DefaultType | db.SQLFragment>;
    }
    export type UniqueIndex = 'messaging_counter_pkey';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = db.GenericSQLExpression | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Table | Whereable | Column;
    export type SQL = SQLExpression | SQLExpression[];
  }


  /* === schema: app_public === */

  /* --- enums --- */


  /* --- tables --- */



  /* === schema: ax_utils === */

  /* --- enums --- */


  /* --- tables --- */



  /* === schema: public === */

  /* --- enums --- */


  /* --- tables --- */


  /* === cross-table types === */

  export type Table = claim_sets.Table | messaging_counter.Table | subscription_plans.Table;
  export type Selectable = claim_sets.Selectable | messaging_counter.Selectable | subscription_plans.Selectable;
  export type JSONSelectable = claim_sets.JSONSelectable | messaging_counter.JSONSelectable | subscription_plans.JSONSelectable;
  export type Whereable = claim_sets.Whereable | messaging_counter.Whereable | subscription_plans.Whereable;
  export type Insertable = claim_sets.Insertable | messaging_counter.Insertable | subscription_plans.Insertable;
  export type Updatable = claim_sets.Updatable | messaging_counter.Updatable | subscription_plans.Updatable;
  export type UniqueIndex = claim_sets.UniqueIndex | messaging_counter.UniqueIndex | subscription_plans.UniqueIndex;
  export type Column = claim_sets.Column | messaging_counter.Column | subscription_plans.Column;
  export type AllTables = [claim_sets.Table, messaging_counter.Table, subscription_plans.Table];
  export type AllMaterializedViews = [];


  export type SelectableForTable<T extends Table> = {
    claim_sets: claim_sets.Selectable;
    messaging_counter: messaging_counter.Selectable;
    subscription_plans: subscription_plans.Selectable;
  }[T];

  export type JSONSelectableForTable<T extends Table> = {
    claim_sets: claim_sets.JSONSelectable;
    messaging_counter: messaging_counter.JSONSelectable;
    subscription_plans: subscription_plans.JSONSelectable;
  }[T];

  export type WhereableForTable<T extends Table> = {
    claim_sets: claim_sets.Whereable;
    messaging_counter: messaging_counter.Whereable;
    subscription_plans: subscription_plans.Whereable;
  }[T];

  export type InsertableForTable<T extends Table> = {
    claim_sets: claim_sets.Insertable;
    messaging_counter: messaging_counter.Insertable;
    subscription_plans: subscription_plans.Insertable;
  }[T];

  export type UpdatableForTable<T extends Table> = {
    claim_sets: claim_sets.Updatable;
    messaging_counter: messaging_counter.Updatable;
    subscription_plans: subscription_plans.Updatable;
  }[T];

  export type UniqueIndexForTable<T extends Table> = {
    claim_sets: claim_sets.UniqueIndex;
    messaging_counter: messaging_counter.UniqueIndex;
    subscription_plans: subscription_plans.UniqueIndex;
  }[T];

  export type ColumnForTable<T extends Table> = {
    claim_sets: claim_sets.Column;
    messaging_counter: messaging_counter.Column;
    subscription_plans: subscription_plans.Column;
  }[T];

  export type SQLForTable<T extends Table> = {
    claim_sets: claim_sets.SQL;
    messaging_counter: messaging_counter.SQL;
    subscription_plans: subscription_plans.SQL;
  }[T];

}
