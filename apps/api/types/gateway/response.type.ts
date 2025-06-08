export type TGlobalResponse = TSuccessResponse | TErrorResponse;

export type TSuccessResponse<TResponse = any> = {
  success: true;
  data: TResponse;
};

export type TErrorResponse = {
  success: false;
  error: string;
};
