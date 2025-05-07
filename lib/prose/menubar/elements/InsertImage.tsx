/**
 * Модальное окно вставки картинки
 */
import { FC, useEffect, useState } from 'react';
import { Form, Icons, Image, Input, Modal } from '@alxgrn/telefrag-ui';
import { useEditorEffect, useEditorEventCallback } from '@handlewithcare/react-prosemirror';
import { ImagePluginState, ImagePluginKey, insertImage, uploadImage } from '../../plugins/imagePlugin';

export interface Props {
    pos?: number;
    isOpen: boolean;
    onClose: () => void;
}

const InsertImage: FC<Props> = ({ pos, isOpen, onClose }) => {
    const [ href, setHref ] = useState('');
    const [ image, setImage ] = useState<File>();
    const [ title, setTitle ] = useState('');
    const [ canUpload, setCanUpload ] = useState(false);

    useEffect(() => {
        setHref('');
        setTitle('');
        setImage(undefined);
    }, [ isOpen ]);

    useEditorEffect((view) => {
        if (!view || !isOpen) return;
        const state = ImagePluginKey.getState(view.state) as ImagePluginState;
        setCanUpload(state.upload !== undefined);
    }, [ isOpen ]);

    const onFormSubmit = useEditorEventCallback((view) => {
        if (!view) return;
        if (canUpload) {
            uploadImage(view, image, title, pos);
        } else {
            insertImage(view, href, title, pos);
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
                {canUpload
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
