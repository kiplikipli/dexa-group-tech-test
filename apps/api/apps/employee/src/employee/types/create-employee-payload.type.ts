import { TAuthorizedServiceRequest } from 'types/services/request';

export type TCreateEmployeePayload = TAuthorizedServiceRequest<{
  name: string;
  email: string;
  phone: string;
  job_title: string;
  photo_url?: string;
}>;
