export interface OrgRegistrationForm {
  acceptTerms: boolean;
  contactFax?: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  secondaryEmail?: string;
}

export interface OrgRegistrationPayload extends OrgRegistrationForm {
  duration: number;
}
