export const bulkSnapshotCreateNotification = (count: number) =>
  ({
    title: `${count} ${count === 1 ? 'snapshot' : 'snapshots'} created`,
    options: { type: 'success' },
  } as const);
