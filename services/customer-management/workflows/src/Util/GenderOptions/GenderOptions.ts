import { pascalCase } from 'pascal-case';

enum genderOptions {
  unknown = 'unknown',
  male = 'male',
  female = 'female',
}

export const GenderOptions = Object.keys(genderOptions).map((key) => ({
  value: genderOptions[key],
  label: pascalCase(genderOptions[key]),
}));

export const getGenderIndex = (genderKey: string): number => {
  return Object.keys(genderOptions).indexOf(genderKey);
};
