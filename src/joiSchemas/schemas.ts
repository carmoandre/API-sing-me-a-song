import joi from "joi";

const addSchema = joi.object({
    name: joi.string().required(),
    youtubeLink: joi.string().required(),
});

const improveSchema = joi.object({
    id: joi.number().required(),
});

const amountSchema = joi.object({
    amount: joi.number().required().min(1),
});

export { addSchema, improveSchema, amountSchema };
