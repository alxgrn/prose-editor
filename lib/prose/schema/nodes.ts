/**
 * Наши типы узлов
 */
import { NodeSpec } from 'prosemirror-model';
import { API_URL, ERROR_EMBED, ERROR_IMAGE } from '../../utils/config';
import { sanitizeVideoURL } from '../../utils/link';

// Переделали базовую картинку из инлайн в блок
// и добавили атрибут fid для передачи идентификатора файла
export const image: NodeSpec = {
    atom: true,
    attrs: {
        fid: { default: null, validate: 'string|null|number' },
        src: { default: null, validate: 'string|null' },
        alt: { default: null, validate: 'string|null' },
        title: { default: null, validate: 'string|null' },
    },
    group: 'block',
    parseDOM: [{tag: 'img[src]', getAttrs(dom: HTMLElement) {
        let src = dom.getAttribute('src');
        if (!src) src = ERROR_IMAGE;
        if (src.startsWith('data:')) src = ERROR_IMAGE;
        return {
            src,
            fid: dom.getAttribute('fid'),
            alt: dom.getAttribute('alt'),
            title: dom.getAttribute('title'),
        }
    }}],
    toDOM(node) {
        let { fid, src, alt, title } = node.attrs;
        if (fid) src = `${API_URL}/${fid}`;
        if (!src) src = ERROR_IMAGE;
        return ['div', { title, class: 'image' }, [ 'img', { fid, src, alt, title }]];
    }
};

// Блок видео полность наш, сделан на основе image
export const video: NodeSpec = {
    atom: true,
    attrs: {
        title: { default: null, validate: 'string|null' },
        src: { validate: val => {
            if (typeof val === 'string') return;
            if (Array.isArray(val)) {
                val.forEach(v => {
                    if (typeof v !== 'string') throw new Error('One of the video sources is not a string');
                });
                return;
            }
            throw new Error('Video source must be a string or array of strings');
        }},
    },
    group: 'block',
    parseDOM: [{tag: 'iframe[src]', getAttrs(dom: HTMLElement) {
        return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
        }
    }}],
    toDOM(node) {
        const { src, title } = node.attrs;
        const allow = 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        const url = Array.isArray(src) ? src[0] : src;
        if (!sanitizeVideoURL(url)) {
            return ['div', { title, class: 'image' }, [ 'img', { src: ERROR_EMBED }]];
        } 
        return ['div', { title, class: 'video' }, [ 'iframe', { src: url, title, allow }]];
    }
};

// Для большой схемы добавим в дефолтный параграф выравнивание.
// ВАЖНО: Параграф надо добавлять в начало списка, а не в конец.
// В противном случае будет переполнение стека при парсинге документа.
export const paragraph: NodeSpec = {
    content: 'inline*',
    group: 'block',
    attrs: {
        align: { default: null, validate: 'string|null' },
    },
    parseDOM: [{tag: 'p', getAttrs(dom: HTMLElement) {
        let align = dom.getAttribute('align');
        if (align !== 'right' && align !== 'center' && align !== 'justify') align = null;
        return { align };
    }}],
    toDOM(node) {
        const { align } = node.attrs;
        return ['p', { align }, 0];
    }
};

// В заголовке запретим ссылки
export const heading: NodeSpec = {
    attrs: {level: {default: 1, validate: 'number'}},
    content: 'inline*',
    marks: 'underline strikethrough',
    group: 'block',
    parseDOM: [{tag: 'h1', attrs: {level: 1}},
               {tag: 'h2', attrs: {level: 2}},
               {tag: 'h3', attrs: {level: 3}},
               {tag: 'h4', attrs: {level: 4}},
               {tag: 'h5', attrs: {level: 5}},
               {tag: 'h6', attrs: {level: 6}}],
    toDOM(node) { return ['h' + node.attrs.level, 0] }
};

// Карусель картинок
export const carousel: NodeSpec = {
    atom: true,
    content: 'image*',
    group: 'block',
    toDOM() {
        return ['div', { class: 'carousel' }, 0];
    }
};

export const nodes = {
    image,
    video,
    heading,
    carousel,
    paragraph,
};

export default nodes;
