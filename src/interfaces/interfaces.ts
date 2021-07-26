import { recommendationBody } from "../../tests/factories/recommendationFactory";

interface Recommendation {
    id: number;
    name: string;
    youtubeLink: string;
    score: number;
}

interface AddInput {
    name: string;
    youtubeLink: string;
}

export { Recommendation, AddInput };
