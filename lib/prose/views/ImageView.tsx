/**
 * Кастомное отображение картинки для реактора.
 * Необходимо для возможности изменения подписи.
 */
import { Editable, Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEffect, useEditorEventCallback, useStopEvent } from "@handlewithcare/react-prosemirror";
import { forwardRef, useState } from "react";
import { API_URL } from "../../config";


const ImageView = forwardRef<HTMLDivElement, NodeViewComponentProps>(
    function Image({ children, nodeProps, ...props }, outerRef) {
        const [ title, setTitle ] = useState(nodeProps.node.attrs.title ?? '');
        const [ canCarousel, setCanCarousel ] = useState(false);

        // Необходимо для возможности редактирования подписи
        useStopEvent(() => {
            return true;
        });

        // Узнаем можно ли преобразовать картинку в карусель
        useEditorEffect((view) => {
            setCanCarousel(false);
            if (!view || !view.state.schema.nodes.carousel) return;
            const pos = nodeProps.getPos();
            const parent = view.state.doc.resolve(pos).parent;
            setCanCarousel(parent.type.name !== 'carousel');
            parent.childCount
        });

        // Изменение подписи
        const onTitleChange = useEditorEventCallback((view, title: string) => {
            if (!view) return;
            setTitle(title);
            const tr = view.state.tr;
            const pos = nodeProps.getPos();
            view.dispatch(tr.setNodeMarkup(pos, null, { ...nodeProps.node.attrs, title }));
            view.focus();
        });

        // Меняем на карусель
        const onMakeCarousel = useEditorEventCallback((view) => {
            if (!view) return;
            const pos = nodeProps.getPos();
            const size = nodeProps.node.nodeSize;
            const attrs = nodeProps.node.attrs;
            const schema = view.state.schema;
            const carousel = schema.nodes.carousel.create(null, schema.nodes.image.create(attrs));
            view.dispatch(view.state.tr.replaceWith(pos, pos + size, carousel));
        });

        // Удаляет картинку
        const onDelete = useEditorEventCallback((view) => {
            if (!view) return;
            const pos = nodeProps.getPos();
            const size = nodeProps.node.nodeSize;
            const parent = view.state.doc.resolve(pos).parent;
            const tr = view.state.tr;
            if (parent.type.name === 'carousel' && parent.childCount === 1) {
                // Если это была единственная картинка в карусели, то удаляем пустую карусель
                view.dispatch(tr.delete(pos - 1, pos - 1 + parent.nodeSize));
            } else {
                // Иначе просто удаляем саму картинку
                view.dispatch(tr.delete(pos, pos + size));
            }
        });

        return (
            <div
                {...props}
                ref={outerRef}
                className='image'
                title={nodeProps.node.attrs.title}
            >
                <div className='image-buttons'>
                    {canCarousel && <div onClick={onMakeCarousel}><small>Сделать карусель</small></div>}
                    <div onClick={onDelete}><Icons.Trash/></div>
                </div>
                <img
                    title={nodeProps.node.attrs.title}
                    //fid={nodeProps.node.attrs.fid}
                    alt={nodeProps.node.attrs.alt}
                    src={nodeProps.node.attrs.fid ? `${API_URL}/files/${nodeProps.node.attrs.fid}` : nodeProps.node.attrs.src}
                />
                <div>
                    <Editable
                        value={title}
                        placeholder='Подпись под изображением (не обязательно)'
                        onChange={onTitleChange}
                        empty
                        style={{
                            textAlign: 'center',
                            cursor: 'text',
                        }}
                    />
                </div>
            </div>
        );
    }
);

export default ImageView;
