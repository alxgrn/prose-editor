/**
 * Карусель с картинками
 */
import { Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { forwardRef, useEffect, useRef, useState } from "react";
import InsertImage from "../menubar/elements/InsertImage";

const CarouselView = forwardRef<HTMLDivElement, NodeViewComponentProps>(
    function Carousel({ children, nodeProps, ...props }, outerRef) {
        const listRef = useRef<HTMLDivElement>(null);
        const [ isImagePrompt, setIsImagePrompt ] = useState(false);
        const [ canScroll, setCanScroll ] = useState(false);
        const [ canPrev, setCanPrev ] = useState(false);
        const [ canNext, setCanNext ] = useState(false);
        const [ pos, setPos ] = useState<number>();
        const [ width, setWidth ] = useState<number>();

        // Обновляет видимость кнопок сролла
        const updatePrevNext = (target: HTMLDivElement) => {
            const pos = target.scrollLeft;
            const width = target.clientWidth;
            const fullWidth = target.scrollWidth;
            setCanPrev(pos > 0);
            setCanNext(pos < fullWidth - width * 1.5);
            //console.log(`pos=${pos} width=${width} fullWidth=${fullWidth}`);
        };

        // Скролл к добавленному изображению
        useEffect(() => {
            if (!listRef.current) return;
            if (width && listRef.current.scrollWidth > width) {
                listRef.current.scrollLeft = listRef.current.scrollWidth - listRef.current.clientWidth;
            }
            setWidth(listRef.current.scrollWidth);
        }, [ listRef.current?.scrollWidth ]);

        // Позиция для вставки и нужно ли показывать кнопки скролла
        useEffect(() => {
            setPos(nodeProps.getPos() + nodeProps.node.nodeSize - 1);
            setCanScroll(nodeProps.node.childCount > 1);
            if (listRef.current && nodeProps.node.childCount > 1) {
                updatePrevNext(listRef.current);
            }
        }, [ nodeProps, listRef ]);

        // Удаляет карусель
        const onDelete = useEditorEventCallback((view) => {
            if (!view) return;
            const pos = nodeProps.getPos();
            const size = nodeProps.node.nodeSize;
            view.dispatch(view.state.tr.delete(pos, pos + size));
        });

        // Вставляет картинку в конец карусели
        const onInsert = () => {
            setIsImagePrompt(true);
        };

        // Отслеживаем событие скролла для определения видимости кнопок листания
        const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
            updatePrevNext(event.currentTarget);
        };

        // Скролл на один кадр вперед или назад
        const scrollTo = (e: React.MouseEvent, step: -1|1) => {
            e.stopPropagation();
            if (!listRef.current) return;
            const width = listRef.current.clientWidth;
            let scroll = listRef.current.scrollLeft + step * width;
            listRef.current.scrollLeft = scroll;
        };

        return (
            <div ref={outerRef} {...props} className='carousel'>
                <div className='carousel-list' ref={listRef} onScroll={onScroll}>
                    {children}
                </div>
                <div className='carousel-buttons'>
                    <div onClick={onDelete} className='text-button'>Удалить карусель</div>
                    <div onClick={onInsert}><Icons.Plus/></div>
                </div>
                {canScroll && <>
                    {canPrev && <div className='carousel-prev' onClick={e => scrollTo(e, -1)}><Icons.ChevronLeft/></div>}
                    {canNext && <div className='carousel-next' onClick={e => scrollTo(e,  1)}><Icons.ChevronRight/></div>}
                </>}
                <InsertImage pos={pos} isOpen={isImagePrompt} onClose={() => setIsImagePrompt(false)} />
            </div>
        );
    }
);

export default CarouselView;
