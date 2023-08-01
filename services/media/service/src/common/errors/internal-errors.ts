export const InternalErrors = {
  UnsupportedReplicationTable: {
    message:
      'The logical replication event for the table "%s" was received, but an explicit handling for it has not been added.',
    code: 'UNSUPPORTED_REPLICATION_TABLE',
  },
  UnsupportedReplicationOperation: {
    message:
      'The logical replication event for the operation "%s" was received, but an explicit handling for it has not been added.',
    code: 'UNSUPPORTED_REPLICATION_OPERATION',
  },
  ReplicaDataNotFound: {
    message:
      'The data was not provided for the table "%s". Have you set `REPLICA IDENTITY full` for it?',
    code: 'REPLICA_DATA_NOT_FOUND',
  },
  ReplicaColumnNotFound: {
    message:
      'The column "%s" of the table "%s" is required for localization, but was not found.',
    code: 'REPLICA_COLUMN_NOT_FOUND',
  },
} as const;
