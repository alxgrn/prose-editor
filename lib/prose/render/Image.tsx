import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { Node } from './ProseRender';
import { API_URL, ERROR_IMAGE_DATA } from '../../config';

type Props = {
    node: Node;
};

const Image: FC<Props> = ({ node }) => {
    const ref  = useRef<HTMLDivElement>(null);
    const [ src, setSrc ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ isFullscreen, setIsFullscreen ] = useState(false);

    // Переключаем флаг перехода в полный экран
    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    // Инициализируем атрибуты
    useEffect(() => {
        let fid = node.attrs?.fid;
        let src = node.attrs?.src ? `${node.attrs?.src}` : '';
        if (fid) src = `${API_URL}/files/${fid}`;
        if (!src) src = ERROR_IMAGE_DATA;
        setSrc(src);
        setTitle(node.attrs?.title ? `${node.attrs?.title}`: '');
    }, [ node ]);

    // Обработчик клика по кнопке переключения режима fullscreen
    const switchFullscreen = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (isFullscreen) {
            document.exitFullscreen();
        } else {
            ref.current?.requestFullscreen();
        }
    };

    return (
        <div
            ref={ref}
            title={title}
            className='image'
            onClick={switchFullscreen}
        >
            {src && <img src={src}/>}
        </div>
    );
};

export default Image;
