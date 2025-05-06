/**
 * Кнопка вызова сохранения документа.
 * Становится активной если изменилось содержимое редактора.
 */
import { useEditorEffect, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { FC, useState } from "react";
import { undoDepth } from 'prosemirror-history';
import { Button } from "@alxgrn/telefrag-ui";
import { TEditorSaver, TNotesSaver } from "../../../types";
import { fixTables } from "prosemirror-tables";

type Props = {
    onSave: TEditorSaver|TNotesSaver;
    disabled?: boolean; // принудительно задизейблена
    notEmpty?: boolean; // содержимое редактора не должно быть пустым
    wasChanged?: boolean; // содержимое редактора должно быть изменено
};

const SaveButton: FC<Props> = ({ onSave, disabled = false, notEmpty = true, wasChanged = true }) => {
    const [ enabled, setEnabled ] = useState(true);

    useEditorEffect((view) => {
        let enabled = false;
        const node = view.state.doc;
        const size = !!node.textBetween(0, node.content.size, undefined, ' ').length;
        const undo = !!undoDepth(view.state);

        if (wasChanged && notEmpty) {
            enabled = size && undo;
        } else if (wasChanged) {
            enabled = undo;
        } else if (notEmpty) {
            enabled = size;
        }

        setEnabled(enabled);
    });

    const onClick = useEditorEventCallback((view) => {
        try {
            let content: string;
            const fix = fixTables(view.state);
            if (fix) {
                const state = view.state.apply(fix.setMeta('addToHistory', false));
                content = JSON.stringify(state.doc.toJSON());
            } else {
                content = JSON.stringify(view.state.doc.toJSON());
            }
            onSave({ content, format: 'prose' });
        } catch (error) {
            console.error(`Can not save doc: ${error}`);
        }
    });

    return (<Button
        type='Accent'
        disabled={disabled || !enabled}
        label='Сохранить'
        size='Small'
        onClick={onClick}
    />);
};

export default SaveButton;
