/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createOwnerPgPool, OwnerPgPool } from '@axinom/mosaic-db-common';
import { Logger, ShutdownAction } from '@axinom/mosaic-service-common';
import { count, sql, update } from 'zapatos/db';
import { getFullConfig } from '../common/config';

const logger = new Logger({
  context: 'update-publish-status-script',
});

type PublishStatus = 'PUBLISHED' | 'CHANGED';
type AssetType = 'MOVIE' | 'TVSHOW' | 'SEASON' | 'EPISODE' | 'COLLECTION';

/**
 * This is a script to update the publish status of movies, tv shows, seasons, episodes and collections.
 * It sets:
 * 1. publish_status to the specified status ('PUBLISHED' or 'CHANGED')
 * 2. published_date to current date
 * 3. published_user to 'SYSTEM'
 * 4. publishing_id to the value of external_id
 *
 * Local script call:
 * yarn util:load-vars node dist/_manual-repair-scripts/update-publish-status.js --status=PUBLISHED --asset-type=MOVIE
 * yarn util:load-vars node dist/_manual-repair-scripts/update-publish-status.js --status=CHANGED --asset-type=TVSHOW
 * yarn util:load-vars node dist/_manual-repair-scripts/update-publish-status.js --asset-type=EPISODE
 *
 * Arguments:
 * --status: 'PUBLISHED' or 'CHANGED' (defaults to 'PUBLISHED')
 * --asset-type: 'MOVIE', 'TVSHOW', 'SEASON', 'EPISODE', or 'COLLECTION' (if not provided, updates all asset types)
 */

// Parse command line arguments
function parseArgs(): { status: PublishStatus; assetType?: AssetType } {
  const args = process.argv.slice(2);
  let status: PublishStatus = 'PUBLISHED'; // Default value
  let assetType: AssetType | undefined = undefined; // Default to update all types

  for (const arg of args) {
    if (arg.startsWith('--status=')) {
      const providedStatus = arg.split('=')[1].toUpperCase();
      if (providedStatus === 'PUBLISHED' || providedStatus === 'CHANGED') {
        status = providedStatus as PublishStatus;
      } else {
        logger.warn(
          `Invalid status: ${providedStatus}. Using default: PUBLISHED`,
        );
      }
    } else if (arg.startsWith('--asset-type=')) {
      const providedAssetType = arg.split('=')[1].toUpperCase();
      if (
        ['MOVIE', 'TVSHOW', 'SEASON', 'EPISODE', 'COLLECTION'].includes(
          providedAssetType,
        )
      ) {
        assetType = providedAssetType as AssetType;
      } else {
        logger.warn(
          `Invalid asset type: ${providedAssetType}. Valid options are: MOVIE, TVSHOW, SEASON, EPISODE, COLLECTION`,
        );
      }
    }
  }

  return { status, assetType };
}
async function main(): Promise<void> {
  logger.log('Starting the publish status update script...');
  const config = getFullConfig();
  const shutdownActions: ShutdownAction[] = [];

  // Parse command-line arguments
  const { status, assetType } = parseArgs();
  logger.log(`Using publish status: ${status}`);

  if (assetType) {
    logger.log(`Updating only asset type: ${assetType}`);
  } else {
    logger.log('Updating all asset types');
  }

  logger.log('Creating DB connection...');
  const ownerPool = createOwnerPgPool(
    config.dbOwnerConnectionString,
    logger,
    shutdownActions,
  );

  // Run updates based on asset type filter
  if (!assetType) {
    // Update all asset types
    await updateMoviePublishStatus(ownerPool, status);
    await updateTvShowPublishStatus(ownerPool, status);
    await updateSeasonPublishStatus(ownerPool, status);
    await updateEpisodePublishStatus(ownerPool, status);
    await updateCollectionPublishStatus(ownerPool, status);
  } else {
    // Update specific asset type
    switch (assetType) {
      case 'MOVIE':
        await updateMoviePublishStatus(ownerPool, status);
        console.log('\n');
        break;
      case 'TVSHOW':
        await updateTvShowPublishStatus(ownerPool, status);
        console.log('\n');
        break;
      case 'SEASON':
        await updateSeasonPublishStatus(ownerPool, status);
        console.log('\n');
        break;
      case 'EPISODE':
        await updateEpisodePublishStatus(ownerPool, status);
        console.log('\n');
        break;
      case 'COLLECTION':
        await updateCollectionPublishStatus(ownerPool, status);
        console.log('\n');
        break;
    }
  }
  console.log('\n');

  for await (const shutdown of shutdownActions) {
    await shutdown();
  }

  logger.log('Publish status update script finished.');
}

