import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InvitedTeamListPage } from './invited-team-list.page';

const routes: Routes = [
  {
    path: '',
    component: InvitedTeamListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InvitedTeamListPage]
})
export class InvitedTeamListPageModule {}
