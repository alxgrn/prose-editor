/**
 * Наши способы инлайн форматирования
 */
import { MarkSpec } from 'prosemirror-model';
import { schema as baseSchema } from 'prosemirror-schema-basic';

// Добавим в базовые метки подчеркивание и зачеркивание
export const marks = baseSchema.spec.marks.append({
    /// Подчеркнутый текст. Рендериится как `<u>`.
    underline: {
        parseDOM: [
            {tag: 'u'},
            {style: 'font-style=underline'},
        ],
        toDOM() { return ['u', 0] }
    } as MarkSpec,

    /// Зачеркнутый текст. Рендериится как `<s>`.
    strikethrough: {
        parseDOM: [
            {tag: 's'},
            {style: 'font-style=strike'},
            {style: 'font-style=strikethrough'},
        ],
        toDOM() { return ['s', 0] }
    } as MarkSpec,
});

export default marks;
