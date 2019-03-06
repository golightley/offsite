import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ShellProvider } from '../utils/shell-provider';

import { RealStateListingModel } from './listing/real-state-listing.model';
import { RealStateDetailsModel } from './details/real-state-details.model';

@Injectable()
export class RealStateService {
  private _listingWithShellCache: ShellProvider<RealStateListingModel>;
  private _detailsWithShellCache: ShellProvider<RealStateDetailsModel>;

  constructor(private http: HttpClient) { }

  public getListingDataWithShell(): Observable<RealStateListingModel> {
    // Use cache if we have it.
    if (!this._listingWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: RealStateListingModel = new RealStateListingModel(true);
      const dataObservable = this.http.get<RealStateListingModel>('./assets/sample-data/real-state/listing.json');

      this._listingWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._listingWithShellCache.observable;
  }

  public getDetailsDataWithShell(): Observable<RealStateDetailsModel> {
    // Use cache if we have it.
    if (!this._detailsWithShellCache) {
      // Initialize the model specifying that it is a shell model
      const shellModel: RealStateDetailsModel = new RealStateDetailsModel(true);
      const dataObservable = this.http.get<RealStateDetailsModel>('./assets/sample-data/real-state/details.json');

      this._detailsWithShellCache = new ShellProvider(
        shellModel,
        dataObservable
      );
    }
    return this._detailsWithShellCache.observable;
  }
}
