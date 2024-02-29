// db.ts
import Dexie, { Table } from 'dexie';

export interface IBook {
    id?: number;
    title: string;
    authorId: number;
    pageCount: number;
    language: string;
    description: string;
    genre: string;
}

// author.interface.ts
export interface IAuthor {
    id?: number;
    name: string;
}

export class AppDB extends Dexie {
    public books!: Dexie.Table<IBook, number>;
    public authors!: Dexie.Table<IAuthor, number>;
    fakeTitles: string[] = [];

    constructor() {
        super('MyBookDatabase');
        this.version(3).stores({
            books: '++id, title, authorId, pageCount, language, genre, description',
            authors: '++id, name'
        });
        this.on('populate', () => this.populate());
    }

    async populate() {
        // Авторы
        const authors = [
            { name: 'Александр Пушкин' },
            { name: 'Лев Толстой' },
            { name: 'Фёдор Достоевский' },
            { name: 'Николай Гоголь' },
            { name: 'Иван Тургенев' },
            { name: 'Михаил Лермонтов' },
            { name: 'Антон Чехов' },
            { name: 'Игорь Линарес' }, // 
        ];

        // Книги
        this.fakeTitles = [
            'Путешествие в неизвестность',
            'Тень прошлого',
            'Секреты мира',
            'Загадочные приключения',
            'Остров забытых снов',
            'Легенды древних времен',
            'Подземный город',
            'Сверхъестественное исследование',
            'Темная сторона луны',
            'Магия звездного света',
            'Дневник проклятого',
            'Роковой сигнал',
            'Повесть о вечности',
            'Мечтающий город',
            'Сердце забытого королевства',
            'Жизнь после конца света',
            'Стражи времени',
            'Детективное расследование XXI века',
            'Звездные войны во вселенной',
            'Последний день существования',
            'Погоня за иллюзиями',
            'Герои и враги',
            'Тайна потерянного клада',
            'Проклятый артефакт',
            'Ловушка для пришельцев',
            'Смелые души',
            'Драконий огонь',
            'Рыцари тьмы',
            'Возвращение в реальность',
            'Спасение мира: истина внутри нас',
            'Забытые хроники',
            'Подземные тайны',
            'В поисках истинного смысла',
            'Пещера забытых желаний',
            'Современные рыцари',
            'Сердце безмолвных гор',
            'Песни древних ветров',
            'Тени прошлого',
            'Мистические земли',
            'Странные встречи',
            'Повелитель времени',
            'Дорога в никуда',
            'Последний шанс для человечества',
            'Таинственный артефакт',
            'Легенды о древних богах',
            'Конец света: история новой эры',
            'Забытые миры',
            'Призрачные сны',
            'Пленники прошлого'
        ];

        for (let author of authors) {
            let authorId = await this.authors.add(author);
            // Добавляем книги для каждого автора
            for (let i = 0; i < 5; i++) {

                let book_title = this.getRandomBookAndRemove();
                let language = this.getRandomLanguage();
                let genre = this.getRandomGenre();
                let description = this.getRandomDescription();
                if (book_title != "") {
                    await this.books.add({
                        title: book_title,
                        authorId: authorId,
                        description: description ,
                        pageCount: Math.floor(Math.random() * 400) + 100, // случайное количество страниц от 100 до 500
                        language: language,
                        genre: genre
                    });
                }

            }
        }
    }

    /**
     * Случайный жанр
     * @returns genre
     */
    private getRandomGenre(): string {
        let genres = ['Фантастика', 'Роман', 'Поэзия', 'Детектив', 'Фэнтези', 'Драма', 'Классика'];
        return genres[Math.floor(Math.random() * genres.length)];
    }


    /**
     * Случайный язык
     * @returns language
     */
    private getRandomLanguage(): string {
        let languages = ['Русский', 'Немецкий', 'Английский', 'Китайский'];
        return languages[Math.floor(Math.random() * languages.length)];
    }

    /**
     * Случайная книга
     * @returns название книги
     */
    public getRandomBookAndRemove(): string {
        if (this.fakeTitles.length === 0) {
            return ''; // Если массив книг пуст, возвращаем undefined
        }

        // Получаем случайную книгу
        let randomIndex = Math.floor(Math.random() * this.fakeTitles.length);
        let randomBook = this.fakeTitles[randomIndex];

        // Удаляем выбранную книгу из массива
        this.fakeTitles.splice(randomIndex, 1);

        return randomBook;
    }

    /**
     * Случайное описание
     * @returns текст описаия
     */
    public getRandomDescription(): string {
        let sourceStrings:any[] = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
        let randomCount = Math.floor(Math.random() * sourceStrings.length) + 10;
        let selectedStrings: string[] = [];
        for (let i = 0; i < randomCount; i++) {
            const randomIndex = Math.floor(Math.random() * sourceStrings.length);
            selectedStrings.push(sourceStrings[randomIndex]);
          }        
        return selectedStrings.join(' ');
    }
}
export const db = new AppDB();