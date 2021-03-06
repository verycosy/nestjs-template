import * as Joi from 'joi';

const RdsValidationSchema = {
  RDS_HOST: Joi.string().required(),
  RDS_PORT: Joi.number().required(),
  RDS_USERNAME: Joi.string().required(),
  RDS_PASSWORD: Joi.string().required(),
  RDS_DATABASE: Joi.string().required(),
};

const redisValidationSchema = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
};

const jwtValidationSchema = {
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
};

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('local', 'test', 'development', 'production')
    .default('local'),
  PORT: Joi.number().default(3001),
  ...RdsValidationSchema,
  ...redisValidationSchema,
  ...jwtValidationSchema,
});
