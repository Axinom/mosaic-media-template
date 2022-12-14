import {
  Column,
  DateRenderer,
  ExplorerDataProvider,
  NavigationExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  ReviewsDocument,
  ReviewsOrderBy,
  ReviewsQuery,
  ReviewsQueryVariables,
} from '../../../generated/graphql';

type ReviewData = NonNullable<ReviewsQuery['filtered']>['nodes'][number];

export const ReviewsExplorer: React.FC = () => {
  const history = useHistory();

  // Columns
  const explorerColumns: Column<ReviewData>[] = [
    { label: 'Title', propertyName: 'title' },
    { label: 'Rating', propertyName: 'rating' },
    { label: 'Created At', propertyName: 'createdDate', render: DateRenderer },
    { label: 'Updated At', propertyName: 'updatedDate', render: DateRenderer },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<ReviewData> = {
    loadData: async ({ pagingInformation, sorting }) => {
      const result = await client.query<ReviewsQuery, ReviewsQueryVariables>({
        query: ReviewsDocument,
        variables: {
          orderBy: sortToPostGraphileOrderBy(sorting, ReviewsOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.filtered?.nodes ?? [],
        totalCount: result.data.nonFiltered?.totalCount as number,
        filteredCount: result.data.filtered?.totalCount as number,
        hasMoreData: result.data.filtered?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.filtered?.pageInfo.endCursor,
      };
    },
  };

  return (
    <NavigationExplorer<ReviewData>
      title="Reviews"
      stationKey="ReviewsExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      onCreateAction={() => {
        history.push(`/reviews/create`);
      }}
      calculateNavigateUrl={({ id }) => {
        return `/reviews/${id}`;
      }}
    />
  );
};
