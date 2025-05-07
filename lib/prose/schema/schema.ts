/**
 * Наша схема документа
 */
import { Schema, Node, DOMSerializer, DOMParser } from "prosemirror-model";
import { addListNodes } from 'prosemirror-schema-list';
import { schema as baseSchema } from 'prosemirror-schema-basic';
import { tableNodes } from "prosemirror-tables";
import marks from './marks';
import { image, video, heading, paragraph, carousel } from './nodes';

// Добавим в базовую схему свой узел картинок и видео...
const nodes = baseSchema.spec.nodes.remove('image').append({ image, video });
// ...и соорудим свою простую схему
export const simpleSchema = new Schema({
    nodes: nodes.remove('horizontal_rule').remove('heading'),
    marks,
});

// Добавим в базовые узлы параграф с выравниванием, карусель и таблицу
const nodesWithTables = nodes
    .remove('heading')
    .remove('paragraph')
    .prepend({ paragraph })
    .append({ heading })
    .append({ carousel })
    .append(tableNodes({
        tableGroup: 'block',
        cellContent: '(paragraph | ordered_list | bullet_list)+', // важно использовать + а не * !
        cellAttributes: {
            halign: {
                default: null,
                getFromDOM(dom) {
                    const halign = dom.getAttribute('align') || null;
                    if (halign === 'left' || halign === 'right' || halign === 'center') return halign;
                    return null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                    attrs.style = (attrs.style || '') + `text-align: ${value};`;
                },
            },
            valign: {
                default: null,
                getFromDOM(dom) {
                    const valign = dom.style.verticalAlign || null;
                    if (valign === 'top' || valign === 'bottom' || valign === 'middle') return valign;
                    return null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                    attrs.style = (attrs.style || '') + `vertical-align: ${value};`;
                },
            },
        },
    },
));

// Сделаем схему с таблицами и списками
export const schema = new Schema({
    nodes: addListNodes(nodesWithTables, "(paragraph | ordered_list | bullet_list)*", "block"),
    marks,
});

/**
 * Заменяет в документе все узлы, которых нет в простой схеме, на параграфы.
 * По сути мы имитируем cut-and-paste HTML-документа в редактор, у которого
 * в качестве схемы используется simpleSchema. Сам документ формируем из сериализованного
 * контента сохраненного в БД.
 * @param content сериализованный в строку контент документа, null или undefined.
 * @returns документ, который содержит только узлы из простой схемы или undefined.
 */
export const toSimpleSchema = (content?: string|null): Node | undefined => {
    if (!content) return;
    try {
        const doc = Node.fromJSON(schema, JSON.parse(content));
        const dom = DOMSerializer.fromSchema(schema).serializeFragment(doc.content);
        return DOMParser.fromSchema(simpleSchema).parse(dom);
    } catch (error) {
        console.error(`Can not convert content to simple schema: ${error}`);
    }
};
