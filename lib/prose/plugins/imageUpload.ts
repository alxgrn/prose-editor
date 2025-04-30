/**
 * Исходник взят из https://prosemirror.net/examples/upload/
 * но немного обработан напильником
 */
import { Schema } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state"
import { Decoration, DecorationSet, EditorView } from "prosemirror-view"
import { TImageUploader } from "../../types";
import './ImageUpload.css';

export const placeholderPlugin = new Plugin({
    state: {
        init() { return DecorationSet.empty },
        apply(tr, set) {
            // Adjust decoration positions to changes made by the transaction
            set = set.map(tr.mapping, tr.doc);
            // See if the transaction adds or removes any placeholders
            const action = tr.getMeta(placeholderPlugin);
            if (action && action.add) {
                const widget = document.createElement("placeholder");
                const deco = Decoration.widget(action.add.pos, widget, { id: action.add.id, key: `imgphd${action.add.id}` });
                set = set.add(tr.doc, [ deco ]);
            } else if (action && action.remove) {
                set = set.remove(set.find(undefined, undefined, spec => spec.id == action.remove.id));
            }
            return set;
        }
    },
    props: {
        decorations(state) { return this.getState(state) }
    }
});

// Function that returns the current position of the placeholder
// with the given ID, if it still exists.
const findPlaceholder = (state: EditorState, id: number) => {
    let decos = placeholderPlugin.getState(state);
    let found = decos?.find(undefined, undefined, spec => spec.id == id);
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

export const startImageUpload = async (view: EditorView, file: File|null, schema: Schema|null, upload: TImageUploader, title?: string) => {
    if (!file || !schema) return;
    // A fresh object to act as the ID for this upload
    const id = Date.now();
    // Replace the selection with a placeholder
    const tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection();
    tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from }});
    view.dispatch(tr);
    // Вызываем функцию загрузки
    try {
        //const url = await uploadFile(file);
        const fid = await upload(file);
        if (typeof fid === 'string') throw new Error(fid);
        const pos = findPlaceholder(view.state, id);
        // If the content around the placeholder has been deleted, drop the image
        if (pos == null) return;
        // Otherwise, insert it at the placeholder's position, and remove the placeholder
        view.dispatch(view.state.tr
            .replaceWith(pos, pos, schema.nodes.image.create({ fid, title }))
            .setMeta(placeholderPlugin, { remove: { id }}));
    } catch {
        // On failure, just clean up the placeholder
        view.dispatch(view.state.tr.setMeta(placeholderPlugin, { remove: { id }}));
    }
};
