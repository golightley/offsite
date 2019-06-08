import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Events, MenuController, Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase/app';
import { PopoverController } from '@ionic/angular';
import { SelectTeamComponent } from './pages/team/select-team/select-team.component';
import { LoadingService } from './services/loading-service';
import { UserTeamsModel, UserModel } from './pages/team/select-team/select-team.component.model';
import { FCM } from '@ionic-native/fcm/ngx';
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
  unsubscribe: any;
  activeUnsubscribe: any;
  constructor(
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public popoverController: PopoverController,
    private alertController: AlertController,
    public loadingService: LoadingService,
    private fcm: FCM,
    private router: Router,
  ) {
    this.initializeApp();
  }

  ionViewDidLeave() {
    console.log('[TeamSwitching] ionViewDidLeave unsubscribe = ' + this.unsubscribe);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.activeUnsubscribe) {
      this.activeUnsubscribe();
    }
  }
  async getActiveTeam() {
    const that = this;
    const docRef = await firebase.firestore().collection('users').doc(this.userId);
    that.activeUnsubscribe = docRef.onSnapshot(async (snapshot) => {
      const userData = new UserModel(snapshot.data());
      if (userData.teamId !== undefined) {
        that.activeTeamId = userData.teamId;
        const docTeamRef = await firebase.firestore().collection('teams').doc(that.activeTeamId);
        docTeamRef.get().then(async function (doc) {
        if (doc.exists) {
          const userTeam = new UserTeamsModel(doc.data());
          that.activeTeamName = userTeam.teamName;
          console.log('[TeamSwitching] ~~~ activated team name = ' + that.activeTeamName);
        }
      });
      }
    });
  }
  ionViewWillEnter() {
    console.log('[TeamSwitching] ionViewWillEnter');
  }
  async presentPopover(ev: any) {
    console.log('[TeamSwitching] env =');
    console.log(ev);
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
    const that = this;
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('Received in background');
          // add code when receive push notification  from firebase FCM in background mode.
        } else {
          console.log('Received in foreground');
          // add code when receive push notification  from firebase FCM in foreground mode.
        }
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        // when change token information.
        console.log(token);
      });

      this.fcm.getToken().then(token => {
        console.log(token);
      });
      // this.fcm.subscribeToTopic('ideas');
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user.uid !== null) {
        console.log('[TeamSwitching] initializeApp >> user Id = ' + user.uid);
        that.userId = user.uid;
        that.getUserTeams();
      }
    });
  }

  async getUserTeams() {
    const that = this;
    that.userTeams = [];
    console.log('[TeamSwitching] getUserTeams unsubscrib = ' + this.unsubscribe);
    if (this.unsubscribe !== undefined) {
      console.log('[TeamSwitching] call unsubscribe!');
      this.unsubscribe();
    }
    if (this.activeUnsubscribe) {
      console.log('[TeamSwitching] call activeUnsubscribe!');
      this.activeUnsubscribe();
    }
    await this.getActiveTeam();
    const query = await firebase.firestore().collection('teams')
      .where('members', 'array-contains', { uid: this.userId });
    this.unsubscribe = query.onSnapshot((snapshot) => {
      console.log('[TeamSwitching] Listener attached >> team count = ' + snapshot.size);
      // retrieve anything that has changed
      const changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {
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
    });
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
