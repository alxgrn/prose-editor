import { FC, useEffect, useRef, useState } from 'react';
import { Node } from './ProseRender';
import { API_URL, ERROR_IMAGE_DATA } from '../../config';
import { Icons } from '@alxgrn/telefrag-ui';
/**
 * TODO: Разобраться со странным поведением обработки нажатия на кнопки вправо/влево:
 *       После выхода из полноэкранного режима компонент продолжает их обрабатывать.
 */

type Props = {
    node: Node;
};

const Carousel: FC<Props> = ({ node }) => {
    const listRef  = useRef<HTMLDivElement>(null);
    const carouselRef  = useRef<HTMLDivElement>(null);
    const [ isFullscreen, setIsFullscreen ] = useState(false);
    const [ canPrev, setCanPrev ] = useState(false);
    const [ canNext, setCanNext ] = useState(false);
    const [ current, setCurrent ] = useState(1);
    const [ total, setTotal ] = useState(1);

    // Обновляет видимость кнопок сролла и текущей позиции
    const updatePrevNext = (target: HTMLDivElement) => {
        const pos  = target.scrollLeft;
        const width = target.clientWidth;
        const fullWidth = target.scrollWidth;
        setCanPrev(pos > width/2);
        setCanNext(pos < fullWidth - width * 1.5);
        setCurrent(Math.round(pos/width + 1));
    };

    // Инициализация кнопки скролла вправо
    useEffect(() => {
        setCanNext(Array.isArray(node.content) && node.content.length > 1);
        setTotal(node.content?.length ?? 1);
        setCurrent(1);
    }, [ node ]);

    // Переключаем флаг перехода в полный экран
    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    // Ловим нажатия на кнопки вправо/влево
    useEffect(() => {
        if (!isFullscreen) return;

        const onKeydown = (e: KeyboardEvent) => {
            if(e.key === 'ArrowLeft') scrollTo(null, -1);
            if(e.key === 'ArrowRight') scrollTo(null, 1);
        };
    
        document.body.addEventListener('keydown', onKeydown);
        return () => document.body.removeEventListener('keydown', onKeydown);
    }, [ isFullscreen ]);

    // Обработчик клика по кнопке переключения режима fullscreen
    const switchFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFullscreen) {
            document.exitFullscreen();
        } else {
            carouselRef.current?.requestFullscreen();
        }
    };

    // Скролл на один кадр вперед или назад
    const scrollTo = (e: React.MouseEvent|null, step: -1|1) => {
        e?.stopPropagation();
        if (!listRef.current) return;
        const width = listRef.current.clientWidth;
        let scroll = listRef.current.scrollLeft + step * width;
        listRef.current.scrollLeft = scroll;
    };

    if (!Array.isArray(node.content)) return null;

    return (
        <div className='carousel' ref={carouselRef}>
            <div className='carousel-list' ref={listRef} onScroll={e => updatePrevNext(e.currentTarget)}>
                {node.content.map((n, i) => <Image key={i} node={n} onClick={switchFullscreen}/>)}
            </div>
            <div className='carousel-numb'>{current} / {total}</div>
            <div className='carousel-full' onClick={switchFullscreen}>
                {isFullscreen ? <Icons.Minimize/> : <Icons.Maximize/>}
            </div>
            {canPrev && <div className='carousel-prev' onClick={e => scrollTo(e, -1)}><Icons.ChevronLeft/></div>}
            {canNext && <div className='carousel-next' onClick={e => scrollTo(e,  1)}><Icons.ChevronRight/></div>}
        </div>
    );
};

/**
 * Упрощенный вариант рендера картинки
 */

type ImageProps = {
    node: Node;
    onClick: (e: React.MouseEvent) => void;
};

const Image: FC<ImageProps> = ({ node, onClick }) => {
    const [ src, setSrc ] = useState('');
    const [ title, setTitle ] = useState('');

    useEffect(() => {
        let fid = node.attrs?.fid;
        let src = node.attrs?.src ? `${node.attrs?.src}` : '';
        let title = node.attrs?.title ? `${node.attrs.title}` : '';
        
        if (fid) src = `${API_URL}/files/${fid}`;
        if (!src) src = ERROR_IMAGE_DATA;

        setSrc(src);
        setTitle(title);
    }, [ node ]);

    if (node.type !== 'image') return null;

    return (<div className='image' title={title}>
        {src && <img src={src} onClick={onClick}/>}
    </div>);
};


export default Carousel;
