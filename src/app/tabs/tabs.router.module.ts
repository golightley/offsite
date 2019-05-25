import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
      path: 'categories',
        children: [
          {
            path: '',
            loadChildren: '../pages/deals/listing/deals-listing.module#DealsListingPageModule'
          },
          {
            path: 'friends',
            loadChildren: '../pages/user/friends/user-friends.module#UserFriendsPageModule'
          },
          { 
            path: 'modal',
            loadChildren: '../pages/modal/modal.module#ModalPageModule' 
          }

        ]
      },
      {
        path: 'feedback',
        children: [
          {
            path: '',
            loadChildren: '../pages/feedback/feedback-logo/feedback-logo.module#FeedbackLogoPageModule'
          },
          {
            path: 'feedback-content',
            loadChildren: '../pages/feedback/feedback-content/feedback-content.module#FeedbackContentPageModule'
          },
          {
            path: 'feedback-request',
            loadChildren: '../pages/feedback/feedback-request/feedback-request.module#FeedbackRequestPageModule'
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: '../pages/notifications/notifications.module#NotificationsPageModule'
          }
        ]
      },
      {
        path: 'ideas',
        children: [
          {
            path: '',
            loadChildren: '../pages/ideas/ideas.module#IdeasPageModule'
          }
        ]
      },
    ]
  },
  // /app/ redirect
  {
    path: '',
    redirectTo: 'app/categories/deals',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [ ]
})
export class TabsPageRoutingModule {}
