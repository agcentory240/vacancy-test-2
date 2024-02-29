import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { db, IAuthor, IBook } from '../../../db';

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.page.html',
  styleUrls: ['./book-item.page.scss'],
})
export class BookItemPage implements OnInit {

  book_id!: number;
  bookInfo: IBook | undefined;
  authorInfo: IAuthor | undefined;
  book_load: boolean = false;
  constructor(private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.book_id = parseInt(this.route.snapshot.paramMap.get("id")!);
    this.getBookData();
  }


  async getBookData() {
    this.bookInfo  = await db.books.get(this.book_id);
    if (this.bookInfo) {
      this.authorInfo  = await db.authors.get(this.bookInfo.authorId);
      if (this.authorInfo) {
        console.log(this.bookInfo);
        this.book_load = true;
      } else {

      }
    } else {
      console.error("Книга не найдена")
    }
  }
}
