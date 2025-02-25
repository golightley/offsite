import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {FeedbackLogoPage} from './feedback-logo.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackLogoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedbackLogoPage]
})
export class FeedbackLogoPageModule {
}
