import { ValidationError } from 'class-validator';
import { iterate } from 'iterare';

export function flattenValidationErrors(
  validationErrors: ValidationError[],
): string[] {
  return iterate(validationErrors)
    .map((error) => mapChildrenToValidationErrors(error))
    .flatten()
    .filter((item) => !!item.constraints)
    .map((item) => Object.values(item.constraints))
    .flatten()
    .toArray() as string[];
}

function mapChildrenToValidationErrors(
  error: ValidationError,
): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  const validationErrors = [];
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item));
    }
    validationErrors.push(prependConstraintsWithParentProp(error, item));
  }
  return validationErrors;
}

function prependConstraintsWithParentProp(
  parentError: ValidationError,
  error: ValidationError,
): ValidationError {
  const constraints = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentError.property}.${error.constraints[key]}`;
  }
  return {
    ...error,
    constraints,
  };
}
