import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class NotificationsService {
  public myParam: any; 

  constructor(private http: HttpClient) { }

  public getData(): Observable<any> {
    const dataObservable = this.http.get<any>('./assets/sample-data/notifications.json');

    return dataObservable;
  }
}
