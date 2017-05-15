export interface Pagination<T> {
    docs: T[];
    total
    limit;
    page;
    pages;
}
