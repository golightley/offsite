import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ShellProvider } from '../utils/shell-provider';

import { FashionListingModel } from './listing/fashion-listing.model';
import { FashionDetailsModel } from './details/fashion-details.model';

@Injectable()
export class FashionService {
  private _listingWithShellCache: ShellProvider<FashionListingModel>;
  private _detailsWithShellCache: ShellProvider<FashionDetailsModel>;

  constructor(private http: HttpClient) { }

  public getListingDataWithShell(): Observable<FashionListingModel> {
    // Use cache if we have it.
    if (!this._listingWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: FashionListingModel = new FashionListingModel(true);
      const dataObservable = this.http.get<FashionListingModel>('./assets/sample-data/fashion/listing.json');

      this._listingWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._listingWithShellCache.observable;
  }

  public getDetailsDataWithShell(): Observable<FashionDetailsModel> {
    // Use cache if we have it.
    if (!this._detailsWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: FashionDetailsModel = new FashionDetailsModel(true);
      const dataObservable = this.http.get<FashionDetailsModel>('./assets/sample-data/fashion/details.json');

      this._detailsWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._detailsWithShellCache.observable;
  }

}
