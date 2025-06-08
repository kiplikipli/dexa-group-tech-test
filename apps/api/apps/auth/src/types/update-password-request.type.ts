export type TUpdatePasswordRequest = {
  userId: number;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
