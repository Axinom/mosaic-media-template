import { gql } from '@apollo/client';
import { AssetTypeEnum } from '../../common';

export const catalogQueries = {
  [AssetTypeEnum.Movie]: gql`
    query GetMovie($id: String!) {
      asset: movie(id: $id) {
        videos {
          nodes {
            drmKeyId
            type
          }
        }
        licenses {
          nodes {
            isDownloadable
            countries
            downloadedAssetLifespan
            startTime
            endTime
          }
        }
      }
    }
  `,
  [AssetTypeEnum.Episode]: gql`
    query GetEpisode($id: String!) {
      asset: episode(id: $id) {
        videos {
          nodes {
            drmKeyId
            type
          }
        }
        licenses {
          nodes {
            isDownloadable
            countries
            downloadedAssetLifespan
            startTime
            endTime
          }
        }
      }
    }
  `,
  // TODO: Add more queries for other asset types....
};
