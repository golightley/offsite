import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { ModalPage } from '../modal/modal.page';
import { IonicModule } from '@ionic/angular';

import { IdeasPage } from './ideas.page';

const routes: Routes = [
  {
    path: '',
    component: IdeasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IdeasPage,ModalPage],
  entryComponents:[ModalPage],

})
export class IdeasPageModule {}
