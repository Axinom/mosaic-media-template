import { EntityTypeEnum } from 'zapatos/custom';
import { Table } from 'zapatos/schema';

export interface EntityListInfo {
  id: number;
  table: Table;
  type: EntityTypeEnum;
  title: string;
}
