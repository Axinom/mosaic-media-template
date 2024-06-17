export const unpublishNotification = () =>
  ({
    title: 'Unpublishing initiated',
    options: { type: 'success' },
  } as const);
