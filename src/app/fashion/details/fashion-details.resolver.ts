import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FashionService } from '../fashion.service';

@Injectable()
export class FashionDetailsResolver implements Resolve<any> {

  constructor(private fashionService: FashionService) {}

  resolve() {
    // Get the Shell Provider from the service
    const shellProviderObservable = this.fashionService.getDetailsDataWithShell();

    // Resolve with Shell Provider
    const observablePromise = new Promise((resolve, reject) => {
      resolve(shellProviderObservable);
    });
    return observablePromise;
  }
}
