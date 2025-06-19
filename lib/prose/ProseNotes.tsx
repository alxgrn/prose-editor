import { FC, useEffect, useState } from "react";
import { EditorState } from "prosemirror-state";
import { undoDepth } from 'prosemirror-history';
import { plugins } from "./plugins";
import { ProseMirror, ProseMirrorDoc } from "@handlewithcare/react-prosemirror";
import { TImageUploader, TNotesSaver, TPublication } from "../types";
import { simpleSchema, toSimpleSchema } from "./schema";
import SimpleMenuBar from "./menubar/SimpleMenuBar";
import ImageView from "./views/ImageView";
import VideoView from "./views/VideoView";
import './ProseMirror.css';
import './ProseViewer.css';
import './ProseNotes.css';
import SaveButton from "./menubar/elements/SaveButton";

type Props = {
    title?: boolean | string | null; // нужно ли выводить поле ввода для заголовка публикации и его начальное содержимое
    content?: string | null; // начальный контент редактора
    placeholder?: string; // подсказка в пустом редакторе
    onSave?: TNotesSaver; // нажатие на кнопку сохранения
    onCancel?: () => void; // нажатие на кнопку отмены редактирования
    onChange?: (changed: boolean) => void; // вызывается при изменении текста
    onUpload?: TImageUploader; // вызывается после выбора картинки для загрузки на сервер
};

const ProseNotes: FC<Props> = ({ title = false, content, onSave, onCancel, onChange, onUpload }) => {
    const [ name, setName ] = useState('');
    const [ editorState, setEditorState ] = useState<EditorState>();

    // Инициализация
    useEffect(() => {
        const state = EditorState.create({
            doc: toSimpleSchema(content),
            schema: simpleSchema,
            plugins: plugins({ schema: simpleSchema, upload: onUpload }),
        });

        setEditorState(state);
        if (title !== false) setName(typeof title === 'string' ? title : '');
    }, [ title, content ]);

    // Проверка того что требуемые данные введены.
    // По факту проверяет только то, что если нужен заголовок, то он введен.
    // Остальные проверки на совести кнопки сохранения.
    const canSave = () => {
        return title !== false ? name.trim().length > 0 : true;
    };

    // Обработка клика по кнопке сохранения
    const onBeforeSave = (data: TPublication) => {
        if(!onSave || !canSave()) return;
        onSave({ ...data, name });
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
                dispatchTransaction={(tr) => setEditorState((s) => {
                    const state = s?.apply(tr);
                    if (state && onChange) onChange(!!undoDepth(state));
                    return state;
                })}
                nodeViews={{
                    image: ImageView,
                    video: VideoView,
                }}
            >
                <div className='ProseNotesContent'>
                    <SimpleMenuBar schema={simpleSchema}/>
                    <ProseMirrorDoc />
                </div>
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
