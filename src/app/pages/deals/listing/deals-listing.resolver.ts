import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DealsService } from '../deals.service';

@Injectable()
export class DealsListingResolver implements Resolve<any> {

  constructor(private dealsService: DealsService) {}

  resolve() {
    // Get the Shell Provider from the service
    const shellProviderObservable = this.dealsService.getListingDataWithShell();

    // Resolve with Shell Provider
    const observablePromise = new Promise((resolve, reject) => {
      resolve(shellProviderObservable);
    });
    return observablePromise;
  }
}
