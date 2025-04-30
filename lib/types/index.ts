/**
 * Публикация
 * Это то, что мы получаем из редактора
 */
export type TPublicationFormat = 'prose';
export type TPublication = {
    format: TPublicationFormat;
    name?: string;   // заголовок
    info?: string;   // аннотация
    cover?: File;    // обложка
    content: string; // содержимое
};
/**
 * Функция обновления содержимого статьи в большом редакторе
 * Возвращает undefined или сообщение об ошибке
 */
export type TEditorSaver = (data: TPublication) => Promise<string | undefined>;
/**
 * Функция обновления содержимого статьи в кратком редакторе
 */
export type TNotesSaver = (data: TPublication) => void;
/**
 * Функция загрузки картинки на сервер
 * Редактор дергает эту функцию, когда надо вставить картинку с диска
 * Возвращает идентификатор созданного файла картинки или сообщение об ошибке
 */
export type TImageUploader = (image: File) => Promise<number | string>;
/**
 * Функции создания и обновления публикации
 */
export type TCreatePublication = (data: TPublication) => void;
export type TUpdatePublication = (data: TPublication, publication_id: number) => void;
