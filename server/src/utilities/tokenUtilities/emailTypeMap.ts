// hbs and txt fileNames are mapped from the tokenServices/templates folder
import { TokenPurpose } from '@prisma/client';

export type HbsType = 'resetPassword' | 'activateAccount';
export type HbsTextType = 'resetPasswordText' | 'activateAccountText';

export const emailTypeMap: Record<
  TokenPurpose,
  { hbs: HbsType; text: HbsTextType }
> = {
  RESET_PASSWORD: { hbs: 'resetPassword', text: 'resetPasswordText' },
  ACCOUNT_ACTIVATION: { hbs: 'activateAccount', text: 'activateAccountText' },
  ACCOUNT_INVITE: { hbs: 'activateAccount', text: 'activateAccountText' },
};
