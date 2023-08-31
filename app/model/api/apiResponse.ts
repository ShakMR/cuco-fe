interface APIResponse<k> {
  data: k;
  meta: MetaResponse;
}

type MetaResponse = {
  links: LinksMetaResponse;
  pagination: PaginationMetaResponse;
}

type LinksMetaResponse = {
  self: string;
  parent?: string;
  list?: string;
}

type PaginationMetaResponse = {
  totalItems: number;
  next: string | null;
  previous: string;
  quantity: number;
}

export default APIResponse;
