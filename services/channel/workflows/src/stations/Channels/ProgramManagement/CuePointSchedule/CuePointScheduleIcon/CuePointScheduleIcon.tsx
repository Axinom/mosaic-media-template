import React from 'react';
import { CuePointScheduleType } from '../../../../../generated/graphql';
import classes from './CuePointScheduleIcon.module.scss';

interface CuePointScheduleIconProps {
  type: CuePointScheduleType;
}

const CuePointScheduleAdIcon: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#B7B7B7"
        strokeWidth="2"
        d="M25.8,3l10.1,21l-18.4,0.1l-10,4.8l-3.3-6.8l10-4.8L25.8,3z M11.9,26.8L14.7,37l5.5-2.7l-2.7-10.2 M32.8,17.6  c2.3-1.1,3.2-3.8,2.1-6.1c-1.1-2.3-3.8-3.2-6.1-2.1"
      />
    </svg>
  );
};

const CuePointScheduleVideoIcon: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#B7B7B7"
        strokeWidth="2"
        d="M7.5,32.5v-25l25,12.5L7.5,32.5z"
      />
    </svg>
  );
};

export const CuePointScheduleIcon: React.FC<CuePointScheduleIconProps> = ({
  type,
}) => {
  if (type === CuePointScheduleType.AdPod) {
    return (
      <div className={classes.container}>
        <CuePointScheduleAdIcon />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <CuePointScheduleVideoIcon />
    </div>
  );
};