async function updateMoviePublishStatus(
  ownerPool: OwnerPgPool,
  status: PublishStatus,
): Promise<void> {
  logger.log('Fetching movies...');
  const moviesCount = await count('movies', {
    publish_status: 'NOT_PUBLISHED',
  }).run(ownerPool);

  logger.log(`Found ${moviesCount} movies to update`);

  logger.log(`Updating movie publish status to ${status}...`);
  const result = await update(
    'movies',
    {
      publish_status: status,
      published_date: new Date(),
      published_user: 'SYSTEM',
      publishing_id: sql`'1-0-'||external_id`,
    },
    {
      publish_status: 'NOT_PUBLISHED',
    },
  ).run(ownerPool);

  logger.log(`Successfully updated ${result.length} movies to ${status}`);
}

async function updateTvShowPublishStatus(
  ownerPool: OwnerPgPool,
  status: PublishStatus,
): Promise<void> {
  logger.log('Fetching tv shows...');
  const tvShowsCount = await count('tvshows', {
    publish_status: 'NOT_PUBLISHED',
  }).run(ownerPool);

  logger.log(`Found ${tvShowsCount} tv shows to update`);

  logger.log(`Updating tv show publish status to ${status}...`);
  const result = await update(
    'tvshows',
    {
      publish_status: status,
      published_date: new Date(),
      published_user: 'SYSTEM',
      publishing_id: sql`'1-6-'||external_id`,
    },
    {
      publish_status: 'NOT_PUBLISHED',
    },
  ).run(ownerPool);

  logger.log(`Successfully updated ${result.length} tv shows to ${status}`);
}

async function updateSeasonPublishStatus(
  ownerPool: OwnerPgPool,
  status: PublishStatus,
): Promise<void> {
  logger.log('Fetching seasons...');
  const seasonsCount = await count('seasons', {
    publish_status: 'NOT_PUBLISHED',
  }).run(ownerPool);

  logger.log(`Found ${seasonsCount} seasons to update`);

  logger.log(`Updating season publish status to ${status}...`);
  const result = await update(
    'seasons',
    {
      publish_status: status,
      published_date: new Date(),
      published_user: 'SYSTEM',
      publishing_id: sql`'1-2-'||external_id`,
    },
    {
      publish_status: 'NOT_PUBLISHED',
    },
  ).run(ownerPool);

  logger.log(`Successfully updated ${result.length} seasons to ${status}`);
}

async function updateEpisodePublishStatus(
  ownerPool: OwnerPgPool,
  status: PublishStatus,
): Promise<void> {
  logger.log('Fetching episodes...');
  const episodesCount = await count('episodes', {
    publish_status: 'NOT_PUBLISHED',
  }).run(ownerPool);

  logger.log(`Found ${episodesCount} episodes to update`);

  logger.log(`Updating episode publish status to ${status}...`);
  const result = await update(
    'episodes',
    {
      publish_status: status,
      published_date: new Date(),
      published_user: 'SYSTEM',
      publishing_id: sql`'1-1-'||external_id`,
    },
    {
      publish_status: 'NOT_PUBLISHED',
    },
  ).run(ownerPool);

  logger.log(`Successfully updated ${result.length} episodes to ${status}`);
}

async function updateCollectionPublishStatus(
  ownerPool: OwnerPgPool,
  status: PublishStatus,
): Promise<void> {
  logger.log('Fetching collections...');
  const collectionsCount = await count('collections', {
    publish_status: 'NOT_PUBLISHED',
  }).run(ownerPool);

  logger.log(`Found ${collectionsCount} collections to update`);

  logger.log(`Updating collection publish status to ${status}...`);
  const result = await update(
    'collections',
    {
      publish_status: status,
      published_date: new Date(),
      published_user: 'SYSTEM',
      publishing_id: sql`'0-8-'||external_id`,
    },
    {
      publish_status: 'NOT_PUBLISHED',
    },
  ).run(ownerPool);

  logger.log(`Successfully updated ${result.length} collections to ${status}`);
}

main().catch((error) => {
  logger.error(error);
  process.exit(-1);
});
