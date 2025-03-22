const Joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(), // Changed this to "email" for clarity
    password: Joi.string().max(100).required(), // Password validation
    otp: Joi.string().max(5),
    photo: Joi.string().uri().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad Request", error });
  }
  next();
};

module.exports = {
  signupValidation,
};
