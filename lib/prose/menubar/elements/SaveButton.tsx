/**
 * Кнопка вызова сохранения документа.
 * Становится активной если изменилось содержимое редактора.
 */
import { useEditorEffect, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { FC, useState } from "react";
import { Button } from "@alxgrn/telefrag-ui";
import { TEditorSaver, TNotesSaver } from "../../../types";
import { fixTables } from "prosemirror-tables";

type Props = {
    onSave: TEditorSaver|TNotesSaver;
    disabled?: boolean; // принудительно задизейблена
    notEmpty?: boolean; // содержимое редактора не должно быть пустым
};

const SaveButton: FC<Props> = ({ onSave, disabled = false, notEmpty = true }) => {
    const [ enabled, setEnabled ] = useState(true);
    const [ isSaving, setIsSaving ] = useState(false);

    useEditorEffect((view) => {
        let enabled = true;
        if (notEmpty) {
            const node = view.state.doc;
            const size = !!node.textBetween(0, node.content.size, undefined, ' ').length;
            enabled = size;
        } 
        setEnabled(enabled);
    });

    const onClick = useEditorEventCallback(async (view) => {
        setIsSaving(true);
        try {
            let content: string;
            const fix = fixTables(view.state);
            if (fix) {
                const state = view.state.apply(fix.setMeta('addToHistory', false));
                content = JSON.stringify(state.doc.toJSON());
            } else {
                content = JSON.stringify(view.state.doc.toJSON());
            }
            const result = await onSave({ content, format: 'prose' });
            if (result) throw new Error(result);
        } catch (error) {
            console.error(`Can not save doc: ${error}`);
        }
        setIsSaving(false);
        view.focus();
    });

    return (<Button
        type='Accent'
        disabled={disabled || !enabled || isSaving}
        label={isSaving ? 'Сохраняю' : 'Сохранить'}
        size='Small'
        onClick={onClick}
    />);
};

export default SaveButton;
