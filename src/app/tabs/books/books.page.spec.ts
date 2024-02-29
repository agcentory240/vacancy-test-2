import { db, IBook, IAuthor } from '../../db';

describe('AppDB', () => {
  beforeAll(async () => {
    await db.books.clear(); // Очищаем таблицу авторов перед началом тестов
  });

  it('test books tables', async () => {
    // Проверяем, что таблица книг пуста перед тестом
    const booksBefore = await db.books.toArray();
    expect(booksBefore.length).toBe(0);


    // Вызываем метод populate(), который добавляет данные в базу
    await db.populate();

    // Проверяем, что таблица книмг содержит авторов после вызова populate()
    const booksAfter = await db.books.toArray();
    expect(booksAfter.length).toBeGreaterThan(0);
  });
  
});
