import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import * as dayjs from 'dayjs';

import { ShellProvider } from '../utils/shell-provider';

import { DealsListingModel, DealsItemModel } from './listing/deals-listing.model';
import { DealsDetailsModel } from './details/deals-details.model';

@Injectable()
export class DealsService {
  private _listingWithShellCache: ShellProvider<DealsListingModel>;
  private _detailsWithShellCache: ShellProvider<DealsDetailsModel>;

  constructor() { }

  public getListingDataWithShell(): Observable<DealsListingModel> {
    // Use cache if we have it.
    if (!this._listingWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: DealsListingModel = new DealsListingModel(true);
      const dataObservable = this.getListingData();

      this._listingWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._listingWithShellCache.observable;
  }

  public getListingData(): Observable<DealsListingModel> {
    // Simple approach: get data from json
    // () => this.http.get<DealsListingModel>('./assets/sample-data/deals/listing.json')

    // Alternate approach: I opted to create this model here so I can always show fresh dates (relative to now, not hardcoded ones)

    const dealsListingModel = {
      items: [
        {
          slug: '50-off-lindt',
          code: 'CHOC4LIFE',
          description: 'Lindt Excellence 70% Cocoa Chocolate Diamonds 60ct Box with Lancaster for $10.26',
          name: '50% OFF Lindt',
          // Relative date (better to showcase UI micro-interactions)
          expirationDate: dayjs().add(1, 'day').add(8, 'hour').add(10, 'second').format('MM/DD/YYYY HH:mm:ss') as string,
          // Instead of hardcoded one
          // expirationDate: '12/01/2018',
          logo: './assets/sample-images/deals/Deals1-4.1.png'
        } as DealsItemModel,
        {
          slug: '20-off-landscape-lighting',
          code: '20LIGHT25',
          description: '20% off Landscape Lighting and 25% off Outdoor Wall Light Fixtures with Coupon Code',
          name: '20% OFF Landscape Lighting',
          expirationDate: dayjs().add(7, 'day').format('MM/DD/YYYY') as string,
          logo: './assets/sample-images/deals/Deals2-4.1.png'
        } as DealsItemModel,
        {
          slug: '3-months-free-trial',
          code: 'MORETVPLZ3',
          description: 'Starz HD free trial extended for 3 months, in time for the new seasons of your favourite shows',
          name: '3 Months FREE (Trial)',
          expirationDate: dayjs().subtract(1, 'month').format('MM/DD/YYYY') as string,
          logo: './assets/sample-images/deals/Deals3-4.1.png'
        } as DealsItemModel,
        {
          slug: 'cat-limited-time-offer',
          code: 'GETTHATPHONE212',
          description: 'Free 4 Month Notevault Subscription With Cat® Phones worth $578',
          name: 'CAT Limited Time Offer',
          expirationDate: dayjs().add(2, 'month').format('MM/DD/YYYY') as string,
          logo: './assets/sample-images/deals/Deals4-4.1.png'
        } as DealsItemModel
      ]
    } as DealsListingModel;

    return of(dealsListingModel);
  }

  public getDetailsDataWithShell(): Observable<DealsDetailsModel> {
    // Use cache if we have it.
    if (!this._detailsWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: DealsDetailsModel = new DealsDetailsModel(true);
      const dataObservable = this.getDetailsData();

      this._detailsWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._detailsWithShellCache.observable;
  }


  public getDetailsData(): Observable<DealsDetailsModel> {
    // Simple approach: get data from json
    // () => this.http.get<DealsDetailsModel>('./assets/sample-data/deals/details.json')

    // Alternate approach: I opted to create this model here so I can always show fresh dates (relative to now, not hardcoded ones)

    const dealsDetailsModel = {
      showcaseImages: [
        './assets/sample-images/deals/Deal-Details-showcase-1.jpg',
        './assets/sample-images/deals/Deal-Details-showcase-2.jpg'
      ],
      previewImage: './assets/sample-images/deals/Deal-Details-preview.png',
      logo: './assets/sample-images/deals/Deals1-4.1.png',
      name: '50% OFF Lindt',
      code: 'CHOC4LIFE',
      description: 'Lindt Excellence 70% Cocoa Chocolate Diamonds 60ct Box with Lancaster for $10.26',
      // Relative date (better to showcase UI micro-interactions)
      expirationDate: dayjs().add(1, 'day').add(8, 'hour').add(10, 'second').format('MM/DD/YYYY HH:mm:ss') as string,
      // Instead of hardcoded one
      // expirationDate: '12/01/2018',
      relatedDeals: [
        {
          logo: './assets/sample-images/deals/Deal-Details-related-1.jpg',
          name: '35% off',
          description: 'Candy buffet!'
        },
        {
          logo: './assets/sample-images/deals/Deal-Details-related-2.jpg',
          name: '15% off',
          description: 'Breakfast'
        },
        {
          logo: './assets/sample-images/deals/Deal-Details-related-3.jpg',
          name: '60% off',
          description: 'Speciality bars'
        }
      ]
    } as DealsDetailsModel;

    return of(dealsDetailsModel);
  }
}
