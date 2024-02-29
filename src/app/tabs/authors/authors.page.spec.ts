import { db, IBook, IAuthor } from '../../db';

describe('AppDB', () => {
  beforeAll(async () => {
    await db.authors.clear(); // Очищаем таблицу авторов перед началом тестов
  });

  it('test author tables', async () => {
    // Проверяем, что таблица авторов пуста перед тестом
    const authorsBefore = await db.authors.toArray();
    expect(authorsBefore.length).toBe(0);


    // Вызываем метод populate(), который добавляет данные в базу
    await db.populate();

    // Проверяем, что таблица авторов содержит авторов после вызова populate()
    const authorsAfter = await db.authors.toArray();
    expect(authorsAfter.length).toBeGreaterThan(0);
  });
});
