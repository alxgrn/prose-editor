/**
 * Карусель с картинками
 */
import { Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { forwardRef, useState } from "react";
import InsertImage from "../menubar/elements/InsertImage";

const CarouselView = forwardRef<HTMLDivElement, NodeViewComponentProps>(
    function Carousel({ children, nodeProps, ...props }, outerRef) {
        const [ isImagePrompt, setIsImagePrompt ] = useState(false);

        // Удаляет карусель
        const onDelete = useEditorEventCallback((view) => {
            if (!view) return;
            const pos = nodeProps.getPos();
            const size = nodeProps.node.nodeSize;
            view.dispatch(view.state.tr.delete(pos, pos + size));
        });

        return (
            <div ref={outerRef} {...props} className='carousel'>
                <div className='carousel-buttons'>
                    <div onClick={onDelete}><small>Удалить карусель</small></div>
                    <div onClick={() => setIsImagePrompt(true)}><Icons.Image/></div>
                </div>
                <InsertImage isOpen={isImagePrompt} onClose={() => setIsImagePrompt(false)} />
                {children}
            </div>
        );
    }
);

export default CarouselView;
