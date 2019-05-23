import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/walkthrough', pathMatch: 'full' },
  { path: 'walkthrough', loadChildren: './walkthrough/walkthrough.module#WalkthroughPageModule' },
  { path: 'getting-started', loadChildren: './getting-started/getting-started.module#GettingStartedPageModule' },
  { path: 'auth/login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'auth/signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'auth/forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'auth/forgot-email-confirm', loadChildren: './forgot-password/forgot-email-confirm/forgot-email-confirm.module#ForgotEmailConfirmPageModule' },
  { path: 'app', loadChildren: './tabs/tabs.module#TabsPageModule' },
  // { path: 'contact-card', loadChildren: './contact-card/contact-card.module#ContactCardPageModule' },
  { path: 'forms-and-validations', loadChildren: './forms/validations/forms-validations.module#FormsValidationsPageModule' },
  { path: 'forms-filters', loadChildren: './forms/filters/forms-filters.module#FormsFiltersPageModule' },
  { path: 'page-not-found', loadChildren: './page-not-found/page-not-found.module#PageNotFoundModule' },
  { path: 'showcase', loadChildren: './showcase/showcase.module#ShowcasePageModule' },
  // { path: '**', redirectTo: 'page-not-found' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'invite-team-mates', loadChildren: './invite-team-mates/invite-team-mates.module#InviteTeamMatesPageModule' },
  { path: 'test', loadChildren: './pages/test/test.module#TestPageModule' },
  { path: 'invite-signup/:id', loadChildren: './invite-signup/invite-signup.module#InviteSignupPageModule' },
  { path: 'manage-team', loadChildren: './manage-team/manage-team.module#ManageTeamPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  

  // { path: 'ideas', loadChildren: './ideas/ideas.module#IdeasPageModule' },
  // { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' },
  // { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
