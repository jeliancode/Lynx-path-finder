import { isValidUUID } from '../domain/validator/uuidValidator.js';

export const validateUUID = (field = 'id',) => 
  (req, res, next) => {

    const { [field]: value } = req.params;

    if (!value || !isValidUUID(value)) {
      return res.status(400).json({
        error: 'Formato inválido del ID.'
      });
    }

    next();
};
