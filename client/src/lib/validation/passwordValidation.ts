// The validation schema here should be identical to the backend zod schema.

export const passwordValidation = [
  { required: true, message: 'A password is required' },
  { min: 8, message: 'Password should be at least 8 characters' },
  {
    max: 128,
    message: "Password can't be more than 128 characters",
  },
  {
    pattern: /[A-Z]/,
    message: 'Must contain at least one uppercase letter',
  },
  {
    pattern: /[a-z]/,
    message: 'Must contain at least one lowercase letter',
  },
  { pattern: /\d/, message: 'Must contain at least one number' },
  {
    pattern: /[^A-Za-z0-9]/,
    message: 'Must contain at least one special character',
  },
];
