import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ShellProvider } from '../utils/shell-provider';

import { TravelListingModel } from './listing/travel-listing.model';
import { TravelDetailsModel } from './details/travel-details.model';

@Injectable()
export class TravelService {
  private _listingWithShellCache: ShellProvider<TravelListingModel>;
  private _detailsWithShellCache: ShellProvider<TravelDetailsModel>;

  constructor(private http: HttpClient) { }

  public getListingDataWithShell(): Observable<TravelListingModel> {
    // Use cache if we have it.
    if (!this._listingWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: TravelListingModel = new TravelListingModel(true);
      const dataObservable = this.http.get<TravelListingModel>('./assets/sample-data/travel/listing.json');

      this._listingWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._listingWithShellCache.observable;
  }

  public getDetailsDataWithShell(): Observable<TravelDetailsModel> {
    // Use cache if we have it.
    if (!this._detailsWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: TravelDetailsModel = new TravelDetailsModel(true);
      const dataObservable = this.http.get<TravelDetailsModel>('./assets/sample-data/travel/details.json');

      this._detailsWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._detailsWithShellCache.observable;
  }

}
