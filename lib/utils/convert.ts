import { DOMParser as Parser } from "prosemirror-model";
import { schema, simpleSchema } from "../prose/schema";

const EMPTY = '{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"@"}]}]}';
const ERROR = '{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"При парсинге документа произошла ошибка"}]}]}';

/**
 * Конвертация документа в формате HTML в формат Prose
 * @param html строка с документом в формате HTML
 * @param simple флаг того что надо использовать упрощенную схему документа
 * @param fidattr название атрибута, в котором хранится идентификатор картинки на сервере
 */
export const htmlToProse = (html?: string, simple?: boolean, fidattr?: string): string => {
    if (!html) return EMPTY;
    try {
        const dom = new DOMParser().parseFromString(html, 'text/html');
        if (fidattr) {
            const images = dom.getElementsByTagName('img');
            for(var i = 0; i < images.length; i++) {
                const imageid = images[i].getAttribute(fidattr);
                if (imageid) images[i].setAttribute('fid', imageid);
            }
        }
        const json = Parser.fromSchema(simple ? simpleSchema : schema).parse(dom).toJSON();
        return JSON.stringify(json);
    } catch (error) {
        console.error(`Can not convert html content to prose format: ${error}`);
        return ERROR;
    }
};
