import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('ID')
  phone: string;

  @IsNotEmpty()
  job_title: string;
  photo_profile?: string;
}
