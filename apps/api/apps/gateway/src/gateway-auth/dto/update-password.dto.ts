import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordRequest {
  @IsNotEmpty()
  oldPassword: string;
  @IsNotEmpty()
  newPassword: string;
  @IsNotEmpty()
  confirmNewPassword: string;
}
