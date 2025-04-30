/**
 * Модальное окно вставки видео
 */
import { FC, useEffect, useState } from 'react';
import { Form, Input, Modal } from '@alxgrn/telefrag-ui';
import { useEditorEventCallback } from '@handlewithcare/react-prosemirror';
import { Schema } from 'prosemirror-model';
import { sanitizeVideoURL } from '../../../utils/link';

export interface Props {
    schema: Schema;
    isOpen: boolean;
    onClose: () => void;
}

const InsertVideo: FC<Props> = ({ schema, isOpen, onClose }) => {
    const [ src, setSrc ] = useState('');
    const [ title, setTitle ] = useState('');

    useEffect(() => {
        setSrc('');
        setTitle('');
    }, [ isOpen ]);

    const onSubmit = useEditorEventCallback((view) => {
        const node = schema.nodes.video;
        if (!view || !src || !node) return;
        const url = sanitizeVideoURL(src);
        view.dispatch(view.state.tr.replaceSelectionWith(node.create({ src: url, title })));
        view.focus();
        onClose();
    });

    if (!schema.nodes.video) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h1>Вставка видео</h1>
			<Form
				submit='Вставить'
                submitType='Success'
				onSubmit={onSubmit}
                onCancel={onClose}
			>
                <Input
                    id='src'
                    value={src}
                    onChange={setSrc}
                    label='Ссылка на видео'
                    bottom='Поддерживаются VK Video, RuTube и YouTube'
                    required
                />
				<Input
					id='value'
					value={title}
					onChange={setTitle}
                    label='Подпись'
				/>
			</Form>
        </Modal>
    );
};

export default InsertVideo;
