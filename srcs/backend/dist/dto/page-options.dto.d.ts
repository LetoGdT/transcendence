export declare enum Order {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class PageOptionsDto {
    order?: Order;
    page?: number;
    take?: number;
    get skip(): number;
}
