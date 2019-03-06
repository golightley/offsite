import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RealStateListingModel } from './real-state-listing.model';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-real-state-listing',
  templateUrl: './real-state-listing.page.html',
  styleUrls: [
    './styles/real-state-listing.page.scss',
    './styles/real-state-listing.shell.scss'
  ]
})
export class RealStateListingPage implements OnInit {
  radioTagsForm: FormGroup;

  listing: RealStateListingModel;

  // You can add a class to know when the shell has finish loading to the entire page or by using [ngClass] in the html
  //    <ion-content [ngClass]="{'is-shell': (listing.isShell)}">
  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(private route: ActivatedRoute, radioTagsForm: FormGroup) { this.radioTagsForm = new FormGroup({
    selected_option: new FormControl('any')
  });}

  ngOnInit(): void {
    if (this.route && this.route.data) {
      // We resolved a promise for the data Observable
      const promiseObservable = this.route.data;
      console.log('Route Resolve Observable => promiseObservable: ', promiseObservable);

      if (promiseObservable) {
        promiseObservable.subscribe(promiseValue => {
          const dataObservable = promiseValue['data'];
          console.log('Subscribe to promiseObservable => dataObservable: ', dataObservable);

          if (dataObservable) {
            dataObservable.subscribe(observableValue => {
              const pageData: RealStateListingModel = observableValue;
              // tslint:disable-next-line:max-line-length
              console.log('Subscribe to dataObservable (can emmit multiple values) => PageData (' + ((pageData && pageData.isShell) ? 'SHELL' : 'REAL') + '): ', pageData);
              // As we are implementing an App Shell architecture, pageData will be firstly an empty shell model,
              // and the real remote data once it gets fetched
              if (pageData) {
                this.listing = pageData;
              }
            });
          } else {
            console.warn('No dataObservable coming from Route Resolver promiseObservable');
          }
        });
      } else {
        console.warn('No promiseObservable coming from Route Resolver data');
      }
    } else {
      console.warn('No data coming from Route Resolver');
    }
  }


}
