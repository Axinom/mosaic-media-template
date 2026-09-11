export const bulkPublishNowNotification = (count: number) =>
  ({
    title: `Publication initiated for ${count} ${count === 1 ? 'item' : 'items'}`,
    body: 'Snapshots will automatically be published if validation is successful.',
    options: { type: 'success' },
  }) as const;
