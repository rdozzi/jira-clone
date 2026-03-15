export interface ForgotPasswordPayload {
  email: string;
  contactFax?: string;
  secondaryEmail?: string;
}

export interface ChangePasswordPayload {
  newPassword: string;
  confirmPassword: string;
  token: string;
}
