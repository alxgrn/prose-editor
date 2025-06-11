/**
 * Модальное окно вставки видео.
 * Мы вынуждены для простой схемы обрубать возможность ввода нескольких УРЛ для
 * источников видео т.к. при загрузке контента в Notes он прогоняется через
 * функцию toSimpleSchema, которая имитирует вставку контента через клипбоард.
 * Для этого контент сначала выводится в HTML, а затем парсится из HTML.
 * Поскольку в HTML для iframe допустим только один src, мы обрубаем возможность
 * ввода массива источников.
 */
import { FC, useEffect, useState } from 'react';
import { Form, Input, Modal } from '@alxgrn/telefrag-ui';
import { useEditorEventCallback } from '@handlewithcare/react-prosemirror';
import { Schema } from 'prosemirror-model';
import { sanitizeVideoURL, validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from '../../../utils/link';

export interface Props {
    schema: Schema;
    isOpen: boolean;
    onClose: () => void;
}

const InsertVideo: FC<Props> = ({ schema, isOpen, onClose }) => {
    const [ url, setUrl ] = useState('');
    const [ vkvideo, setVkvideo ] = useState('');
    const [ rutube, setRutube ] = useState('');
    const [ youtube, setYoutube ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ isSimple, setIsSimple ] = useState(true);

    useEffect(() => {
        setUrl('');
        setVkvideo('');
        setRutube('');
        setYoutube('');
        setTitle('');
        // Определим какой вариант схемы используется по наличию таблицы в ней
        if (schema.nodes.table) setIsSimple(false); else setIsSimple(true);
    }, [ isOpen ]);

    // Внесение в документ
    const onSubmit = useEditorEventCallback((view) => {
        const node = schema.nodes.video;
        if (!view || !node) return;
        let src: string|string[] = [];
        if (isSimple) {
            src = sanitizeVideoURL(url);
            if (!src) return;
        } else {
            if (!vkvideo && !rutube && !youtube) return;
            const rt = validateRutubeURL(rutube, true)   + '';
            const yt = validateYoutubeURL(youtube, true) + '';
            const vk = validateVkvideoURL(vkvideo, true) + '';
            if (rt) src.push(rt);
            if (yt) src.push(yt);
            if (vk) src.push(vk);
        }
        view.dispatch(view.state.tr.replaceSelectionWith(node.create({ src, title })));
        view.focus();
        onClose();
    });

    // Проверка того что требуемые данные введены
    const canSave = () => {
        if (isSimple) {
            if (sanitizeVideoURL(url)) return true; else return false;
        } else {
            if (rutube  && !validateRutubeURL(rutube))   return false;
            if (youtube && !validateYoutubeURL(youtube)) return false;
            if (vkvideo && !validateVkvideoURL(vkvideo)) return false;
            return !!(rutube || youtube || vkvideo);
        }
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
                {isSimple ?
                    <Input
                        id='url'
                        value={url}
                        onChange={setUrl}
                        label='Ссылка на видео'
                        bottom='Поддерживаются VK Video, RuTube и YouTube'
                        required={!canSave()}
                    /> : <>
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
                </>}
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
