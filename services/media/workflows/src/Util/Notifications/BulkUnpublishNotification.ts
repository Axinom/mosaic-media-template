export const bulkUnpublishNotification = (count: number) =>
  ({
    title: `Unpublishing initiated for ${count} ${count === 1 ? 'item' : 'items'}`,
    options: { type: 'success' },
  }) as const;
