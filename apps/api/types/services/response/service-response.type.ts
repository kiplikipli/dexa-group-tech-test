import { HttpStatus } from '@nestjs/common';

export type TSuccessServiceResponse<TData = any> = {
  statusCode: HttpStatus;
  success: true;
  data: TData;
};

export type TErrorServiceResponse = {
  statusCode: HttpStatus;
  success: false;
  error: string;
};
