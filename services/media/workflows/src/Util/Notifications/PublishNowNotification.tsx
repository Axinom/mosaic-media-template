import React from 'react';
import { Link } from 'react-router-dom';

export const publishNowNotification = ({
  link,
  snapshotNo,
}: {
  link: string;
  snapshotNo?: number;
}) =>
  ({
    title: 'Publication initiated',
    body: (
      <p>
        <Link to={link}>Snapshot {snapshotNo ?? ''}</Link> created.
        <br />
        <br />
        <i>
          The snapshot will automatically be published if validation is
          successful.
        </i>
      </p>
    ),
    options: { type: 'success' },
  } as const);
