import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BooksPage } from './books.page';
import { BookItemPage } from './book-item/book-item.page';

const routes: Routes = [
  {
    path: '',
    component: BooksPage,
  },
  {
    path: 'book-item/:id',
    component: BookItemPage
  }      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksPageRoutingModule {}
