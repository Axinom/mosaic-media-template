import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions } from '../../externals';

export function register(app: PiletApi, extensions: Extensions): void {
  app.registerTile({
    kind: 'home',
    name: 'reviews',
    path: '/reviews',
    label: 'Reviews',
    icon: (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <path
          vectorEffect="non-scaling-stroke"
          fill="none"
          stroke="#00467D"
          strokeWidth="2"
          d="M36.5,28H19.4l-7.7,6.6V28H7.5V9.3h29V28z M32.1,5.4H3.5v18.2 M13.4,15.6h18.4 M13.4,21.2h18.4"
        />
      </svg>
    ),
    type: 'large',
  });
}
