import { Loader, TagsField, TagsProps } from '@axinom/mosaic-ui';
import React from 'react';
import { client } from '../../../../../apolloClient';
import { useMovieGenresQuery } from '../../../../../generated/graphql';
import classes from './MovieGenreSelectField.module.scss';

export const MovieGenreSelectField: React.FC<
  TagsProps<{ title: string; id: string }>
> = (props) => {
  const { data, loading } = useMovieGenresQuery({
    client,
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <div className={classes.container}>
        <Loader showLoader={true} />
      </div>
    );
  }

  const genreOptions = data?.movieGenres?.nodes || [];

  const { onChange, value } = props;

  return (
    <TagsField
      {...props}
      tagsOptions={genreOptions}
      displayKey="title"
      valueKey="id"
      value={
        (value as unknown as { movieGenresId: string }[])?.map((val) =>
          String(val.movieGenresId),
        ) ?? []
      }
      onChange={(event) => {
        const value = (event.currentTarget.value as unknown as string[]).map(
          (id) => ({
            movieGenresId: Number(id),
          }),
        );

        onChange?.({
          ...event,
          target: {
            ...event.target,
            // Typecast to string to satisfy the type system. Actual type is string[]
            value: value as unknown as string,
          },
        });
      }}
    />
  );
};
