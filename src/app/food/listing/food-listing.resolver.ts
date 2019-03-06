import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FoodService } from '../food.service';

@Injectable()
export class FoodListingResolver implements Resolve<any> {

  constructor(private foodService: FoodService) {}

  resolve() {
    // Get the Shell Provider from the service
    const shellProviderObservable = this.foodService.getListingDataWithShell();

    // Resolve with Shell Provider
    const observablePromise = new Promise((resolve, reject) => {
      resolve(shellProviderObservable);
    });
    return observablePromise;
  }
}
