import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {FeedbackRequestPage} from './feedback-request.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackRequestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedbackRequestPage]
})
export class FeedbackRequestPageModule {
}
