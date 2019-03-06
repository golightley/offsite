import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RealStateService } from '../real-state.service';

@Injectable()
export class RealStateDetailsResolver implements Resolve<any> {

  constructor(private realStateService: RealStateService) {}

  resolve() {
    // Get the Shell Provider from the service
    const shellProviderObservable = this.realStateService.getDetailsDataWithShell();

    // Resolve with Shell Provider
    const observablePromise = new Promise((resolve, reject) => {
      resolve(shellProviderObservable);
    });
    return observablePromise;
  }
}
