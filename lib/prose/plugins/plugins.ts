/**
 * Настройка плагинов для редактора.
 * За основу взят оригинал из пакета prosemirror-example-setup
 */
import { keymap } from "prosemirror-keymap";
import { history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { Schema } from "prosemirror-model";
import { buildKeymap, buildInputRules } from "prosemirror-example-setup";
import { placeholderPlugin } from "./imageUpload";
import { goToNextCell, tableEditing } from "prosemirror-tables";
//import { selectPlugin } from "./plugins/select";

export const plugins = (schema: Schema) => {
    let plugins = [
        //columnResizing({ lastColumnResizable: false, View: null }),
        tableEditing(),
        keymap({
            Tab: goToNextCell(1),
            'Shift-Tab': goToNextCell(-1),
        }),
        buildInputRules(schema),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        dropCursor({ color: '#F00', width: 2 }),
        gapCursor(),
        history(),
        placeholderPlugin,
        //selectPlugin,
    ];

    return plugins;
};
