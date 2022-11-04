/**
 * Parses the content ID string and extracts the content type portion.
 * @param contentId - Content ID to parse.
 */
export function parseContentId(contentId: string): string | undefined {
  const re = new RegExp('^([a-zA-Z]+)?-.+$');
  const match = re.exec(contentId);

  return match ? match[1] : undefined;
}

export function parsePublishMessageType(eventName: string): {
  contentType: string;
  publishOperation: 'published' | 'unpublished';
} {
  const regex = /(?<contentType>\w+)(?<publishOperation>Published|Unpublished)/;
  const match = eventName.match(regex);

  if (!match || !match.groups) {
    throw new Error(
      `${eventName} does not match the expected publish event name format.`,
    );
  }

  return {
    contentType: pascalCaseToKebabCase(match.groups.contentType).toLowerCase(),
    publishOperation:
      match.groups.publishOperation === 'Published'
        ? 'published'
        : 'unpublished',
  };
}

/**
 * Converts a PascalCase string into a kebab-case string.
 * If the input string is not in PascalCase, returns the input string unmodified.
 * @param input - Input string.
 */
export function pascalCaseToKebabCase(input: string): string {
  const match = input.match(/[A-Z][^A-Z]*/g);

  if (!match || match.join('') !== input) {
    return input;
  }

  return match.map((w) => w.toLowerCase()).join('-');
}
