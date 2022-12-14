export enum Mutations {
  createCollection = 'createCollection',
  createCollectionRelation = 'createCollectionRelation',
  createCollectionSnapshot = 'createCollectionSnapshot',
  createCollectionSnapshots = 'createCollectionSnapshots',
  createCollectionsImage = 'createCollectionsImage',
  createCollectionsTag = 'createCollectionsTag',
  createEpisode = 'createEpisode',
  createEpisodeSnapshot = 'createEpisodeSnapshot',
  createEpisodeSnapshots = 'createEpisodeSnapshots',
  createEpisodesCast = 'createEpisodesCast',
  createEpisodesImage = 'createEpisodesImage',
  createEpisodesLicense = 'createEpisodesLicense',
  createEpisodesLicensesCountry = 'createEpisodesLicensesCountry',
  createEpisodesProductionCountry = 'createEpisodesProductionCountry',
  createEpisodesTag = 'createEpisodesTag',
  createEpisodesTrailer = 'createEpisodesTrailer',
  createEpisodesTvshowGenre = 'createEpisodesTvshowGenre',
  createMovie = 'createMovie',
  createMovieGenre = 'createMovieGenre',
  createMovieGenresSnapshot = 'createMovieGenresSnapshot',
  createMovieSnapshot = 'createMovieSnapshot',
  createMovieSnapshots = 'createMovieSnapshots',
  createMoviesCast = 'createMoviesCast',
  createMoviesImage = 'createMoviesImage',
  createMoviesLicense = 'createMoviesLicense',
  createMoviesLicensesCountry = 'createMoviesLicensesCountry',
  createMoviesMovieGenre = 'createMoviesMovieGenre',
  createMoviesProductionCountry = 'createMoviesProductionCountry',
  createMoviesTag = 'createMoviesTag',
  createMoviesTrailer = 'createMoviesTrailer',
  createReview = 'createReview',
  createSeason = 'createSeason',
  createSeasonSnapshot = 'createSeasonSnapshot',
  createSeasonSnapshots = 'createSeasonSnapshots',
  createSeasonsCast = 'createSeasonsCast',
  createSeasonsImage = 'createSeasonsImage',
  createSeasonsLicense = 'createSeasonsLicense',
  createSeasonsLicensesCountry = 'createSeasonsLicensesCountry',
  createSeasonsProductionCountry = 'createSeasonsProductionCountry',
  createSeasonsTag = 'createSeasonsTag',
  createSeasonsTrailer = 'createSeasonsTrailer',
  createSeasonsTvshowGenre = 'createSeasonsTvshowGenre',
  createTvshow = 'createTvshow',
  createTvshowGenre = 'createTvshowGenre',
  createTvshowGenresSnapshot = 'createTvshowGenresSnapshot',
  createTvshowSnapshot = 'createTvshowSnapshot',
  createTvshowSnapshots = 'createTvshowSnapshots',
  createTvshowsCast = 'createTvshowsCast',
  createTvshowsImage = 'createTvshowsImage',
  createTvshowsLicense = 'createTvshowsLicense',
  createTvshowsLicensesCountry = 'createTvshowsLicensesCountry',
  createTvshowsProductionCountry = 'createTvshowsProductionCountry',
  createTvshowsTag = 'createTvshowsTag',
  createTvshowsTrailer = 'createTvshowsTrailer',
  createTvshowsTvshowGenre = 'createTvshowsTvshowGenre',
  deleteCollection = 'deleteCollection',
  deleteCollectionByExternalId = 'deleteCollectionByExternalId',
  deleteCollectionRelation = 'deleteCollectionRelation',
  deleteCollectionRelationByCollectionIdAndSortOrder = 'deleteCollectionRelationByCollectionIdAndSortOrder',
  deleteCollectionRelations = 'deleteCollectionRelations',
  deleteCollections = 'deleteCollections',
  deleteCollectionsImageByCollectionIdAndImageType = 'deleteCollectionsImageByCollectionIdAndImageType',
  deleteCollectionsTag = 'deleteCollectionsTag',
  deleteEpisode = 'deleteEpisode',
  deleteEpisodeByExternalId = 'deleteEpisodeByExternalId',
  deleteEpisodes = 'deleteEpisodes',
  deleteEpisodesCast = 'deleteEpisodesCast',
  deleteEpisodesImageByEpisodeIdAndImageType = 'deleteEpisodesImageByEpisodeIdAndImageType',
  deleteEpisodesLicense = 'deleteEpisodesLicense',
  deleteEpisodesLicenses = 'deleteEpisodesLicenses',
  deleteEpisodesLicensesCountry = 'deleteEpisodesLicensesCountry',
  deleteEpisodesProductionCountry = 'deleteEpisodesProductionCountry',
  deleteEpisodesTag = 'deleteEpisodesTag',
  deleteEpisodesTrailer = 'deleteEpisodesTrailer',
  deleteEpisodesTvshowGenre = 'deleteEpisodesTvshowGenre',
  deleteMovie = 'deleteMovie',
  deleteMovieByExternalId = 'deleteMovieByExternalId',
  deleteMovieGenre = 'deleteMovieGenre',
  deleteMovieGenreBySortOrder = 'deleteMovieGenreBySortOrder',
  deleteMovieGenres = 'deleteMovieGenres',
  deleteMovies = 'deleteMovies',
  deleteMoviesCast = 'deleteMoviesCast',
  deleteMoviesImageByMovieIdAndImageType = 'deleteMoviesImageByMovieIdAndImageType',
  deleteMoviesLicense = 'deleteMoviesLicense',
  deleteMoviesLicenses = 'deleteMoviesLicenses',
  deleteMoviesLicensesCountry = 'deleteMoviesLicensesCountry',
  deleteMoviesMovieGenre = 'deleteMoviesMovieGenre',
  deleteMoviesProductionCountry = 'deleteMoviesProductionCountry',
  deleteMoviesTag = 'deleteMoviesTag',
  deleteMoviesTrailer = 'deleteMoviesTrailer',
  deleteReview = 'deleteReview',
  deleteSeason = 'deleteSeason',
  deleteSeasonByExternalId = 'deleteSeasonByExternalId',
  deleteSeasons = 'deleteSeasons',
  deleteSeasonsCast = 'deleteSeasonsCast',
  deleteSeasonsImageBySeasonIdAndImageType = 'deleteSeasonsImageBySeasonIdAndImageType',
  deleteSeasonsLicense = 'deleteSeasonsLicense',
  deleteSeasonsLicenses = 'deleteSeasonsLicenses',
  deleteSeasonsLicensesCountry = 'deleteSeasonsLicensesCountry',
  deleteSeasonsProductionCountry = 'deleteSeasonsProductionCountry',
  deleteSeasonsTag = 'deleteSeasonsTag',
  deleteSeasonsTrailer = 'deleteSeasonsTrailer',
  deleteSeasonsTvshowGenre = 'deleteSeasonsTvshowGenre',
  deleteSnapshot = 'deleteSnapshot',
  deleteSnapshots = 'deleteSnapshots',
  deleteTvshow = 'deleteTvshow',
  deleteTvshowByExternalId = 'deleteTvshowByExternalId',
  deleteTvshowGenre = 'deleteTvshowGenre',
  deleteTvshowGenreBySortOrder = 'deleteTvshowGenreBySortOrder',
  deleteTvshowGenres = 'deleteTvshowGenres',
  deleteTvshows = 'deleteTvshows',
  deleteTvshowsCast = 'deleteTvshowsCast',
  deleteTvshowsImageByTvshowIdAndImageType = 'deleteTvshowsImageByTvshowIdAndImageType',
  deleteTvshowsLicense = 'deleteTvshowsLicense',
  deleteTvshowsLicenses = 'deleteTvshowsLicenses',
  deleteTvshowsLicensesCountry = 'deleteTvshowsLicensesCountry',
  deleteTvshowsProductionCountry = 'deleteTvshowsProductionCountry',
  deleteTvshowsTag = 'deleteTvshowsTag',
  deleteTvshowsTrailer = 'deleteTvshowsTrailer',
  deleteTvshowsTvshowGenre = 'deleteTvshowsTvshowGenre',
  populateCollections = 'populateCollections',
  populateMovies = 'populateMovies',
  populateTvshows = 'populateTvshows',
  publishCollection = 'publishCollection',
  publishCollections = 'publishCollections',
  publishEpisode = 'publishEpisode',
  publishEpisodes = 'publishEpisodes',
  publishMovie = 'publishMovie',
  publishMovieGenres = 'publishMovieGenres',
  publishMovies = 'publishMovies',
  publishSeason = 'publishSeason',
  publishSeasons = 'publishSeasons',
  publishSnapshot = 'publishSnapshot',
  publishSnapshots = 'publishSnapshots',
  publishTvshow = 'publishTvshow',
  publishTvshowGenres = 'publishTvshowGenres',
  publishTvshows = 'publishTvshows',
  recreateSnapshots = 'recreateSnapshots',
  startIngest = 'startIngest',
  unpublishCollection = 'unpublishCollection',
  unpublishCollections = 'unpublishCollections',
  unpublishEpisode = 'unpublishEpisode',
  unpublishEpisodes = 'unpublishEpisodes',
  unpublishMovie = 'unpublishMovie',
  unpublishMovieGenres = 'unpublishMovieGenres',
  unpublishMovies = 'unpublishMovies',
  unpublishSeason = 'unpublishSeason',
  unpublishSeasons = 'unpublishSeasons',
  unpublishSnapshot = 'unpublishSnapshot',
  unpublishSnapshots = 'unpublishSnapshots',
  unpublishTvshow = 'unpublishTvshow',
  unpublishTvshowGenres = 'unpublishTvshowGenres',
  unpublishTvshows = 'unpublishTvshows',
  updateCollection = 'updateCollection',
  updateCollectionByExternalId = 'updateCollectionByExternalId',
  updateCollectionRelation = 'updateCollectionRelation',
  updateCollectionRelationByCollectionIdAndSortOrder = 'updateCollectionRelationByCollectionIdAndSortOrder',
  updateCollectionsImageByCollectionIdAndImageType = 'updateCollectionsImageByCollectionIdAndImageType',
  updateCollectionsTag = 'updateCollectionsTag',
  updateEpisode = 'updateEpisode',
  updateEpisodeByExternalId = 'updateEpisodeByExternalId',
  updateEpisodesCast = 'updateEpisodesCast',
  updateEpisodesImageByEpisodeIdAndImageType = 'updateEpisodesImageByEpisodeIdAndImageType',
  updateEpisodesLicense = 'updateEpisodesLicense',
  updateEpisodesLicensesCountry = 'updateEpisodesLicensesCountry',
  updateEpisodesProductionCountry = 'updateEpisodesProductionCountry',
  updateEpisodesTag = 'updateEpisodesTag',
  updateIngestDocument = 'updateIngestDocument',
  updateMovie = 'updateMovie',
  updateMovieByExternalId = 'updateMovieByExternalId',
  updateMovieGenre = 'updateMovieGenre',
  updateMovieGenreBySortOrder = 'updateMovieGenreBySortOrder',
  updateMoviesCast = 'updateMoviesCast',
  updateMoviesImageByMovieIdAndImageType = 'updateMoviesImageByMovieIdAndImageType',
  updateMoviesLicense = 'updateMoviesLicense',
  updateMoviesLicensesCountry = 'updateMoviesLicensesCountry',
  updateMoviesProductionCountry = 'updateMoviesProductionCountry',
  updateMoviesTag = 'updateMoviesTag',
  updateReview = 'updateReview',
  updateSeason = 'updateSeason',
  updateSeasonByExternalId = 'updateSeasonByExternalId',
  updateSeasonsCast = 'updateSeasonsCast',
  updateSeasonsImageBySeasonIdAndImageType = 'updateSeasonsImageBySeasonIdAndImageType',
  updateSeasonsLicense = 'updateSeasonsLicense',
  updateSeasonsLicensesCountry = 'updateSeasonsLicensesCountry',
  updateSeasonsProductionCountry = 'updateSeasonsProductionCountry',
  updateSeasonsTag = 'updateSeasonsTag',
  updateTvshow = 'updateTvshow',
  updateTvshowByExternalId = 'updateTvshowByExternalId',
  updateTvshowGenre = 'updateTvshowGenre',
  updateTvshowGenreBySortOrder = 'updateTvshowGenreBySortOrder',
  updateTvshowsCast = 'updateTvshowsCast',
  updateTvshowsImageByTvshowIdAndImageType = 'updateTvshowsImageByTvshowIdAndImageType',
  updateTvshowsLicense = 'updateTvshowsLicense',
  updateTvshowsLicensesCountry = 'updateTvshowsLicensesCountry',
  updateTvshowsProductionCountry = 'updateTvshowsProductionCountry',
  updateTvshowsTag = 'updateTvshowsTag'
}