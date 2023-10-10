/* eslint-disable no-console */
import { getValidatedConfig, pick } from '@axinom/mosaic-service-common';
import { connect } from 'amqplib';
import { getConfigDefinitions } from '../src/common';

async function main(): Promise<void> {
  const configDefinitions = pick(
    getConfigDefinitions(),
    'rmqProtocol',
    'rmqHost',
    'rmqPort',
    'rmqUser',
    'rmqPassword',
    'rmqVHost',
    'serviceId',
  );
  const config = getValidatedConfig(configDefinitions);
  const amqp = await connect(
    {
      protocol: config.rmqProtocol,
      hostname: config.rmqHost,
      port: config.rmqPort,
      username: config.rmqUser,
      password: config.rmqPassword,
      vhost: config.rmqVHost,
    },
    {
      connection_name: 'migrate-rabbitmq-for-video-service-renaming',
    },
  );
  const channel = await amqp.createChannel();

  // delete obsolete queues
  await channel.deleteQueue('ax-encoding-service:cue_point_types:declare');
  await channel.deleteQueue('ax-encoding-service:video:ensure_exists');

  // remove obsolete bindings
  await channel.unbindQueue(
    'media-service:video:ensure_exists_already_existed',
    'event',
    'ax-encoding-service.*.*.video.ensure_exists_already_existed',
  );
  await channel.unbindQueue(
    'media-service:video:ensure_exists_creation_started',
    'event',
    'ax-encoding-service.*.*.video.ensure_exists_creation_started',
  );
  await channel.unbindQueue(
    'media-service:video:ensure_exists_failed',
    'event',
    'ax-encoding-service.*.*.video.ensure_exists_failed',
  );
  await channel.unbindQueue(
    'media-service:cue_point_types:declared',
    'event',
    'ax-encoding-service.*.*.cue_point_types.declared',
  );
  await channel.unbindQueue(
    'media-service:cue_point_types:declare_failed',
    'event',
    'ax-encoding-service.*.*.cue_point_types.declare_failed',
  );

  channel.close();
  amqp.close();
  console.log('Migration finished.');
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
