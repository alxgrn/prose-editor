/**
 * Исходник взят из https://prosemirror.net/examples/upload/
 * но немного обработан напильником
 */
import { Schema } from "prosemirror-model";
import { EditorState, Plugin, PluginKey } from "prosemirror-state"
import { Decoration, DecorationSet, EditorView } from "prosemirror-view"
import { TImageUploader } from "../../types";
import './imagePlugin.css';

export const ImagePluginKey = new PluginKey("ImagePluginKey");

export type ImagePluginOption = {
    schema: Schema;
    upload?: TImageUploader;
};

export type ImagePluginState = ImagePluginOption & {
    set: DecorationSet;
};

export const imagePlugin = (options: ImagePluginOption): Plugin => {
    const plugin = new Plugin<ImagePluginState>({
        key: ImagePluginKey,
        state: {
            init() {
                return {
                    set: DecorationSet.empty,
                    schema: options.schema,
                    upload: options.upload,
                };
            },
            apply(tr, state) {
                // Adjust decoration positions to changes made by the transaction
                let set = state.set.map(tr.mapping, tr.doc);
                // See if the transaction adds or removes any placeholders
                const action = tr.getMeta(ImagePluginKey);
                if (action && action.add) {
                    const widget = document.createElement("placeholder");
                    const deco = Decoration.widget(action.add.pos, widget, { id: action.add.id, key: `imgphd${action.add.id}` });
                    set = set.add(tr.doc, [ deco ]);
                } else if (action && action.remove) {
                    set = set.remove(set.find(undefined, undefined, spec => spec.id == action.remove.id));
                }
                return { ...state, set };
            }
        },
        props: {
            decorations(state) { return this.getState(state)?.set }
        }
    });

    return plugin;
};
/**
 * Function that returns the current position of the placeholder
 * with the given ID, if it still exists.
 */
const findPlaceholder = (state: EditorState, id: number) => {
    const decos = (ImagePluginKey.getState(state) as ImagePluginState).set;
    const found = decos?.find(undefined, undefined, spec => spec.id == id);
    return found?.length ? found[0].from : null;
};

// This is just a dummy that loads the file and creates a data URL.
// You could swap it out with a function that does an actual upload
// and returns a regular URL for the uploaded file.
/*
function uploadFile(file: File) {
    let reader = new FileReader;
    return new Promise((accept, fail) => {
        reader.onload = () => accept(reader.result);
        reader.onerror = () => fail(reader.error);
        // Some extra delay to make the asynchronicity visible
        setTimeout(() => reader.readAsDataURL(file), 1000 * 3);
    });
};
*/
/**
 * Загрузка изображения на сервер и вставка в текущую позицию курсора
 */
export const uploadImage = async (view: EditorView, file?: File|null, title?: string) => {
    if (!file) return;
    // Уникальный идентификатор для загрузки
    const id = Date.now();
    // Заменяем выделение плейсхолдером
    const tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection();
    tr.setMeta(ImagePluginKey, { add: { id, pos: tr.selection.from }});
    view.dispatch(tr);
    // Вызываем функцию загрузки
    try {
        const pluginState = ImagePluginKey.getState(view.state) as ImagePluginState;
        const schema = pluginState.schema;
        const upload = pluginState.upload;
        if (!upload) throw new Error('startImageUpload: Image upload function not defined');
        const fid = await upload(file);
        // Если функция загрузки вернула строку, значит это сообщение об ошибке
        if (typeof fid === 'string') throw new Error(fid);
        // Найдем позицию плейсхолдера. Пока длилась загрузка картинки стейт мог
        // измениться, поэтому внутри функции запрашиваем актуальный набор заглушек,
        // а не используем pluginState найденный ранее.
        const pos = findPlaceholder(view.state, id);
        // If the content around the placeholder has been deleted, drop the image
        if (pos === null) {
            console.warn('startImageUpload: The image was removed from the document during upload')
            return;
        }
        // Otherwise, insert it at the placeholder's position, and remove the placeholder
        view.dispatch(view.state.tr
            .replaceWith(pos, pos, schema.nodes.image.create({ fid, title }))
            .setMeta(ImagePluginKey, { remove: { id }}));
    } catch (error) {
        // On failure, just clean up the placeholder
        view.dispatch(view.state.tr.setMeta(ImagePluginKey, { remove: { id }}));
        console.error(`startImageUpload: ${error}`);
    }
};
/**
 * Вставка картинки по URL в текущую позицию курсора
 */
export const insertImage = (view: EditorView, src?: string, title?: string) => {
    if (!src) return;
    const tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection();
    const pos = tr.selection.from;
    const schema = (ImagePluginKey.getState(view.state) as ImagePluginState).schema;
    view.dispatch(view.state.tr.replaceWith(pos, pos, schema.nodes.image.create({ src, title })));
};
