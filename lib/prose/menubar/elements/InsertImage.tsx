/**
 * Модальное окно вставки картинки
 */
import { FC, useEffect, useState } from 'react';
import { Form, Icons, Image, Input, Modal } from '@alxgrn/telefrag-ui';
import { useEditorEventCallback } from '@handlewithcare/react-prosemirror';
import { Schema } from 'prosemirror-model';
import { TImageUploader } from '../../../types';
import { startImageUpload } from '../../plugins/imageUpload';

export interface Props {
    schema: Schema;
    isOpen: boolean;
    onClose: () => void;
    onUpload?: TImageUploader;
}

const InsertImage: FC<Props> = ({ schema, isOpen, onClose, onUpload }) => {
    const [ href, setHref ] = useState('');
    const [ image, setImage ] = useState<File|undefined>(undefined);
    const [ title, setTitle ] = useState('');

    useEffect(() => {
        setTitle('');
        setImage(undefined);
    }, [ isOpen ]);

    const onFormSubmit = useEditorEventCallback((view) => {
        if (!view || !image) return;
        if (onUpload) {
            startImageUpload(view, image, schema, onUpload, title);
        } else {
            const tr = view.state.tr;
            if (!tr.selection.empty) tr.deleteSelection();
            const pos = tr.selection.from;
            view.dispatch(view.state.tr.replaceWith(pos, pos, schema.nodes.image.create({ src: href, title })));
        }
        view.focus();
        onClose();
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h1>Вставка картинки</h1>
			<Form
				submit='Вставить'
                submitType='Success'
				onSubmit={onFormSubmit}
                onCancel={onClose}
			>
                {onUpload
                ? <Image
                    id='image'
                    value={image}
                    onChange={setImage}
                    text={<span><Icons.Image/><br/>Выберите файл</span>}
                    required
                    label='Картинка'
                />
                : <Input
                    id='href'
                    value={href}
                    onChange={setHref}
                    required
                    label='Ссылка на картинку'
                />}
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

export default InsertImage;
