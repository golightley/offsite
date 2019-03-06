import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { FashionDetailsModel } from './fashion-details.model';

@Component({
  selector: 'app-fashion-details',
  templateUrl: './fashion-details.page.html',
  styleUrls: [
    './styles/fashion-details.page.scss',
    './styles/fashion-details.shell.scss',
    './styles/fashion-details.ios.scss',
    './styles/fashion-details.md.scss'
  ]
})
export class FashionDetailsPage implements OnInit {
  details: FashionDetailsModel;
  colorVariants = [];
  sizeVariants = [];
  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };

  @HostBinding('class.is-shell') get isShell() {
    return (this.details && this.details.isShell) ? true : false;
  }

  constructor(
    private route: ActivatedRoute,
    public alertController: AlertController
  ) { }

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
              const pageData: FashionDetailsModel = observableValue;
              // tslint:disable-next-line:max-line-length
              console.log('Subscribe to dataObservable (can emmit multiple values) => PageData (' + ((pageData && pageData.isShell) ? 'SHELL' : 'REAL') + '): ', pageData);
              // As we are implementing an App Shell architecture, pageData will be firstly an empty shell model,
              // and the real remote data once it gets fetched
              if (pageData) {
                this.details = pageData;

                this.colorVariants = this.details.colorVariants
                .map(item =>
                  ({
                    name: item.name,
                    type: 'radio',
                    label: item.name,
                    value: item.value,
                    checked: item.default
                  })
                );
                this.sizeVariants = this.details.sizeVariants
                .map(item =>
                  ({
                    name: item.name,
                    type: 'radio',
                    label: item.name,
                    value: item.value,
                    checked: item.default
                  })
                );
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

  async openColorChooser() {
    const alert = await this.alertController.create({
      header: 'Color',
      inputs: this.colorVariants,
      cssClass: 'variant-alert color-chooser',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async openSizeChooser() {
    const alert = await this.alertController.create({
      header: 'Size',
      inputs: this.sizeVariants,
      cssClass: 'variant-alert size-chooser',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: (selectedValue) => {
            console.log('Selected Value', selectedValue);
          }
        }
      ]
    });

    await alert.present();
  }
}
