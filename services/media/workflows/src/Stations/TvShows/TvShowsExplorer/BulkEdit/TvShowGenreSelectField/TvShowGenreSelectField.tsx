import { Loader, TagsField, TagsProps } from '@axinom/mosaic-ui';
import React from 'react';
import { client } from '../../../../../apolloClient';
import {
  TvShowGenresQuery,
  useTvShowGenresQuery,
} from '../../../../../generated/graphql';
import classes from './TvShowGenreSelectField.module.scss';

type TvShowGenre = NonNullable<
  TvShowGenresQuery['tvshowGenres']
>['nodes'][number];

export const BulkEditTvShowGenreSelectField: React.FC<
  TagsProps<TvShowGenre>
> = (props) => {
  const { data, loading } = useTvShowGenresQuery({
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

  const genreOptions = data?.tvshowGenres?.nodes || [];

  const { onChange, value } = props;

  return (
    <TagsField<TvShowGenre>
      {...props}
      tagsOptions={genreOptions}
      displayKey="title"
      valueKey="id"
      value={
        (value as unknown as { tvshowGenresId: string }[])?.map((val) =>
          String(val.tvshowGenresId),
        ) ?? []
      }
      onChange={(event) => {
        const value = (event.currentTarget.value as unknown as string[]).map(
          (id) => ({
            tvshowGenresId: Number(id),
          }),
        );

        onChange &&
          onChange({
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
