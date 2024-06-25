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
      ></svg>
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
    <g>
      <path
        fill="#F26C55"
        d="M20,0C9,0,0,9,0,20s9,20,20,20s20-9,20-20S31,0,20,0z M20,36c-8.8,0-16-7.2-16-16c0-8.8,7.2-16,16-16
		c8.8,0,16,7.2,16,16C36,28.8,28.8,36,20,36z"
      />
      <rect x="18.1" y="10.7" fill="#F26C55" width="4.6" height="12" />
      <rect x="18.1" y="25.3" fill="#F26C55" width="4.6" height="4" />
    </g>
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
      fill="#0E7CB4"
      d="M20,0v4c8.8,0,16,7.2,16,16c0,8.8-7.2,16-16,16c-8.8,0-16-7.2-16-16c0,0,0,0,0,0H0c0,0,0,0,0,0
	c0,11,9,20,20,20s20-9,20-20C40,9,31,0,20,0z"
    />
    <path
      fill="#0E7CB4"
      d="M4.2,17.8l-4-0.6c0.3-2.1,0.9-4.2,1.9-6.1l3.6,1.8C4.9,14.4,4.4,16.1,4.2,17.8z M7,10.7L3.8,8.3
	C5,6.6,6.5,5.1,8.3,3.8L10.6,7C9.2,8,8,9.3,7,10.7z M12.8,5.7L11,2.1c1.9-1,4-1.6,6.1-1.9l0.6,4C16,4.4,14.4,4.9,12.8,5.7z"
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
    <g>
      <polygon
        fill="#95C842"
        points="17.9,22.4 12.4,16.5 9.5,19.2 18,28.3 30,14.5 27,11.8 	"
      />
      <path
        fill="#95C842"
        d="M20,0C9,0,0,9,0,20s9,20,20,20s20-9,20-20S31,0,20,0z M20,36c-8.8,0-16-7.2-16-16c0-8.8,7.2-16,16-16
		c8.8,0,16,7.2,16,16C36,28.8,28.8,36,20,36z"
      />
    </g>
  </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
  >
    <g>
      <path
        fill="#FFC81A"
        d="M20,0C9,0,0,9,0,20s9,20,20,20s20-9,20-20S31,0,20,0z M20,36c-8.8,0-16-7.2-16-16c0-8.8,7.2-16,16-16
		c8.8,0,16,7.2,16,16C36,28.8,28.8,36,20,36z"
      />
      <rect x="18.1" y="10.7" fill="#FFC81A" width="4.6" height="12" />
      <rect x="18.1" y="25.3" fill="#FFC81A" width="4.6" height="4" />
    </g>
  </svg>
);
