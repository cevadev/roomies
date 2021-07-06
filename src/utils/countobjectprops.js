const countObjectProperties = (obj) => {
  // validamos que el obj sea de tipo object
  if (typeof obj === "object") {
    // retornar el conteo de propiedades que posee el obj
    return Object.keys(obj).length;
  }
  // si no es tipo object return 0
  return 0;
};

export default countObjectProperties;
