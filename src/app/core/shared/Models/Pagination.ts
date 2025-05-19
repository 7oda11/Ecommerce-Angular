import { IProduct } from "./Products";

export interface IPagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: IProduct[];
}


