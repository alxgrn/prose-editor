import Notes from "./prose/ProseNotes";
import Editor from "./prose/ProseEditor";
import Viewer from "./prose/ProseViewer";
import DOM from "./prose/ProseViewerDom";
import { htmlToProse } from "./utils/convert";
import { setConfig, type TConfig } from "./utils/config";

export {
    Notes,
    Editor,
    Viewer,
    DOM,
    htmlToProse,
    setConfig,
};

import {
    TEditorSaver,
    TImageUploader,
    TNotesSaver,
    TPublication,
    TPublicationFormat,
} from "./types";

export type {
    TEditorSaver,
    TImageUploader,
    TNotesSaver,
    TPublication,
    TPublicationFormat,
    TConfig,
};
