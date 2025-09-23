/**
 * Кастомное отображение видео для реактора.
 * Необходимо для возможности изменения подписи и URL.
 */
import { Editable } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback, useStopEvent } from "@handlewithcare/react-prosemirror";
import { forwardRef, useEffect, useState } from "react";
import { validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from "../../utils/link";
import { ERROR_EMBED } from "../../utils/config";


const VideoView = forwardRef<HTMLDivElement, NodeViewComponentProps>(
    function Video({ children, nodeProps, ...props }, outerRef) {
        const [ src, setSrc ] = useState('');
        const [ rutube, setRutube ] = useState('');
        const [ youtube, setYoutube ] = useState('');
        const [ vkvideo, setVkvideo ] = useState('');
        const [ title, setTitle ] = useState(nodeProps.node.attrs.title ?? '');
        const allow = 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

        useStopEvent(() => {
            return true;
        });

        useEffect(() => {
            let src = nodeProps.node.attrs.src;
            if (typeof src === 'string') src = [src];
            (src as string[]).forEach(url => {
                if (validateRutubeURL(url)) {
                    setSrc(url);
                    setRutube(url); 
                } else if (validateYoutubeURL(url)) {
                    setSrc(url);
                    setYoutube(url); 
                } else if (validateVkvideoURL(url)) {
                    setSrc(url);
                    setVkvideo(url);
                }
            });
        }, [ nodeProps ]);

        const onTitle = useEditorEventCallback((view, title: string) => {
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
                className='video'
                title={nodeProps.node.attrs.title}
            >
                <div className='video-switcher'>
                    {rutube  && <div onClick={() => setSrc(rutube)}  className={src === rutube  ? 'active' : ''}>RuTube</div>}
                    {youtube && <div onClick={() => setSrc(youtube)} className={src === youtube ? 'active' : ''}>YouTube</div>}
                    {vkvideo && <div onClick={() => setSrc(vkvideo)} className={src === vkvideo ? 'active' : ''}>VK Video</div>}
                </div>
                {src ? <iframe src={src} allow={allow} /> : <img src={ERROR_EMBED} />}
                <div className='video-title'>
                    <Editable
                        value={title}
                        placeholder='Подпись под видео (не обязательно)'
                        onChange={onTitle}
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
