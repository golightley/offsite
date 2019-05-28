import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Events, MenuController, Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase/app';
import { PopoverController } from '@ionic/angular';
import { SelectTeamComponent } from './pages/team/select-team/select-team.component';
import { LoadingService } from './services/loading-service';
import { UserTeamsModel,UserModel } from './pages/team/select-team/select-team.component.model';
require('firebase/auth');

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
      url: '/team/create-team',
      icon: './assets/sample-icons/side-menu/add-circle.svg'
    },
    {
      title: 'Join to a team',
      url: '/team/join-team',
      icon: './assets/sample-icons/side-menu/aperture.svg'
    },
    {
      title: 'Invited team list',
      url: '/team/invited-team-list',
      icon: './assets/sample-icons/side-menu/notifications-1.svg'
    },
    {
      title: 'Invite team members',
      url: '/team/invite-team-mates',
      icon: './assets/sample-icons/side-menu/megaphone.svg'
    },
    {
      title: 'Manage Team',
      url: '/team/manage-team',
      icon: './assets/sample-icons/side-menu/construct.svg'
    },
    {
      title: 'Tutorial',
      url: '/walkthrough',
      icon: './assets/sample-icons/side-menu/tutorial.svg'
    },
  ];

  userTeams: any = [];
  userId: string;
  activeTeamId: string = '';
  activeTeamName: string = '';

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public popoverController: PopoverController,
    private alertController: AlertController,
    public loadingService: LoadingService,
  ) {
    this.initializeApp();
  }

  async getCurTeam()
  {
    const that = this;
    
    //await this.loadingService.doFirebase(async () => {
      const docRef = await firebase.firestore().collection('users').doc(that.userId);
      docRef.onSnapshot(async (snapshot) => {
            // console.log(change.doc.data());
            const userData = new UserModel(snapshot.data());
            that.activeTeamId = userData.teamId;
            const docRef = await firebase.firestore().collection('teams').doc(that.activeTeamId);
             docRef.get().then(async function (doc) {
              if (doc.exists) {
                const userTeam = new UserTeamsModel(doc.data());
                that.activeTeamName = userTeam.teamName;
                console.log('[TeamSwitching] active team name = ' + that.activeTeamName);
              }
            })
      });
    //})
  }

  async presentPopover(ev: any) {
    //this.getCurTeam();
    const popover = await this.popoverController.create({
      component: SelectTeamComponent,
      componentProps: {
        userTeams: this.userTeams,
        activeTeam: this.activeTeamId
      },
      event: ev,
      // translucent: true,
      animated: true,
      showBackdrop: true,
      cssClass: 'offsite-popover'
    });
    return await popover.present();
  }

  setInvitePage() {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.auth().onAuthStateChanged(user => {
      this.userId = user.uid;
      this.getUserTeams();
    })
  }

  async getUserTeams()
  {
    
    const that = this;
    this.getCurTeam();
    //await this.loadingService.doFirebase(async () => {
      
      console.log('[TeamSwitching] userId = ' + this.userId);
      const query = await firebase.firestore().collection('teams')
        .where('members', 'array-contains', { uid: this.userId });
      console.log('[TeamSwitching] query = ' + query);
      query.onSnapshot((snapshot) => {
        console.log('[TeamSwitching] Listener attached');
        // retrieve anything that has changed
          console.log('[TeamSwitching] team count = ', snapshot.size);
          if (snapshot.size > 0) {
            const changedDocs = snapshot.docChanges();
            changedDocs.forEach((change) => {
              // console.log(change.doc.data());
              const userTeam = new UserTeamsModel(change.doc.data());
              userTeam.id = change.doc.id;
              if (change.oldIndex !== -1) {
                that.userTeams.splice(change.oldIndex, 1);
              }
              if (change.newIndex !== -1) {
                console.log('[TeamSwitching] doc id = ', change.doc.id);
                that.userTeams.splice(change.newIndex, 0, userTeam);
              }
            });
          }
      });
    //})
  }

  async logout() {
    const alert = await this.alertController.create({
      message: 'Are you sure you would like to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Log out',
          handler: async () => {
            window.location.href = 'auth/login';
          }
        }
      ]
    });

    await alert.present();
  }

}
