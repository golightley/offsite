import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ShellProvider } from '../utils/shell-provider';

import { FoodListingModel } from './listing/food-listing.model';
import { FoodDetailsModel } from './details/food-details.model';

@Injectable()
export class FoodService {
  private _listingWithShellCache: ShellProvider<FoodListingModel>;
  private _detailsWithShellCache: ShellProvider<FoodDetailsModel>;

  constructor(private http: HttpClient) { }

  public getListingDataWithShell(): Observable<FoodListingModel> {
    // Use cache if we have it.
    if (!this._listingWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: FoodListingModel = new FoodListingModel(true);
      const dataObservable = this.http.get<FoodListingModel>('./assets/sample-data/food/listing.json');

      this._listingWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._listingWithShellCache.observable;
  }

  public getDetailsDataWithShell(): Observable<FoodDetailsModel> {
    // Use cache if we have it.
    if (!this._detailsWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: FoodDetailsModel = new FoodDetailsModel(true);
      const dataObservable = this.http.get<FoodDetailsModel>('./assets/sample-data/food/details.json');

      this._detailsWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._detailsWithShellCache.observable;
  }
}
