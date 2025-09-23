import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { Node } from './ProseRender';
import { API_URL, ERROR_IMAGE } from '../../utils/config';
import { Icons } from '@alxgrn/telefrag-ui';

type Props = {
    node: Node;
};

const Image: FC<Props> = ({ node }) => {
    const ref  = useRef<HTMLDivElement>(null);
    const [ src, setSrc ] = useState('');
    const [ alt, setAlt ] = useState('');
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
        if (fid) src = `${API_URL}/${fid}`;
        if (!src) src = ERROR_IMAGE;
        setSrc(src);
        setAlt(node.attrs?.alt ? `${node.attrs?.alt}`: '');
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

    if (!src) return null;

    return (
        <div
            ref={ref}
            className='image'
        >
            <img src={src} onClick={switchFullscreen} alt={alt} title={title}/>
            {title && <div className='image-title'>{title}</div>}
            <div className='image-full' onClick={switchFullscreen}>
                {isFullscreen ? <Icons.Minimize/> : <Icons.Maximize/>}
            </div>
        </div>
    );
};

export default Image;
