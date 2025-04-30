import { useState } from 'react';
import { content as initialContent } from './content';
import { Editor, Notes, Viewer } from '../lib';
import ModeSelector from './ModeSelector';
import { getImageIdsFromProse } from '../lib/prose/utils';
import './App.css'

const App = () => {
    const [ content, setContent ] = useState(initialContent);
    const [ isChanged, setIsChanged ] = useState(false);
    const [ mode, setMode ] = useState<string>('editor');

    const onChange = (newMode: string) => {
        setMode(newMode);
    };

    if (mode === 'viewer') return (<>
        <ModeSelector onChange={onChange} changed={isChanged}/>
        <Viewer content={content}/>
    </>);

    if (mode === 'notes') return (<>
        <ModeSelector onChange={onChange} changed={isChanged}/>
        <Notes
            content={content}
            onCancel={() => setMode('viewer')}
            onUpload={() => new Promise(function(resolve) {
                setTimeout(() => resolve(1410), 1000);
            })}
            onSave={(data) => {
                setContent(data.content);
                setMode('viewer')
                console.dir(data.content);
                getImageIdsFromProse(data.content);
            }}
        />
    </>);

    if (mode === 'editor') return (<>
        <ModeSelector onChange={onChange} changed={isChanged}/>
        <Editor
            content={content}
            onChange={(b) => setIsChanged(b)}
            //onView={() => {
            //    setMode('viewer');
            //    setIsChanged(false);
            //}}
            onSave={(data) => new Promise(function(resolve) {
                    setContent(data.content);
                    setMode('viewer');
                    setIsChanged(false);
                    console.dir(data.content);
                    getImageIdsFromProse(data.content);
                    // Имитируем успешное завершение сохранения на сервер
                    setTimeout(() => resolve(undefined), 1000);
            })}
            onUpload={() => new Promise(function(resolve) {
                // Имитируем загрузку картинки на сервер и возврат ее идентификатора
                setTimeout(() => resolve(413), 1000);
                // setTimeout(() => resolve('Error'), 1000);
            })}
        />
    </>);

    return (<>
        <ModeSelector onChange={onChange}/>
        <div>Выберите режим</div>
    </>);
}

export default App
