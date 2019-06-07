import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ComponentsModule} from './components/components.module';
import { HttpClientModule } from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import {ChartsModule} from 'ng2-charts';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { SelectTeamComponent } from './pages/team/select-team/select-team.component';
//import { FCM } from '@ionic-native/fcm/ngx';

const config = {
  apiKey: 'AIzaSyD7_p-5IpsI1LY76bz8zvteCi00KvoMP18',
  authDomain: 'offsite-9f67c.firebaseapp.com',
  databaseURL: 'https://offsite-9f67c.firebaseio.com',
  projectId: 'offsite-9f67c',
  storageBucket: 'offsite-9f67c.appspot.com',
  messagingSenderId: '143692410973'
};

firebase.initializeApp(config);

@NgModule({
  declarations: [AppComponent, SelectTeamComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    ChartsModule,
    //FCM,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [SelectTeamComponent],
  providers: [
    StatusBar,
    Firebase,
    SplashScreen,
    Keyboard,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
