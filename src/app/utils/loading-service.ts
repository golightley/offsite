import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public ldc: LoadingController;
  private loading: any;

  constructor(
    loadingController: LoadingController
  ) {
    this.ldc = loadingController;
  }

  public async presentLoading(message) {
    this.loading = await this.ldc.create({
      message: message,
      mode: 'ios',
      // spinner: 'dots',
      // cssClass: 'loading-css'
    });
    return await this.loading.present();
  }

  public async doFirebase(fn) {
    await this.presentLoading('Please waiting...');
    try {
      return await fn();
    } catch (error) {
      return this.handleError(error);
    } finally {
      await this.loading.dismiss();
    }
  }

  public async doFirebaseWithoutLoading(fn) {
    try {
      return await fn();
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error) {
    console.log(error);
  }
}
