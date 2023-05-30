import gql from 'graphql-tag';

export const DELETE_MOVIES = gql`
  mutation DeleteMovies($filter: MovieFilter) {
    deleteMovies(filter: $filter) {
      affectedIds
    }
  }
`;

export const DELETE_EPISODES = gql`
  mutation DeleteEpisodes($filter: EpisodeFilter) {
    deleteEpisodes(filter: $filter) {
      affectedIds
    }
  }
`;

export const DELETE_SEASONS = gql`
  mutation DeleteSeasons($filter: SeasonFilter) {
    deleteSeasons(filter: $filter) {
      affectedIds
    }
  }
`;

export const DELETE_TVSHOWS = gql`
  mutation DeleteTvshows($filter: TvshowFilter) {
    deleteTvshows(filter: $filter) {
      affectedIds
    }
  }
`;

export const DELETE_COLLECTIONS = gql`
  mutation DeleteCollections($filter: CollectionFilter) {
    deleteCollections(filter: $filter) {
      affectedIds
    }
  }
`;

export const DELETE_MOVIE_GENRES = gql`
  mutation DeleteMovieGenres($filter: MovieGenreFilter) {
    deleteMovieGenres(filter: $filter) {
      affectedIds
    }
  }
`;

export const DELETE_TVSHOW_GENRES = gql`
  mutation DeleteTvshowGenres($filter: TvshowGenreFilter) {
    deleteTvshowGenres(filter: $filter) {
      affectedIds
    }
  }
`;

export const DELETE_MOVIES_LICENSES = gql`
  mutation DeleteMoviesLicenses($filter: MoviesLicenseFilter) {
    deleteMoviesLicenses(filter: $filter) {
      affectedIds
    }
  }
`;

export const DELETE_COLLECTION_RELATIONS = gql`
  mutation DeleteCollectionRelations($filter: CollectionRelationFilter) {
    deleteCollectionRelations(filter: $filter) {
      affectedIds
    }
  }
`;

export const DELETE_SNAPSHOTS = gql`
  mutation DeleteSnapshots($filter: SnapshotFilter) {
    deleteSnapshots(filter: $filter) {
      affectedIds
    }
  }
`;
