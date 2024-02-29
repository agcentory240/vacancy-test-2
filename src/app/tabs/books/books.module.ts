import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BooksPageRoutingModule } from './books-routing.module';
import { BookItemPage } from './book-item/book-item.page';
import { BooksPage } from './books.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BooksPageRoutingModule
  ],
  declarations: [BooksPage,BookItemPage]
})
export class BooksPageModule {}
