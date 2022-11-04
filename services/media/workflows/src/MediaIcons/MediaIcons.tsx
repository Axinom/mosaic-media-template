import React from 'react';

export enum MediaIconName {
  Movie,
  TV,
  Seasons,
  Episodes,
  Ingest,
  MovieGenres,
  TvShowGenres,
  Collections,
  Snapshots,
}

export interface IconsProps {
  icon: MediaIconName;
}

const MovieIcon: React.FC = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 40 40"
    >
      <path
        fill="none"
        strokeWidth="2"
        strokeMiterlimit="10"
        vectorEffect="non-scaling-stroke"
        d="M39.3,32.5l-38.4,0v-25h38.4L39.3,32.5z
    M16.6,15.4V25l8.7-4.8L16.6,15.4z M5.4,7.5v24.9 M0.8,12.4h4.5 M0.8,17.3h4.5 M0.8,22.2h4.5 M0.7,27.4h4.5 M34.4,7.5v24.9
    M39.2,12.4h-4.7 M39.2,17.3h-4.7 M39.2,22.2h-4.7 M39.3,27.4h-4.7"
      />
    </svg>
  );
};

const TvIcon: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#00467D"
        strokeWidth="2"
        d="M10.3,33.5h19.5 M1,21.9c9.9-2.7,10.5-15.4,10.5-15.4 M7.8,31.1
	c0,0,0.8-6.1-4.3-10.2 M16,14.7V25l9.4-5.2L16,14.7z M28.8,6.5c0,0,0.6,12.7,10.2,15.4 M36.5,21c-4.8,4-4.2,10.2-4.2,10.2 M39,6.5H1
	V31h38V6.5z"
      />
    </svg>
  );
};

const Seasons: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#00467D"
        strokeWidth="2"
        d="M10.3,33.5h19.5 M1,21.9c9.9-2.7,10.5-15.4,10.5-15.4 M7.8,31.1
	c0,0,0.8-6.1-4.3-10.2 M28.8,6.5c0,0,0.6,12.7,10.2,15.4 M36.5,21c-4.8,4-4.2,10.2-4.2,10.2 M39,6.5H1V31h38V6.5z M15.5,17.2h9
	 M15,21.2h9.1 M18.8,12.7l-1.9,13.4 M22.7,12.7l-1.9,13.4"
      />
    </svg>
  );
};

const Episodes: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#00467D"
        strokeWidth="2"
        d="M10.3,33.5h19.5 M1,21.9c9.9-2.7,10.5-15.4,10.5-15.4 M7.8,31.1
	c0,0,0.8-6.1-4.3-10.2 M28.8,6.5c0,0,0.6,12.7,10.2,15.4 M36.5,21c-4.8,4-4.2,10.2-4.2,10.2 M39,6.5H1V31h38V6.5z M19.7,16.8
	l-2.2-1.2v7.8l2.1-1.1 M21.6,15.6v7.8l7-3.9L21.6,15.6z M15.6,16.8l-2.2-1.2v7.8l2.1-1.1"
      />
    </svg>
  );
};

const Ingest: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#00467D"
        strokeWidth="2"
        d="M31.5,13.4c0.6,0.9,1,2,1.3,3l6.2,0.9v5.1l-6.1,0.9
	c-0.3,1.1-0.7,2.2-1.2,3.1l3.6,4.9l-3.6,3.7l-4.8-3.5c-1,0.6-2.1,1-3.2,1.3l-0.9,6h-5.1l-0.9-6c-1.1-0.3-2.2-0.8-3.2-1.3l-4.9,3.6
	l-3.6-3.6l3.6-4.9c-0.6-1-0.9-2-1.2-3.1L1,22.7v-5.1l6.2-0.9c0.3-1,0.7-2,1.2-2.9L4.7,8.4l3.6-3.6l5.1,3.7c0.9-0.6,1.9-0.9,2.8-1.2
	l1-6.3h5.1l1,6.3c1,0.3,2,0.7,2.9,1.1l5.1-3.7l3.6,3.6L31.5,13.4z M16.5,14.6v11l10-5.5L16.5,14.6z"
      />
    </svg>
  );
};

