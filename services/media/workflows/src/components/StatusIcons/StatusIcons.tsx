import React from 'react';

export enum StatusIcon {
  Error,
  Progress,
  Success,
  Warning,
}

interface StatusIconsProps {
  icon: StatusIcon;
  className?: string;
}

export const StatusIcons: React.FC<StatusIconsProps> = ({
  icon,
  className = '',
}) => {
  const icons: { [key in StatusIcon]: JSX.Element } = {
    [StatusIcon.Error]: <ErrorIcon className={className} />,
    [StatusIcon.Progress]: <ProgressIcon className={className} />,
    [StatusIcon.Success]: <SuccessIcon className={className} />,
    [StatusIcon.Warning]: <WarningIcon className={className} />,
  };

  const actionIcon: JSX.Element =
    icon !== undefined ? (
      icons[icon]
    ) : (
      <svg
        className={className}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
      />
    );

  return actionIcon;
};

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
  >
    <path
      vectorEffect="non-scaling-stroke"
      fill="none"
      stroke="#F26C55"
      strokeWidth="2"
      d="M20,2c9.9,0,18,8.1,18,18s-8.1,18-18,18S2,29.9,2,20S10.1,2,20,2z
	 M12.5,12.5l15,15 M27.5,12.5l-15,15"
    />
  </svg>
);

const ProgressIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
  >
    <path
      vectorEffect="non-scaling-stroke"
      fill="none"
      stroke="#1478AF"
      strokeWidth="2"
      d="M20,2c9.9,0,18,8.1,18,18s-8.1,18-18,18S2,29.9,2,20 M3.9,12c-0.7,1.3-1.2,2.7-1.5,4.2 M16.5,13v14 M23.5,13v14
      M16.1,2.4c-1.5,0.3-3,0.9-4.3,1.6 M8.9,5.8c-1.2,0.9-2.3,2-3.2,3.2"
    />
  </svg>
);

const SuccessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
  >
    <path
      vectorEffect="non-scaling-stroke"
      fill="none"
      stroke="#95C842"
      strokeWidth="2"
      d="M20,2c9.9,0,18,8.1,18,18s-8.1,18-18,18S2,29.9,2,20S10.1,2,20,2z M29,13.5 L17.8,26.3L11,19.1"
    />
  </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
  >
    <path
      vectorEffect="non-scaling-stroke"
      fill="none"
      stroke="#FFC81A"
      strokeWidth="2"
      d="M20,2c9.9,0,18,8.1,18,18s-8.1,18-18,18S2,29.9,2,20S10.1,2,20,2z M20,10.1v13.7l0,0V10.1z M20,29.9v-2.6l0,0
	V29.9z"
    />
  </svg>
);
