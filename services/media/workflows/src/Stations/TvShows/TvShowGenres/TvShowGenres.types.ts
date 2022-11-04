import { TvshowGenre } from '../../../generated/graphql';

export type FormDataGenre = Pick<TvshowGenre, 'title' | 'sortOrder' | 'id'>;

export interface TvShowGenresFormData {
  genres?: FormDataGenre[];
  tags?: string[];
}
