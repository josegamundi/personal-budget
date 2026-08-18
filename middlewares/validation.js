export const validateRequiredFields = (schema, obj) => {
  return (req, res, next) => {
    try {
      const reqObj = req[obj];
      for (const item of schema) {
        if (reqObj[item.name] !== undefined) {
          if (typeof reqObj[item.name] !== item.type) {
            throw new Error(`Invalid data type for the '${item.name}' field`);
          }
          if (item.type === "string") {
            if (!reqObj[item.name].trim()) {
              throw new Error(`Empty string in the '${item.name}' field`);
            }
          }
          if (item.type === "number") {
            if (reqObj[item.name] <= 0) {
              throw new Error(`Invalid number in the '${item.name}' field`);
            }
          }
        } else if (item.required) {
          throw new Error(`The required field '${item.name}' is missing`);
        }
      }
      next();
    } catch(error) {
      res.status(400).json({ "message": error.message });
    }
  }
};

export const validateIdParam = (req, res, next) => {
  try {
    const idParam = Number(req.params.id);
    if (Number.isNaN(idParam)) {
      throw new Error("The 'id' paramater is not a number");
    }
    next();
  } catch(error) {
    res.status(400).json({ "message": error.message });
  }
};