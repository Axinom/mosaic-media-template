import gql from 'graphql-tag';

export const FULL_MOVIE_PROPERTIES_SET = `
updatedUser
updatedDate
title
synopsis
studio
released
publishedUser
publishedDate
publishStatus
originalTitle
mainVideoId
id
externalId
description
createdUser
createdDate
moviesTrailers {
  nodes {
    videoId
  }
}
moviesTags {
  nodes {
    name
  }
}
moviesProductionCountries {
  nodes {
    name
  }
}
moviesMovieGenres {
  nodes {
    movieGenres {
      createdDate
      createdUser
      id
      sortOrder
      title
      updatedDate
      updatedUser
    }
  }
}
moviesLicenses {
  nodes {
    licenseStart
    licenseEnd
    id
    moviesLicensesCountries{
      nodes {
        code
        moviesLicenseId
      }
    }
  }
}
moviesImages {
  nodes {
    imageType
    imageId
  }
}
moviesCasts {
  nodes {
    name
  }
}
`;

export const GET_LIST_WITHOUT_VARIABLES = gql`{
    movies {
      nodes{
        ${FULL_MOVIE_PROPERTIES_SET}
      }
    }
}`;

export const CREATE = gql`mutation CreateMovie($input: CreateMovieInput!) {
    createMovie(input: $input) {
        movie {
          ${FULL_MOVIE_PROPERTIES_SET}
        }
    }
}`;

export const UPDATE = gql`mutation UpdateMovie($input: UpdateMovieInput!) {
    updateMovie(input: $input) {
      movie {
        ${FULL_MOVIE_PROPERTIES_SET}
      }
    }
}`;

export const GET_BY_ID = gql`query GetMovieById($id: Int!) {
    movie(id: $id) {
      ${FULL_MOVIE_PROPERTIES_SET}
    }
}`;

export const DELETE_BY_ID = gql`mutation DeleteMovieById($input: DeleteMovieInput!) {
  deleteMovie(input: $input) {
    movie {
      ${FULL_MOVIE_PROPERTIES_SET}
    }
    query {
      movies {
        totalCount
      }
    }
  }
}`;
