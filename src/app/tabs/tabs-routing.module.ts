import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'books',
        loadChildren: () => import('./books/books.module').then( m => m.BooksPageModule)
      },
      {
        path: 'authors',
        loadChildren: () => import('./authors/authors.module').then( m => m.AuthorsPageModule)
      }      
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
