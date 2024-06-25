import React from 'react';

export enum ChannelIconName {
  Channels,
}

export interface IconsProps {
  icon: ChannelIconName;
}

const Channels: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#00467D"
        strokeWidth="2"
        d="M10.8,36.8h18.5 M15,13.2H2v21.2h36V13.2H25 M25.6,10c-1.1-2-3.3-3.3-5.7-3.3c-2.4,0-4.6,1.3-5.7,3.3
	 M22.8,11.6c-0.6-1-1.6-1.7-2.9-1.7c-1.2,0-2.3,0.7-2.9,1.7 M28.5,8.1c-1.7-2.9-4.8-4.8-8.4-4.9c-3.7,0-6.9,1.9-8.7,4.9 M11.4,28.7
	l4.7-4.7l-4.7-4.7 M17.7,28.7l4.7-4.7l-4.7-4.7 M23.9,28.7l4.7-4.7l-4.7-4.7 M20,13.1c-0.1,0-0.2,0.1-0.2,0.2s0.1,0.2,0.2,0.2
	s0.2-0.1,0.2-0.2S20.1,13.1,20,13.1z"
      />
    </svg>
  );
};

export const ChannelIcons: React.FC<IconsProps> = ({ icon }) => {
  const icons: { [key in ChannelIconName]: JSX.Element } = {
    [ChannelIconName.Channels]: <Channels />,
  };
  return icons[icon];
};
