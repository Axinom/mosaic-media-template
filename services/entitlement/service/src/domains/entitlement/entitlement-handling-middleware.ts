import { gql } from '@apollo/client';
import { Express } from 'express';
import { Config, getApolloClient } from '../../common';

export function setupEntitlementRequestHandling(
  app: Express,
  route: string,
  config: Config,
): void {
  app.post(route, async function (req, res) {
    const client = await getApolloClient(config);
    const input = req.body;
    if (!input.asset_id || input.asset_id.length < 1) {
      return res.status(400).send({
        success: false,
        message: `Asset ID should not be empty`,
      });
    }
    // TODO: add missing DRM configurations (communication key, communication key ID) to /src/common/config/config-definitions.ts (follow the pattern there), also to .env.template and to .env
    // get DRM token generation algorithm from InternalDeviceEntitlementProvider.cs and AxinomDrmTokenProvider.cs
    // pay attention that _options.DrmMessageOptions is basically a set of defaults such as expiration, etc.
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
      return res.send({
        success: true,
        message: 'OK',
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
  });
}
