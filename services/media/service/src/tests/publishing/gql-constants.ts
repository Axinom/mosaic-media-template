import gql from 'graphql-tag';

const FULL_SNAPSHOT_METADATA = `
id
jobId
entityType
entityTitle
entityId
createdUser
createdDate
updatedUser
updatedDate
publishId
publishedDate
scheduledDate
snapshotJson
snapshotNo
snapshotState
unpublishedDate
validationStatus
isListSnapshot`;

export const PUBLISH_MOVIES = gql`
  mutation PublishMovies($filter: MovieFilter) {
    publishMovies(filter: $filter) {
      affectedIds
    }
  }
`;

export const UNPUBLISH_MOVIES = gql`
  mutation UnpublishMovies($filter: MovieFilter) {
    unpublishMovies(filter: $filter) {
      affectedIds
    }
  }
`;

export const CREATE_MOVIE_SNAPSHOTS = gql`
  mutation CreateMovieSnapshots($filter: MovieFilter) {
    createMovieSnapshots(filter: $filter) {
      affectedIds
    }
  }
`;

export const PUBLISH_MOVIE = gql`
  mutation PublishMovie($movieId: Int!) {
    publishMovie(movieId: $movieId) {
      ${FULL_SNAPSHOT_METADATA}
    }
  }
`;

export const CREATE_MOVIE_SNAPSHOT = gql`
  mutation CreateMovieSnapshot($movieId: Int!) {
    createMovieSnapshot(movieId: $movieId) {
      ${FULL_SNAPSHOT_METADATA}
    }
  }
`;

export const UNPUBLISH_MOVIE = gql`
  mutation UnpublishMovie($movieId: Int!) {
    unpublishMovie(movieId: $movieId) {
      ${FULL_SNAPSHOT_METADATA}
    }
  }
`;

export const RECREATE_SNAPSHOTS = gql`
  mutation RecreateSnapshots($filter: SnapshotFilter) {
    recreateSnapshots(filter: $filter) {
      affectedIds
    }
  }
`;

export const PUBLISH_SNAPSHOT = gql`
  mutation PublishSnapshot($snapshotId: Int!) {
    publishSnapshot(snapshotId: $snapshotId) {
      ${FULL_SNAPSHOT_METADATA}
    }
  }
`;

export const UNPUBLISH_SNAPSHOT = gql`
  mutation UnpublishSnapshot($snapshotId: Int!) {
    unpublishSnapshot(snapshotId: $snapshotId) {
      ${FULL_SNAPSHOT_METADATA}
    }
  }
`;

export const PUBLISH_SNAPSHOTS = gql`
  mutation PublishSnapshots($filter: SnapshotFilter) {
    publishSnapshots(filter: $filter) {
      affectedIds
    }
  }
`;

export const UNPUBLISH_SNAPSHOTS = gql`
  mutation UnpublishSnapshots($filter: SnapshotFilter) {
    unpublishSnapshots(filter: $filter) {
      affectedIds
    }
  }
`;

export const PUBLISH_MOVIE_GENRES = gql`
  mutation PublishMovieGenres {
    publishMovieGenres {
      ${FULL_SNAPSHOT_METADATA}
    }
  }
`;

export const CREATE_MOVIE_GENRES_SNAPSHOT = gql`
  mutation CreateMovieGenresSnapshot {
    createMovieGenresSnapshot {
      ${FULL_SNAPSHOT_METADATA}
    }
  }
`;

export const UNPUBLISH_MOVIE_GENRES = gql`
  mutation UnpublishMovieGenres {
    unpublishMovieGenres {
      ${FULL_SNAPSHOT_METADATA}
    }
  }
`;
