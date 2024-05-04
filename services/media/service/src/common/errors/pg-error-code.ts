export enum PgErrorCode {
  ActiveSnapshots = 'ACSNS',
  /**
   * Data Exception happens, when input date time is malformed.
   * PostgreSQL Error Codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
   */
  InvalidDateTimeFormat = '22007',
}