const MovieGenres: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        strokeWidth="2"
        d="M19,27.5c-3.5,1.5-5.6-1.4-5.6-1.4s1.3-0.1,4.4-1.4
	s4.2-2.2,4.2-2.2S22.5,26,19,27.5z M12.3,17.8c-1.1-0.6-2.6-0.5-3.6,0.5c-1,0.9-1.3,2.3-0.9,3.5 M22.5,15.4
	c-0.6-1.1-1.9-1.8-3.2-1.6s-2.4,1.2-2.7,2.5 M10.7,36.1 M40,2.9H24.3v6.9V32v5.1l15.5,0 M29.5,3V37 M29.5,8.6h-5.2 M29.5,14.2h-5.2
	 M29.5,20h-5.2 M29.5,26h-5.2 M29.5,31.8h-5.2 M24.3,9.8c-1.9-3.8-3.4-6.5-3.4-6.5s-4.2,3.3-10,5.8S0,12.2,0,12.2s2.6,8.3,5.5,15
	S22,34.9,22,34.9s1-1.2,2.3-3"
      />
    </svg>
  );
};

const TvShowGenres: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        strokeWidth="2"
        d="M22.3,28.1c-3.8,1.6-6.1-1.5-6.1-1.5
	s1.4-0.1,4.8-1.6c3.4-1.4,4.5-2.4,4.5-2.4S26.1,26.4,22.3,28.1z M15.1,17.5c-1.2-0.6-2.8-0.5-3.9,0.5c-1.1,1-1.4,2.5-0.9,3.8
	 M32.6,23.2c-7.2,6.1-7.1,15.4-7.1,15.4l12.7,0l0-37.2H20.3c0,0,3.7,20.3,17.9,24.5 M21,4.2c-1.9,1.2-4.4,2.6-7.4,3.9
	c-6.2,2.7-11.8,3.4-11.8,3.4s2.9,9.1,6,16.3s17.9,8.4,17.9,8.4 M24.7,13.5c-0.6-0.3-1.4-0.5-2.1-0.4c-1.5,0.2-2.6,1.3-2.9,2.7"
      />
    </svg>
  );
};

const Collections: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#00467D"
        strokeWidth="2"
        d="M1,34.8v-25h12.7l2.5,4.7H39v20.3H1z M36.6,9.4V6.6h-34v1.9 M21.5,28.3h12.7 M21.5,25h12.7 M37.8,13.3v-2.8h-21"
      />
    </svg>
  );
};
const Snapshots: React.FC = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#00467D"
        strokeWidth="2"
        d="M29.5,21c0,5.2-4.3,9.5-9.5,9.5s-9.5-4.3-9.5-9.5s4.3-9.5,9.5-9.5S29.5,15.8,29.5,21z M37.9,9.1h-8.1l-2.3-4.2
	H12.6l-2.3,4.2H2.1C1.5,9.1,1,9.6,1,10.3v23.6C1,34.5,1.5,35,2.1,35h35.7c0.6,0,1.1-0.5,1.1-1.1V10.3C39,9.6,38.5,9.1,37.9,9.1z
	 M34.8,13.4h-1.5v1.4h1.5V13.4z M14.1,19.8l5.4,5.4l8.5-9.3"
      />
    </svg>
  );
};

export const MediaIcons: React.FC<IconsProps> = ({ icon }) => {
  const icons: { [key in MediaIconName]: JSX.Element } = {
    [MediaIconName.Movie]: <MovieIcon />,
    [MediaIconName.TV]: <TvIcon />,
    [MediaIconName.Seasons]: <Seasons />,
    [MediaIconName.Episodes]: <Episodes />,
    [MediaIconName.Ingest]: <Ingest />,
    [MediaIconName.MovieGenres]: <MovieGenres />,
    [MediaIconName.TvShowGenres]: <TvShowGenres />,
    [MediaIconName.Collections]: <Collections />,
    [MediaIconName.Snapshots]: <Snapshots />,
  };
  return icons[icon];
};
