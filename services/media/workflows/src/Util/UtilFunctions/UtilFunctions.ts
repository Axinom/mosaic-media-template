export const ValidateRating = (value: string): boolean => {
  return value.trim() === ''
    ? false
    : isNaN(parseFloat(value)) ||
        parseFloat(value) < 0 ||
        parseFloat(value) > 100 ||
        !/^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/.test(value);
};
