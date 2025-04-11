export interface IResponse<T> {
  data?: T;
  errorMessage?: string | string[];
  successMessage?: string;
}