/**
 * Кастомное отображение видео для реактора.
 * Необходимо для возможности изменения подписи и URL.
 */
import { Editable } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback, useStopEvent } from "@handlewithcare/react-prosemirror";
import { forwardRef, useEffect, useState } from "react";
import { sanitizeVideoURL } from "../../utils/link";
import { ERROR_EMBED_DATA } from "../../config";


const VideoView = forwardRef<HTMLTableElement, NodeViewComponentProps>(
    function Video({ children, nodeProps, ...props }, outerRef) {
        const [ src, setSrc ] = useState('');
        const [ title, setTitle ] = useState(nodeProps.node.attrs.title ?? '');
        const allow = 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

        useStopEvent(() => {
            return true;
        });

        useEffect(() => {
            setSrc(sanitizeVideoURL(nodeProps.node.attrs.src));
        }, [ nodeProps ]);

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
                    if (node.type.name === 'video') {
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
                className={src ? 'video' : 'image'}
                title={nodeProps.node.attrs.title}
            >
                {src ? <iframe src={src} allow={allow} /> : <img src={ERROR_EMBED_DATA} />}
                <div>
                    <Editable
                        value={title}
                        placeholder='Подпись под видео (не обязательно)'
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

export default VideoView;
