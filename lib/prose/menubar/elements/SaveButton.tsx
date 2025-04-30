import { useEditorEffect, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { FC, useState } from "react";
import { undoDepth } from 'prosemirror-history';
import { Button } from "@alxgrn/telefrag-ui";
import { TEditorSaver, TNotesSaver } from "../../../types";
import { fixTables } from "prosemirror-tables";

type Props = {
    onSave: TEditorSaver|TNotesSaver;
    disabled?: boolean;
};

const SaveButton: FC<Props> = ({ onSave, disabled = false }) => {
    const [ enabled, setEnabled ] = useState(true);

    useEditorEffect((view) => {
        setEnabled(undoDepth(view.state));
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
