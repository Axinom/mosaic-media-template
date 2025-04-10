import React from 'react';

export enum CustomerIconName {
  Customer,
}

export interface IconsProps {
  icon: CustomerIconName;
}

const CustomerIcon: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#00467D"
        strokeWidth="2"
        d="M27.2,12.5c0,3.9-3.2,7.1-7.2,7.1s-7.2-3.2-7.2-7.1S16,5.4,20,5.4S27.2,8.6,27.2,12.5z M29.6,34.6v-6.6
	c0-4.6-3.8-8.4-8.5-8.4h-2.5c-4.6,0-8.4,3.8-8.4,8.4v6.6H29.6z M10.9,7.7C10.9,7.7,10.8,7.7,10.9,7.7c-3.3,0-5.8,2.6-5.8,5.7
	s2.6,5.7,5.7,5.7h0.1 M10.9,19.1H9.8c-3.7,0-6.8,3-6.8,6.7v5.4h4.6 M29.1,19.2C29.1,19.2,29.2,19.2,29.1,19.2c3.3,0,5.8-2.6,5.8-5.7
	s-2.6-5.7-5.7-5.7h-0.1 M32.4,31.3H37v-5.4c0-3.7-3.1-6.7-6.8-6.7h-1.1 M19.5,22.4l-1.7,6.7l2.4,2.3l2.3-2.3l-1.5-6.7H19.5z
	 M17.8,19.6l1.4,2.8h1.9l1.3-2.8"
      />
    </svg>
  );
};

export const CustomerIcons: React.FC<IconsProps> = ({ icon }) => {
  const icons: { [key in CustomerIconName]: JSX.Element } = {
    [CustomerIconName.Customer]: <CustomerIcon />,
  };
  return icons[icon];
};
