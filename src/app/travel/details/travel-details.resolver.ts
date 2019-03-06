import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TravelService } from '../travel.service';

@Injectable()
export class TravelDetailsResolver implements Resolve<any> {

  constructor(private travelService: TravelService) {}

  resolve() {
    // Get the Shell Provider from the service
    const shellProviderObservable = this.travelService.getDetailsDataWithShell();

    // Resolve with Shell Provider
    const observablePromise = new Promise((resolve, reject) => {
      resolve(shellProviderObservable);
    });
    return observablePromise;
  }
}
