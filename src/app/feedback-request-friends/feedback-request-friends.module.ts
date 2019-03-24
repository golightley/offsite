import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FeedbackRequestFriendsPage } from './feedback-request-friends.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackRequestFriendsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedbackRequestFriendsPage]
})
export class FeedbackRequestFriendsPageModule {}
