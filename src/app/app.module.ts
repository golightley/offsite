import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ComponentsModule } from './components/components.module';

import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

var config = {
  apiKey: "AIzaSyD7_p-5IpsI1LY76bz8zvteCi00KvoMP18",
  authDomain: "offsite-9f67c.firebaseapp.com",
  databaseURL: "https://offsite-9f67c.firebaseio.com",
  projectId: "offsite-9f67c",
  storageBucket: "offsite-9f67c.appspot.com",
  messagingSenderId: "143692410973"
};

firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots:true
})

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
