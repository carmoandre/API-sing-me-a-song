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

/*
export function validateYouTubeUrl(youtubeLink: string) {
  if (youtubeLink) {
    const regExp =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (youtubeLink.match(regExp)) {
      return true;
    }
  }
  return false;
}
*/
