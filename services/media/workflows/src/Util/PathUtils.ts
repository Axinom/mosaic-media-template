/**
 * Fills a path template with the given parameters.
 * @param template The path template with placeholders.
 * @param params The parameters to replace in the template.
 * @returns The filled path.
 * @example
 * // Usage example:
 * fillPathTemplate('/movies/:id/localizations/:type', { id: 123, type: 'audio' })
 * // returns '/movies/123/localizations/audio'
 */
export function fillPathTemplate(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/:([a-zA-Z0-9_]+)/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `:${key}`,
  );
}
