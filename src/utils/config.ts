export interface IConfig {
    OPEN_AI_KEY: string;
}

export const CONFIG = (): IConfig => ({
    OPEN_AI_KEY: process.env.OPEN_AI_KEY,
});