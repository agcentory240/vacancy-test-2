import { Component, OnInit, ViewChild } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, IAuthor } from '../../db';
import { IonModal } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.page.html',
  styleUrls: ['./authors.page.scss'],
})
export class AuthorsPage implements OnInit {

  authohsList$ = liveQuery(() => db.authors.orderBy('name').toArray());
  @ViewChild(IonModal) modal!: IonModal;

  isAuthorEditModalOpen: boolean = false; //if modal is open
  modalEditMode: boolean = false; //true if edit, false if new author
  selectedAuthor:any; //current selected author for editing
  authorName:string = ""; // current author name
  
  constructor(private toastController: ToastController,private subscriptionService:SubscriptionService) { }

  ngOnInit() {
  }

  //close modal wo saving
  cancel() {
    this.modal.dismiss();
    this.modalEditMode = false;
    this.isAuthorEditModalOpen = false;
    this.selectedAuthor = null;
  }

  //if modal close
  onWillDismissAuthorModal(event: Event) {
    this.modalEditMode = false;
    this.isAuthorEditModalOpen = false;
    this.selectedAuthor = null;
  }

  //save author (new or editable)
  async save() {

    if (this.modalEditMode) {
      console.log(this.selectedAuthor);
      //update
      if (this.selectedAuthor) {
        await db.authors.update(this.selectedAuthor.id, { name: this.authorName });

        const toast = await this.toastController.create({
          message: 'Данные сохранены!',
          color: 'success',
          duration: 1500,
          position: 'bottom',
        });
    
        await toast.present();
        this.subscriptionService.authorWasChanged();

      } else {
        //some wet wrong
        const toast = await this.toastController.create({
          message: 'Error on save! Please contact to admin!',
          color: 'danger',
          duration: 1500,
          position: 'bottom',
        });
    
        await toast.present();        
      }


    } else {
      //create new author
      let author: IAuthor = {
        name: this.authorName
      }
      await db.authors.add(author);      

      const toast = await this.toastController.create({
        message: 'Данные сохранены!',
        color: 'success',
        duration: 1500,
        position: 'bottom',
      });
  
      await toast.present();      
    }

    this.modalEditMode = false;
    this.isAuthorEditModalOpen = false;
    this.selectedAuthor = null;    
  }

}
