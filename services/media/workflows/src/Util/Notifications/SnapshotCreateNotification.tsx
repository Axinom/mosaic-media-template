import React from 'react';
import { Link } from 'react-router-dom';

export const snapshotCreateNotification = ({
  link,
  snapshotNo,
}: {
  link: string;
  snapshotNo?: number;
}) =>
  ({
    title: 'Snapshot created',
    body: (
      <p>
        <Link to={link}>Snapshot {snapshotNo ?? ''}</Link> created.
      </p>
    ),
    options: { type: 'success' },
  } as const);
