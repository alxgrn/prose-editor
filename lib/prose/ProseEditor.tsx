import { FC, useEffect, useState } from "react";
import { EditorState } from "prosemirror-state";
import { plugins } from "./plugins";
import { ProseMirror, ProseMirrorDoc } from "@handlewithcare/react-prosemirror";
import { TEditorSaver, TImageUploader, TPublication } from "../types";
import { Node } from "prosemirror-model";
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
import './ProseEditor.css';
//import ColumnResize from "./ColumnResize";

type Props = {
    content?: string | null; // Содержимое статьи
    onSave: TEditorSaver; // Вызывается при нажатии на кнопку сохранения статьи
    onView?: () => void; // Вызывается при клике на кнопку просмотра статьи
    onChange?: (changed: boolean) => void; // Вызывается при изменении текста статьи
    onUpload?: TImageUploader; // Вызывается после выбора картинки для загрузки на сервер
};

const ProseEditor: FC<Props> = ({ content, onSave, onView, onChange, onUpload }) => {
    const [ editorState, setEditorState ] = useState<EditorState>();

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

    // Вызов функции сохранения.
    // ВНИМАНИЕ: Если после вызова этой функции мы не просто сохраним изменения на сервер,
    // но и изменим content, который подается в компонент редактора, то это приведет к 
    // реинициализации редактора с новым содержимым. Это в свою очередь сбросит текущее
    // положение курсора, а не вернет его в положение до нажатия кнопки сохранения.
    const onBeforeSave: TEditorSaver = async (data: TPublication) => {
        const result = await onSave(data);
        if (onChange) onChange(false);
        return result;
    };

    if (!editorState) return null;

    return (
        <div className='ProseEditor'>
            <ProseMirror
                state={editorState}
                dispatchTransaction={(tr) => setEditorState((s) => {
                    const state = s?.apply(tr);
                    if (state && onChange) onChange(true);
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
                <MenuBar schema={schema} onSave={onBeforeSave} onView={onView}/>
                <ProseMirrorDoc />
                {/*<ColumnResize />*/}
            </ProseMirror>
        </div>
    );
};

export default ProseEditor;
