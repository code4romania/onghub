export interface BusinessException<T> {
  message: string;
  errorCode: T;
}
