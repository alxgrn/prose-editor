import { FC, useEffect, useState } from "react";
import { EditorState } from "prosemirror-state";
import { plugins } from "./plugins";
import { ProseMirror, ProseMirrorDoc } from "@handlewithcare/react-prosemirror";
import { TImageUploader, TNotesSaver, TPublication } from "../types";
import { simpleSchema, toSimpleSchema } from "./schema";
import SimpleMenuBar from "./menubar/SimpleMenuBar";
import SaveButton from "./menubar/elements/SaveButton";
import ImageView from "./views/ImageView";
import VideoView from "./views/VideoView";
import './ProseMirror.css';
import './ProseViewer.css';
import './ProseNotes.css';

type Props = {
    title?: boolean | string | null; // нужно ли выводить поле ввода для заголовка публикации и его начальное содержимое
    content?: string | null; // начальный контент редактора
    placeholder?: string; // подсказка в пустом редакторе
    onSave?: TNotesSaver; // нажатие на кнопку сохранения
    onCancel?: () => void; // нажатие на кнопку отмены редактирования
    onUpload?: TImageUploader; // вызывается после выбора картинки для загрузки на сервер
};

const ProseNotes: FC<Props> = ({ title = false, content, onSave, onCancel, onUpload }) => {
    const [ name, setName ] = useState('');
    const [ editorState, setEditorState ] = useState<EditorState>();

    // Инициализация
    useEffect(() => {
        const state = EditorState.create({
            doc: toSimpleSchema(content),
            schema: simpleSchema,
            plugins: plugins(simpleSchema),
        });

        setEditorState(state);
    }, [ content ]);

    // Проверка того что требуемые данные введены
    const canSave = () => {
        return title !== false ? name.trim().length > 0 : true;
    };

    // Обработка клика по кнопке сохранения
    const onBeforeSave = (data: TPublication) => {
        if(!onSave || !canSave()) return;
        onSave(data);
    };

    // Отмена
    const onBeforeCancel = () => {
        if(onCancel) onCancel();
    };    

    if (!editorState) return null;

    return (
        <div className='ProseNotes'>
            {(title !== false) &&
            <input
                className='ProseNotesTitle'
                onChange={e => setName(e.currentTarget.value)}
                value={name}
                placeholder='Укажите заголовок'
            />}

            <ProseMirror
                state={editorState}
                dispatchTransaction={(tr) => {
                    setEditorState((s) => s?.apply(tr));
                }}
                nodeViews={{
                    image: ImageView,
                    video: VideoView,
                }}
            >
                <SimpleMenuBar schema={simpleSchema} onUpload={onUpload}/>
                <ProseMirrorDoc />

                {(onSave || onCancel) &&
                <div className='ProseNotesButtons'>
                    {onCancel && <span className='a small' onClick={onBeforeCancel}>Отменить</span>}
                    {onSave && <SaveButton onSave={onBeforeSave} disabled={!canSave()} />}
                </div>}
            </ProseMirror>
        </div>
    );
};

export default ProseNotes;
