const pipe = (...functions) => (value) =>
  functions.reduce((result, currentFunction) => currentFunction(result), value);

export default pipe;
