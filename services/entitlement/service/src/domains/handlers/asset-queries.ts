import { gql } from '@apollo/client';
import { AssetTypeEnum } from '../../common';

export const catalogQueries = {
  [AssetTypeEnum.Movie]: gql`
    query GetMovie($id: String!) {
      asset: movie(id: $id) {
        id
        assetType
        businessType
        licenses {
          nodes {
            isDownloadable
            countries
            downloadedAssetLifespan
            startTime
            endTime
          }
        }
        videos {
          nodes {
            drmKeyId
            type
            isProtected
          }
        }
      }
    }
  `,
  [AssetTypeEnum.Episode]: gql`
    query GetEpisode($id: String!) {
      asset: episode(id: $id) {
        id
        assetType
        businessType
        licenses {
          nodes {
            isDownloadable
            countries
            downloadedAssetLifespan
            startTime
            endTime
          }
        }
        videos {
          nodes {
            drmKeyId
            type
            isProtected
          }
        }
      }
    }
  `,
};
