/**
 * Вставка ссылки
 */
import { FC } from 'react';
import { Schema } from "prosemirror-model";
import { toggleMark } from "prosemirror-commands";
import { Prompt } from '@alxgrn/telefrag-ui';
import { useEditorEventCallback } from '@handlewithcare/react-prosemirror';

type Props = {
    schema: Schema
    isOpen: boolean;
    onClose: () => void;
};

export const InsertLink: FC<Props> = ({ schema, isOpen, onClose }) => {

    const onSubmit = useEditorEventCallback((view, value) => {
        if (!view) return;
        toggleMark(schema.marks.link, { href: value })(view.state, view.dispatch);
        onClose();
        view.focus();
    });

    return (
        <Prompt
            title='Введите URL для ссылки'
            isOpen={isOpen}
            onCancel={onClose}
            onSubmit={onSubmit}
        />
    );
};

export default InsertLink;
