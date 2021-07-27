import * as recommendationRepository from "../repositories/recommendationRepository";
import { Recommendation } from "../interfaces/interfaces";

async function addNew(name: string, youtubeLink: string): Promise<boolean> {
    const recommendation = await recommendationRepository.getByNameOrLink(
        name,
        youtubeLink
    );
    if (recommendation) return false;

    await recommendationRepository.addNew(name, youtubeLink);
    return true;
}

async function alterScore(id: number, upOrDown: string): Promise<boolean> {
    const recommendation = await recommendationRepository.getById(id);
    if (!recommendation) return false;
    const score = recommendation.score;

    if (score === -5 && upOrDown === "downvote") {
        await recommendationRepository.deleteById(id);
        return false;
    }

    const newValue =
        upOrDown === "upvote"
            ? recommendation.score + 1
            : recommendation.score - 1;

    await recommendationRepository.alterScore(id, newValue);

    return true;
}

async function random(): Promise<Recommendation[]> {
    const randomPercentage = Math.floor(Math.random() * 10 + 1);
    const recommendationByPercentage =
        await recommendationRepository.getRandomByPercentage(randomPercentage);

    if (!recommendationByPercentage.length) {
        const freeRandomRecommendation =
            await recommendationRepository.getRandom();
        return freeRandomRecommendation;
    }

    return recommendationByPercentage;
}

async function amountTop(amount: number): Promise<Recommendation[]> {
    const recommendation = await recommendationRepository.amountTop(amount);
    return recommendation;
}

export { addNew, alterScore, random, amountTop };
