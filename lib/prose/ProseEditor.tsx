import { FC, useEffect, useState } from "react";
import { EditorState } from "prosemirror-state";
import { plugins } from "./plugins";
import { ProseMirror, ProseMirrorDoc } from "@handlewithcare/react-prosemirror";
import { TEditorSaver, TImageUploader } from "../types";
import { Node } from "prosemirror-model";
import { undoDepth } from 'prosemirror-history';
import MenuBar from "./menubar/MenuBar";
import VideoView from "./views/VideoView";
import ImageView from "./views/ImageView";
import TableView from "./views/TableView";
import TableCellView from "./views/TableCellView";
import CarouselView from "./views/CarouselView";
import { fixTables } from "prosemirror-tables";
import { schema } from "./schema";
import './Carousel.css';
import './ProseMirror.css';
import './ProseViewer.css';

type Props = {
    content: string | null; // Содержимое статьи
    //onView: () => void; // Вызывается при клике на кнопку просмотра статьи
    onSave: TEditorSaver; // Вызывается при нажатии на кнопку сохранения статьи
    onChange: (changed: boolean) => void; // Вызывается при изменении текста статьи
    onUpload: TImageUploader; // Вызывается после выбора картинки для загрузки на сервер
};

const ProseEditor: FC<Props> = ({ content, onSave, onChange, onUpload }) => {
    const [editorState, setEditorState] = useState<EditorState>();

    // Инициализация
    useEffect(() => {
        let doc: Node|undefined;
        if (content) {
            try {
                doc = Node.fromJSON(schema, JSON.parse(content));
            } catch (error) {
                console.error(`Can not parse Prose format: ${error}`);
            }
        }

        let state = EditorState.create({
            doc,
            schema: schema,
            plugins: plugins({ schema, upload: onUpload }),
        });

        // Зачем фиксить таблицы пока не очень понятно, но в демке так сделано
        // https://github.com/ProseMirror/prosemirror-tables/blob/master/demo/demo.ts
        const fix = fixTables(state);
        if (fix) state = state.apply(fix.setMeta('addToHistory', false));

        setEditorState(state);
    }, [ content ]);

    if (!editorState) return null;

    return (
        <div className='ProseEditor'>
            <ProseMirror
                state={editorState}
                dispatchTransaction={(tr) => setEditorState((s) => {
                    const state = s?.apply(tr);
                    if (state) onChange(undoDepth(state) > 0);
                    return state;
                })}
                nodeViews={{
                    image: ImageView,
                    video: VideoView,
                    table: TableView,
                    table_header: TableCellView,
                    table_cell: TableCellView,
                    carousel: CarouselView,
                }}
            >
                <MenuBar schema={schema} onSave={onSave}/>
                <ProseMirrorDoc />
            </ProseMirror>
        </div>
    );
};

export default ProseEditor;
