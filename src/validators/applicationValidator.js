import Joi from 'joi';

export const applicationSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().required(),
});

export const updateApplicationSchema = Joi.object({
  user_id: Joi.string(),
  job_id: Joi.string(),
  status: Joi.string(),
});
