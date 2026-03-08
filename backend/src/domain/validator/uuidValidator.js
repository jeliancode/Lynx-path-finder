export const isValidUUID = (uuid) => {
  const parts = uuid.split('-');
  if (parts.length !== 5) return false;
  
  const validateBlock = (index) => {
    if (index >= parts.length) return true;
    const regex = /^[0-9a-f]+$/i;
    if (!regex.test(parts[index])) return false;
    return validateBlock(index + 1);
  };
  
  return validateBlock(0);
};
