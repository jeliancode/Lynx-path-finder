import validateWith from './validator.js';
import pipe from '../shared/funtional/pipe.js';
import { unprocessableEntityError } from '../shared/error/httpError.js';
import { hasValidName, hasValidEmail, hasValidPassword } from './entirtyRules.js';

const validateUserData = pipe(
    validateWith(hasValidName, () => unprocessableEntityError('User must have a valid username')),
    validateWith(hasValidEmail, () => unprocessableEntityError('User must have a valid email address')),
    validateWith(hasValidPassword, () => unprocessableEntityError('User must have a valid password of at least 8 characters'))
);

export default validateUserData;
