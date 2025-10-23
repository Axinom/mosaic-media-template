import {
  Mutations as M,
  Queries as Q,
} from '../../generated/graphql/operations';

export const AudioBooksReadOperations = [
  Q.audioBook,
  Q.audioBooks,
  Q.audioBooksTag,
  Q.audioBooksTags,
  Q.getAudioBooksTagsValues,
];

export const AudioBooksMutateOperations = [
  M.createAudioBook,
  M.createAudioBooksTag,
  M.updateAudioBook,
  M.updateAudioBooksTag,
  M.deleteAudioBook,
  M.deleteAudioBooksTag,
];
