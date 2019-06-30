import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from '../../components/components.module';
import { ModalPage } from '../modal/modal.page';
import { IonicModule } from '@ionic/angular';
import { IdeasPage } from './ideas.page';
import { PopoverReportComponent } from '../../components/popover-report/popover-report.component';
import { ModalPageModule } from '../../pages/modal/modal.module';  // <-- don't forget to import the AddEventModule class


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
    RouterModule.forChild(routes),
    // ModalPageModule
  ],
  // declarations: [IdeasPage, ModalPage],
  declarations: [IdeasPage, ModalPage],
  // entryComponents: [ModalPage, PopoverReportComponent],

  entryComponents: [ PopoverReportComponent, ModalPage],

})
export class IdeasPageModule {}
