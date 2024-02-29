import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  authorSubscription = new Subject<any>();

  constructor() { }

  //Изменение авторов
  public authorsHasChanges():Observable<any> {
    return this.authorSubscription.asObservable();
  }  

  //если произошли изменения в авторах
  public authorWasChanged() {
    this.authorSubscription.next(true);
  }  
}
