import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FeedbackRequestSubmittedPage } from './feedback-request-submitted.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackRequestSubmittedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedbackRequestSubmittedPage]
})
export class FeedbackRequestSubmittedPageModule {}
