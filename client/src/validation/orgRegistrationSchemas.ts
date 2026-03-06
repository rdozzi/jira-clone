import LeoProfanity from 'leo-profanity';

const filter = LeoProfanity;
const badWordsList = filter.list();

const organizationNameRegex = /^[\p{L}\p{N}\s\-_.,"'!?():;]+$/u;

// Name schema
export const nameValidationRules = [
  {
    required: true,
    message: 'Name is required',
  },
  {
    min: 2,
    message: 'Name should be at least 2 characters',
  },
  {
    max: 150,
    message: 'Name cannot exceed 150 characters',
  },
  {
    pattern: /^[\p{L}0-9 _'-]+$/u,
    message: 'Name contains invalid characters',
  },
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();

      // Prevent consecutive spaces
      if (/\s{2,}/.test(value)) {
        return Promise.reject(
          new Error('Name must not contain consecutive spaces'),
        );
      }

      // Prohibited words check
      const tokens = value.toLowerCase().split(/\s+/);

      if (
        tokens.some((token) =>
          badWordsList.some((word) => token === word.toLowerCase()),
        )
      ) {
        return Promise.reject(new Error('Name contains prohibited language'));
      }

      return Promise.resolve();
    },
  },
];

// Organization name schema
export const organizationNameRules = [
  {
    required: true,
    message: 'Organization name is required',
  },
  {
    min: 3,
    message: 'Organization name must be at least 3 characters',
  },
  {
    max: 150,
    message: 'Organization name cannot exceed 150 characters',
  },
  {
    pattern: organizationNameRegex,
    message:
      'Organization name contains invalid characters. Only letters, numbers, spaces, hyphens, and underscores are allowed.',
  },
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();

      const tokens = value.toLowerCase().split(/\s+/);

      if (
        tokens.some((token) =>
          badWordsList.some((word) => token === word.toLowerCase()),
        )
      ) {
        return Promise.reject(
          new Error('Organization name contains prohibited language'),
        );
      }

      return Promise.resolve();
    },
  },
];
