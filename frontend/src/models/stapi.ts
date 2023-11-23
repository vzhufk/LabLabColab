export type StrapiData<T> = {
  id: number;
  attributes: Omit<T, 'id'>;
};

export type StrapiError = {
  statusCode: number;
};

export type StrapiBody<T> = {
  data: StrapiData<T>;
}