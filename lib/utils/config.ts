export let API_URL = '';
export let VIDEO_IMAGE = '';
export let EMPTY_IMAGE = '';
export let ERROR_IMAGE = '';
export let ERROR_EMBED = '';

export type TConfig = {
    api_url?: string;
    video_image?: string;
    empty_image?: string;
    error_image?: string;
    error_embed?: string;
}

export const setConfig = (config: TConfig) => {
    API_URL = config.api_url ?? API_URL;
    VIDEO_IMAGE = config.video_image ?? VIDEO_IMAGE;
    EMPTY_IMAGE = config.empty_image ?? EMPTY_IMAGE;
    ERROR_IMAGE = config.error_image ?? ERROR_IMAGE;
    ERROR_EMBED = config.error_embed ?? ERROR_EMBED;
};
