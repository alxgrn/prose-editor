/**
 * Карусель с картинками
 */
import { NodeViewComponentProps } from "@handlewithcare/react-prosemirror";
import { forwardRef } from "react";

const CarouselView = forwardRef<HTMLDivElement, NodeViewComponentProps>(
    function Carousel({ children, nodeProps, ...props }, outerRef) {

        return (
            <div ref={outerRef} {...props} className='carousel'>
                <div>Карусель</div>
                {children}
            </div>
        );
    }
);

export default CarouselView;
