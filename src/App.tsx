import { useState } from 'react';
import { content as initialContent } from './content';
import { Editor, Notes, Viewer } from '../lib';
import ModeSelector from './ModeSelector';
import { getImageIdsFromProse } from '../lib/utils/utils';
import './App.css';

const App = () => {
    const [ content, setContent ] = useState(initialContent);
    const [ isChanged, setIsChanged ] = useState(false);
    const [ mode, setMode ] = useState<string>('editor');

    // Имитируем загрузку картинки на сервер
    const onUpload = () => {
        return new Promise<string|number>(function(resolve) {
            const ids = [3070, 3065, 3064, 3060, 3057, 3054, 3042, 3023, 2986, 2963, 2942];
            const id = ids[Math.round(Math.random() * (ids.length - 1))];
            // Нормальная загрузка
            setTimeout(() => resolve(id), 1000);
            // Имитация ошибки
            // setTimeout(() => resolve('onUpload: Имитация ошибки при загрузке картинки'), 1000);
        })
    };

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
            title={true}
            content={content}
            onCancel={() => setMode('viewer')}
            onChange={(b) => setIsChanged(b)}
            onUpload={onUpload}
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
            onUpload={onUpload}
        />
    </>);

    return (<>
        <ModeSelector onChange={onChange}/>
        <div>Выберите режим</div>
    </>);
};

export default App;
