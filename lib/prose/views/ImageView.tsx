/**
 * Кастомное отображение картинки для реактора.
 * Необходимо для возможности изменения подписи.
 */
import { Editable } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback, useStopEvent } from "@handlewithcare/react-prosemirror";
import { forwardRef, useState } from "react";
import { API_URL } from "../../config";


const ImageView = forwardRef<HTMLTableElement, NodeViewComponentProps>(
    function Image({ children, nodeProps, ...props }, outerRef) {
        const [ title, setTitle ] = useState(nodeProps.node.attrs.title ?? '');

        // Необходимо для возможности редактирования подписи
        useStopEvent(() => {
            return true;
        });

        const onClick = useEditorEventCallback((view, title: string) => {
            if (!view) return;
            setTitle(title);
            // Используем механизм обхода всех нод в выделении
            // также как в присвоении выравнивания в текстовых блоках.
            // Но наверняка есть более правильный способ т.к. у нас в
            // выделении должна быть только одна нода с картинкой.
            const { $from, $to } = view.state.selection;
            const nodeRange = $from.blockRange($to);
            if (nodeRange) {
                const parent = view.state.doc;
                //console.log(`start=${nodeRange.start}, end=${nodeRange.end}`)
                let tr = view.state.tr;
                parent.nodesBetween(nodeRange.start, nodeRange.end, (node, pos) => {
                    if (node.type.name === 'image') {
                        tr = tr.setNodeMarkup(pos, null, { ...nodeProps.node.attrs, title });
                    }
                });
                view.dispatch(tr);
            }
            view.focus();
        });

        return (
            <div
                {...props}
                ref={outerRef}
                className='image'
                title={nodeProps.node.attrs.title}
            >
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
                        onChange={onClick}
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
