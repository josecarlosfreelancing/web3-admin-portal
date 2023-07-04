import { User } from "./user.model";

export interface Pagination {
    perPage?: number;
    page?: number;
    totalPages?: number;
    nextPage?: number;
    prevPage?: number;
    list?: any[] | User[];
    search?: string;
}
