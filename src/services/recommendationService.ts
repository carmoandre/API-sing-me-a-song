import * as recommendationRepository from "../repositories/recommendationRepository";

async function addNew(name: string, youtubeLink: string) {
    const recommendation = await recommendationRepository.getByNameOrLink(
        name,
        youtubeLink
    );
    console.log(recommendation);
    if (recommendation) return false;

    await recommendationRepository.addNew(name, youtubeLink);
    return true;
}

async function improveScore(id: number) {
    const recommendation = await recommendationRepository.getById(id);
    if (!recommendation) return false;

    await recommendationRepository.improveScore(id, recommendation.score++);
    return true;
}

export { addNew, improveScore };
