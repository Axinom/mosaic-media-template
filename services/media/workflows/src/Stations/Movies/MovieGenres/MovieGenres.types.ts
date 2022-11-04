import { MovieGenre } from '../../../generated/graphql';

export type FormDataGenre = Pick<MovieGenre, 'title' | 'sortOrder' | 'id'>;

export interface MovieGenresFormData {
  genres?: FormDataGenre[];
  tags?: string[];
}
