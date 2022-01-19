export abstract class PageRequest {
  protected constructor() {}

  pageNo = 1;
  pageSize = 10;

  getOffset(): number {
    return (this.pageNo - 1) * this.pageSize;
  }

  getLimit(): number {
    return this.pageSize;
  }
}
