import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ForgotEmailConfirmPage } from './forgot-email-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotEmailConfirmPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ForgotEmailConfirmPage]
})
export class ForgotEmailConfirmPageModule {}
