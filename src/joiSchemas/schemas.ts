import joi from "joi";

const addSchema = joi.object({
    name: joi.string().required(),
    youtubeLink: joi.string().required(),
});

const improveSchema = joi.object({
    id: joi.number().required(),
});

export { addSchema, improveSchema };
