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
            loadChildren: '../categories/categories.module#CategoriesPageModule'
          },
          {
            path: 'fashion',
            loadChildren: '../fashion/listing/fashion-listing.module#FashionListingPageModule'
          },
          {
            path: 'fashion/:productId',
            loadChildren: '../fashion/details/fashion-details.module#FashionDetailsPageModule'
          },
          {
            path: 'food',
            loadChildren: '../food/listing/food-listing.module#FoodListingPageModule'
          },
          {
            path: 'food/:productId',
            loadChildren: '../food/details/food-details.module#FoodDetailsPageModule'
          },
          {
            path: 'travel',
            loadChildren: '../travel/listing/travel-listing.module#TravelListingPageModule'
          },
          {
            path: 'travel/:productId',
            loadChildren: '../travel/details/travel-details.module#TravelDetailsPageModule'
          },
          {
            path: 'deals',
            loadChildren: '../deals/listing/deals-listing.module#DealsListingPageModule'
          },
          {
            path: 'deals/:productId',
            loadChildren: '../deals/details/deals-details.module#DealsDetailsPageModule'
          },
          {
            path: 'real-state',
            loadChildren: '../real-state/listing/real-state-listing.module#RealStateListingPageModule'
          },
          {
            path: 'real-state/:productId',
            loadChildren: '../real-state/details/real-state-details.module#RealStateDetailsPageModule'
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            loadChildren: '../user/profile/user-profile.module#UserProfilePageModule'
          },
          {
            path: 'friends',
            loadChildren: '../user/friends/user-friends.module#UserFriendsPageModule'
          }
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
    redirectTo: 'app/categories',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [ ]
})
export class TabsPageRoutingModule {}
