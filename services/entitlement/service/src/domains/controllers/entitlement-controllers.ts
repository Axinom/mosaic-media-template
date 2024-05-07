import { gql } from '@apollo/client';
import { Request, Response } from 'express';
import {
  EntitlementTokenProvider,
  getApolloClient,
  getFullConfig,
  MosaicDrmOptions,
} from '../../common';

const config = getFullConfig();

export const EntitlementRequestHandling = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const client = await getApolloClient(config);
  const input = req.body;
  if (!input.asset_id || input.asset_id.length < 1) {
    return res.status(400).send({
      success: false,
      message: `Asset ID should not be empty`,
    });
  }

  try {
    const results = await client.query({
      query: gql`
        query GetMovie($id: String!) {
          movie(id: $id) {
            videos {
              nodes {
                drmKeyId
                type
              }
            }
          }
        }
      `,
      variables: { id: input.asset_id },
    });
    const videos = results?.data?.movie?.videos?.nodes;
    if (!videos || videos.length < 1) {
      return res.status(404).send({
        success: false,
        message: 'Movie or its DRM keys not found',
      });
    }
    const mainVideo = videos.find((v: { type: string }) => v.type === 'MAIN');
    if (!mainVideo) {
      return res.status(404).send({
        success: false,
        message: 'Movie or its DRM keys not found',
      });
    }

    const drmMosaicOptions = new MosaicDrmOptions();
    drmMosaicOptions.mosaicDrmCommunicationKey =
      config.drmLicenseCommunicationKey;
    drmMosaicOptions.mosaicDrmCommunicationKeyId =
      config.drmLicenseCommunicationKeyId;

    const _axinomEntitlementTokenProvider = new EntitlementTokenProvider(
      drmMosaicOptions,
    );

    const token = _axinomEntitlementTokenProvider.getToken(
      true,
      30,
      mainVideo.drmKeyId,
    );
    return res.send({
      success: true,
      message: 'OK',
      token,
      value: mainVideo.drmKeyId,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
    return res.status(500).send({
      code: 'UNHANDLED_SERVER_ERROR',
      details: error,
    });
  }
};
