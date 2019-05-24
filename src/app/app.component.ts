import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Events, MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { PopoverController } from '@ionic/angular';
import { SelectTeamComponent } from './pages/team/select-team/select-team.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    './side-menu/styles/side-menu.scss',
    './side-menu/styles/side-menu.shell.scss',
    './side-menu/styles/side-menu.responsive.scss'
  ]
})
export class AppComponent {
  accountPages = [
    
    {
      title: 'Create a new team',
      url: '/create-team',
      icon: './assets/sample-icons/side-menu/add-circle.svg'
    },
    {
      title: 'Join to a team',
      url: '/join-team',
      icon: './assets/sample-icons/side-menu/aperture.svg'
    },
    {
      title: 'Invited team list',
      url: '/invited-team-list',
      icon: './assets/sample-icons/side-menu/notifications-1.svg'
    },
    {
      title: 'Invite team members',
      url: '/invite-team-mates',
      icon: './assets/sample-icons/side-menu/megaphone.svg'
    },
    {
      title: 'Manage Team',
      url: '/manage-team',
      icon: './assets/sample-icons/side-menu/construct.svg'
    },
    {
      title: 'Log out',
      url: '/auth/login',
      icon: './assets/sample-icons/side-menu/login.svg'
    },
    {
      title: 'Tutorial',
      url: '/walkthrough',
      icon: './assets/sample-icons/side-menu/tutorial.svg'
    },
  ];

  constructor(
    private events: Events,
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public popoverController: PopoverController
  ) {
    this.initializeApp();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SelectTeamComponent,
      event: ev,
      // translucent: true,
      animated: true,
      showBackdrop: true,
      cssClass: 'offsite-popover'
    });
    return await popover.present();
  }

  setInvitePage(){
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
