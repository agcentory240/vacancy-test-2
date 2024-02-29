import { Component, OnInit, ViewChild } from '@angular/core';
import { db, IAuthor, IBook } from '../../db';
import { IonModal } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService} from '../../services/subscription.service';


@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {

  booksWithAuthors: any[] = [];  //combined array with book and authors

  genresArray: any[] = [];  //Array with genres

  languagesArray: any[] = [];  //Array with genres

  authorsArray: any[] = [];  //Array with authors

  isFilterModalOpen: boolean = false;

  isNewBookModalOpen: boolean = false;

  @ViewChild(IonModal) modal!: IonModal;

  minPageCount: number = 0;

  maxPageCount: number = 0;

  selectedGenre: any[] = [];

  selectedLanguages: any[] = [];

  selectedAuthors: any[] = [];

  searchTerm: string = "";

  bookForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private toastController: ToastController, private subscriptionService:SubscriptionService) {

    //Форма для новой книги
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.required],
      pageCount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      language: ['', Validators.required],
      genre: ['', Validators.required],
    });

    this.subscriptionService.authorsHasChanges().subscribe(()=>{
      console.log("Authors db was changes - nbeed reload data");
      this.getBooksData().then((booksWithAuthors: any) => this.booksWithAuthors = booksWithAuthors);
    })

  }

  ngOnInit() {
    this.getBooksData().then((booksWithAuthors: any) => this.booksWithAuthors = booksWithAuthors);
  }


  async getBooksData() {
    console.log("Load book fired!");
    //все книги
    let booksDB: any = db.books;

    let collection = booksDB.orderBy('title').filter((book: IBook) => {

      let ret = true;

      //условие минимальное и количество страниц
      if (this.minPageCount > 0 && book.pageCount < this.minPageCount) ret = false;
      if (this.maxPageCount > 0 && book.pageCount > this.maxPageCount) ret = false;

      //автор
      if (this.selectedAuthors.length > 0 && !this.selectedAuthors.includes(book.authorId)) ret = false;

      //жанр
      if (this.selectedGenre.length > 0 && !this.selectedGenre.includes(book.genre)) ret = false;

      //язык
      if (this.selectedLanguages.length > 0 && !this.selectedLanguages.includes(book.language)) ret = false;


      //поиск
      if (this.searchTerm != '' && !book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) && !book.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ret = false;

      return ret
    });;

    let books = await collection.toArray();
    // let books = await booksDB.toArray();

    this.authorsArray = await db.authors.orderBy('name').toArray();


    //Все жанры
    let books_all = await db.books.toArray();
    let genres = new Set<string>();
    books_all.forEach((book: IBook) => genres.add(book.genre));
    this.genresArray = Array.from(genres);

    //Все языки
    let languages = new Set<string>();
    books_all.forEach((book: IBook) => languages.add(book.language));
    this.languagesArray = Array.from(languages);

    // совместим с автором
    let booksWithAuthors = books.map(async (book: any) => {
      let bookInfo = { id: book.id, title: book.title, pageCount: book.pageCount, language: book.language, genre: book.genre };
      let author = await db.authors.get(book.authorId);
      const authorName = author ? author.name : '-';
      return { ...bookInfo, authorName: authorName };
    });

    return Promise.all(booksWithAuthors);
  }

  //close modal wo apply
  cancel() {
    this.modal.dismiss();
    this.isFilterModalOpen = false;
    this.isNewBookModalOpen = false;
  }

  //if modal close
  onWillDismissFilterModal(event: Event) {
    this.isFilterModalOpen = false;
  }

  setFilter() {
    this.getBooksData().then((booksWithAuthors: any) => this.booksWithAuthors = booksWithAuthors);
    this.isFilterModalOpen = false;
  }

  clearFilter() {
    this.minPageCount = 0;
    this.maxPageCount = 0
    this.selectedAuthors = [];
    this.selectedLanguages = [];
    this.selectedGenre = [];
    this.searchTerm = "";
    this.getBooksData().then((booksWithAuthors: any) => this.booksWithAuthors = booksWithAuthors);
    this.isFilterModalOpen = false;
  }


  // Для удобства доступа
  get f() {
    return this.bookForm.controls;
  }

  //Сохраним книгу
  async saveBook() {
    if (this.bookForm.valid) {

      //Валидная форма
      const newBook: IBook = {
        title: this.bookForm.value.title,
        description: this.bookForm.value.description,
        authorId: this.bookForm.value.author,
        pageCount: this.bookForm.value.pageCount,
        language: this.bookForm.value.language,
        genre: this.bookForm.value.genre,
      };
      await db.books.add(newBook);
      this.getBooksData().then((booksWithAuthors: any) => this.booksWithAuthors = booksWithAuthors);
      this.isNewBookModalOpen = false;

      const toast = await this.toastController.create({
        message: 'Книга добавлена!',
        color: 'success',
        duration: 1500,
        position: 'bottom',
      });

      await toast.present();

    } else {

      // Если форма невалидна, показываем сообщения об ошибке пользователю
      // и помечаем все поля как touched, чтобы показать сообщения об ошибке
      Object.keys(this.bookForm.controls).forEach((field) => {
        const control = this.bookForm.get(field);
        control!.markAsTouched({ onlySelf: true });
      });
    }
  }
}
