/**
 * Кастомное отображение картинки для реактора.
 * Необходимо для возможности изменения подписи и работы с каруселью.
 */
import { Editable, Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEffect, useEditorEventCallback, useStopEvent } from "@handlewithcare/react-prosemirror";
import { forwardRef, useState } from "react";
import { API_URL } from "../../config";

const ImageView = forwardRef<HTMLDivElement, NodeViewComponentProps>(
    function Image({ children, nodeProps, ...props }, outerRef) {
        const [ alt, setAlt ] = useState(nodeProps.node.attrs.alt ?? '');
        const [ title, setTitle ] = useState(nodeProps.node.attrs.title ?? '');
        const [ canCarousel, setCanCarousel ] = useState(false);
        const [ position, setPosition ] = useState('');

        // Необходимо для возможности редактирования подписи
        useStopEvent((view, event) => {
            if (!view) return false;
            return !(event instanceof MouseEvent);
        });

        // Узнаем можно ли преобразовать картинку в карусель и индекс картинки в карусели
        useEditorEffect((view) => {
            setPosition('');
            setCanCarousel(false);
            if (!view || !view.state.schema.nodes.carousel) return;
            const pos = nodeProps.getPos();
            const parent = view.state.doc.resolve(pos).parent;
            setCanCarousel(parent.type.name !== 'carousel');
            if (parent.type.name === 'carousel') {
                let index = 0;
                parent.forEach((n, i) => {
                    if (n === nodeProps.node) index = i + 1;
                });
                setPosition(index ? `${index} / ${parent.childCount}` : '');
            }
        });

        // Изменение описания
        const onAltChange = useEditorEventCallback((view, alt: string) => {
            if (!view) return;
            setAlt(alt);
            const tr = view.state.tr;
            const pos = nodeProps.getPos();
            view.dispatch(tr.setNodeMarkup(pos, null, { ...nodeProps.node.attrs, alt }));
            view.focus();
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
            const tr = view.state.tr;
            const pos = nodeProps.getPos();
            const size = nodeProps.node.nodeSize;
            view.dispatch(tr.delete(pos, pos + size));
        });

        return (
            <div
                {...props}
                ref={outerRef}
                className='image'
                title={nodeProps.node.attrs.title}
            >
                <div className='image-buttons'>
                    {canCarousel && <div onClick={onMakeCarousel} className='text-button'>Сделать карусель</div>}
                    {position && <div className='text-button'>{position}</div>}
                    <div onClick={onDelete}><Icons.Trash/></div>
                </div>
                <div className='image-title'>
                    <Editable
                        value={alt}
                        placeholder='Alt: описание изображения (не обязательно)'
                        onChange={onAltChange}
                        empty
                        style={{
                            textAlign: 'center',
                            cursor: 'text',
                        }}
                    />
                </div>
                <img
                    title={nodeProps.node.attrs.title}
                    //fid={nodeProps.node.attrs.fid}
                    alt={nodeProps.node.attrs.alt}
                    src={nodeProps.node.attrs.fid ? `${API_URL}/files/${nodeProps.node.attrs.fid}` : nodeProps.node.attrs.src}
                />
                <div className='image-title'>
                    <Editable
                        value={title}
                        placeholder='Title: подпись под изображением (не обязательно)'
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
