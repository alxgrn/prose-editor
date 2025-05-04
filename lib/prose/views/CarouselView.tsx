/**
 * Карусель с картинками
 */
import { Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback, useStopEvent } from "@handlewithcare/react-prosemirror";
import { forwardRef, useEffect, useRef, useState } from "react";
import InsertImage from "../menubar/elements/InsertImage";
import { TextSelection } from "prosemirror-state";

const CarouselView = forwardRef<HTMLDivElement, NodeViewComponentProps>(
    function Carousel({ children, nodeProps, ...props }, outerRef) {
        const listRef = useRef<HTMLDivElement>(null);
        const [ isImagePrompt, setIsImagePrompt ] = useState(false);
        const [ canScroll, setCanScroll ] = useState(false);
        const [ canPrev, setCanPrev ] = useState(false);
        const [ canNext, setCanNext ] = useState(false);

        // Не уверен что тут это необходимо, т.к. в ImageView оно уже есть
        useStopEvent(() => {
            return true;
        });

        // Нужно ли показывать кнопки скролла
        useEffect(() => {
            setCanScroll(nodeProps.node.childCount > 1);
        }, [ nodeProps ]);

        // Удаляет карусель
        const onDelete = useEditorEventCallback((view) => {
            if (!view) return;
            const pos = nodeProps.getPos();
            const size = nodeProps.node.nodeSize;
            view.dispatch(view.state.tr.delete(pos, pos + size));
        });

        // Устанавливает курсор в конец карусели и вставляет картинку
        const onInsert = useEditorEventCallback((view) => {
            if (!view) return;
            const pos = nodeProps.getPos();
            const size = nodeProps.node.nodeSize;
            const selPos = view.state.doc.resolve(pos + size - 1);
            view.dispatch(view.state.tr.setSelection(new TextSelection(selPos)));
            setIsImagePrompt(true);
        });

        // Отслеживаем событие скролла для определения видимости кнопок листания
        const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
            const pos  = event.currentTarget.scrollLeft;
            const width = event.currentTarget.clientWidth;
            const fullWidth = event.currentTarget.scrollWidth;
            setCanPrev(pos > 0);
            setCanNext(fullWidth - pos > width);
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
                    <div onClick={onDelete}><small>Удалить карусель</small></div>
                    <div onClick={onInsert}><Icons.Image/></div>
                </div>
                {canScroll && <>
                    {canPrev && <div className='carousel-prev' onClick={e => scrollTo(e, -1)}><Icons.ChevronLeft/></div>}
                    {canNext && <div className='carousel-next' onClick={e => scrollTo(e,  1)}><Icons.ChevronRight/></div>}
                </>}
                <InsertImage isOpen={isImagePrompt} onClose={() => setIsImagePrompt(false)} />
            </div>
        );
    }
);

export default CarouselView;
