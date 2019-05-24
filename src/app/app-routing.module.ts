import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/walkthrough', pathMatch: 'full' },
  { path: 'walkthrough', loadChildren: './pages/walkthrough/walkthrough.module#WalkthroughPageModule' },
  { path: 'getting-started', loadChildren: './pages/getting-started/getting-started.module#GettingStartedPageModule' },
  { path: 'auth/login', loadChildren: './pages/user/login/login.module#LoginPageModule' },
  { path: 'auth/signup', loadChildren: './pages/user/signup/signup.module#SignupPageModule' },
  { path: 'invite-signup/:id', loadChildren: './pages/user/invite-signup/invite-signup.module#InviteSignupPageModule' },
  { path: 'auth/forgot-password', loadChildren: './pages/user/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'auth/forgot-email-confirm', loadChildren: './pages/user/forgot-password/forgot-email-confirm/forgot-email-confirm.module#ForgotEmailConfirmPageModule' },
  { path: 'app', loadChildren: './tabs/tabs.module#TabsPageModule' },
  // { path: 'contact-card', loadChildren: './contact-card/contact-card.module#ContactCardPageModule' },
  { path: 'forms-and-validations', loadChildren: './pages/forms/validations/forms-validations.module#FormsValidationsPageModule' },
  { path: 'forms-filters', loadChildren: './pages/forms/filters/forms-filters.module#FormsFiltersPageModule' },
  { path: 'page-not-found', loadChildren: './pages/page-not-found/page-not-found.module#PageNotFoundModule' },
  { path: 'showcase', loadChildren: './pages/showcase/showcase.module#ShowcasePageModule' },
  // { path: '**', redirectTo: 'page-not-found' },
  { path: 'contact', loadChildren: './pages/contact/contact.module#ContactPageModule' },
  { path: 'team/invite-team-mates', loadChildren: './pages/team/invite-team-mates/invite-team-mates.module#InviteTeamMatesPageModule' },
  { path: 'team/manage-team', loadChildren: './pages/team/manage-team/manage-team.module#ManageTeamPageModule' },
  { path: 'team/create-team', loadChildren: './pages/team/create-team/create-team.module#CreateTeamPageModule' },
  { path: 'team/invited-team-list', loadChildren: './pages/team/invited-team-list/invited-team-list.module#InvitedTeamListPageModule' },
  { path: 'team/join-team', loadChildren: './pages/team/join-team/join-team.module#JoinTeamPageModule' },
  { path: 'ideas/chat', loadChildren: './pages/ideas/chat/chat.module#ChatPageModule' },


  // { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' },
  // { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
