export type TLoginRequest = {
  username: string;
  password: string;
  isAdminOnly: boolean;
};

export type TValidateTokenRequest = {
  token: string;
};

export type TGetUserRequest = {
  token: string;
};
