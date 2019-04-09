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
            loadChildren: '../deals/listing/deals-listing.module#DealsListingPageModule'
          },
          {
            path: 'friends',
            loadChildren: '../user/friends/user-friends.module#UserFriendsPageModule'
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            loadChildren: '../feedback/feedback.module#FeedbackPageModule'
          },
          {
            path: 'feedback-request-friends',
            loadChildren: '../feedback-request-friends/feedback-request-friends.module#FeedbackRequestFriendsPageModule'
          },
          {
            path: 'feedback-request-submitted',
            loadChildren: '../feedback-request-submitted/feedback-request-submitted.module#FeedbackRequestSubmittedPageModule'
          },
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: '../notifications/notifications.module#NotificationsPageModule'
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
