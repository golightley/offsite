import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ChartsModule} from 'ng2-charts';

import { UserFriendsPage } from './user-friends.page';
import { UserService } from '../user.service';
import { UserFriendsResolver } from './user-friends.resolver';
import { ComponentsModule } from '../../../components/components.module';
// import { ModalPage } from '../../modal/modal.page';

const routes: Routes = [
  {
    path: '',
    component: UserFriendsPage,
    resolve: {
      data: UserFriendsResolver
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    ChartsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [UserFriendsPage,],
  entryComponents:[],
  providers: [
    UserFriendsResolver,
    UserService
  ]
})
export class UserFriendsPageModule {}
