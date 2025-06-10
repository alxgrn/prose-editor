/**
 * Модальное окно вставки видео
 */
import { FC, useEffect, useState } from 'react';
import { Form, Input, Modal } from '@alxgrn/telefrag-ui';
import { useEditorEventCallback } from '@handlewithcare/react-prosemirror';
import { Schema } from 'prosemirror-model';
import { validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from '../../../utils/link';

export interface Props {
    schema: Schema;
    isOpen: boolean;
    onClose: () => void;
}

const InsertVideo: FC<Props> = ({ schema, isOpen, onClose }) => {
    const [ vkvideo, setVkvideo ] = useState('');
    const [ rutube, setRutube ] = useState('');
    const [ youtube, setYoutube ] = useState('');
    const [ title, setTitle ] = useState('');

    useEffect(() => {
        setVkvideo('');
        setRutube('');
        setYoutube('');
        setTitle('');
    }, [ isOpen ]);

    // Внесение в документ
    const onSubmit = useEditorEventCallback((view) => {
        const node = schema.nodes.video;
        if (!view || !node) return;
        if (!vkvideo && !rutube && !youtube) return;
        const src: string[] = [];
        const rt = validateRutubeURL(rutube, true)   + '';
        const yt = validateYoutubeURL(youtube, true) + '';
        const vk = validateVkvideoURL(vkvideo, true) + '';
        if (rt) src.push(rt);
        if (yt) src.push(yt);
        if (vk) src.push(vk);
        view.dispatch(view.state.tr.replaceSelectionWith(node.create({ src, title })));
        view.focus();
        onClose();
    });

    // Проверка того что требуемые данные введены
    const canSave = () => {
        if (rutube  && !validateRutubeURL(rutube))   return false;
        if (youtube && !validateYoutubeURL(youtube)) return false;
        if (vkvideo && !validateVkvideoURL(vkvideo)) return false;
        return rutube || youtube || vkvideo;
    };

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
                    id='vkvideo'
                    value={vkvideo}
                    onChange={setVkvideo}
                    label='Ссылка на VK Video'
                    required={!canSave()}
                />
                <Input
                    id='rutube'
                    value={rutube}
                    onChange={setRutube}
                    label='Ссылка на RuTube'
                    required={!canSave()}
                />
                <Input
                    id='youtube'
                    value={youtube}
                    onChange={setYoutube}
                    label='Ссылка на YouTube'
                    required={!canSave()}
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
