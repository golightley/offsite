import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { LoadingService } from '../../../services/loading-service';
import { InvitedTeamModel } from './invited-team-list.model';
import { SurveyServiceService } from '../../../services/survey-service.service';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

require('firebase/auth');
@Component({
  selector: 'app-invited-team-list',
  templateUrl: './invited-team-list.page.html',
  styleUrls: ['./invited-team-list.page.scss'],
})
export class InvitedTeamListPage implements OnInit {
  inviteEmails: any = [];
  userId: string = '';
  userEmail: string = '';
  unsubscribe: any;
  constructor(
    public loadingService: LoadingService,
    public surveyService: SurveyServiceService,
    private toastController: ToastController,
    private router: Router,
  ) {

  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.userId = user.uid;
      this.userEmail = user.email;
      this.getInvitedTeams(this.userEmail);
    });
  }

  ionViewWillEnter() {
    console.log('[InvitedList] ionViewWillEnter');
  }
  ionViewDidLeave() {
    if (this.unsubscribe !== undefined) {
      console.log('[InvitedList] call unsubscribe!');
      this.unsubscribe();
    }
  }

  async showToastMsg(message) {
    const toast = await this.toastController.create({
      message: message,
      closeButtonText: 'close',
      showCloseButton: true,
      duration: 2000
    });
    toast.present();
  }

  async getInvitedTeams(userEmail) {
    const that = this;
    if (that.unsubscribe !== undefined) {
      console.log('[InvitedList] call unsubscribe!');
      this.unsubscribe();
    }
    await this.loadingService.doFirebase(async () => {
      console.log('[InvitedList] userEmai = ' + userEmail);
      const query = await firebase.firestore().collection('emailInvites')
      .where('email', '==', userEmail)
      .where('active', '==', true)
      .orderBy('timestamp', 'asc');

      this.unsubscribe = query.onSnapshot((snapshot) => {
        console.log('Invites Listener attached');
        // retrieve anything that has changed
          console.log('[InvitedList] invited email count = ', snapshot.size);
          const changedDocs = snapshot.docChanges();
          changedDocs.forEach((change) => {
            // console.log(change.doc.data());
            const inviteEmail = new InvitedTeamModel(change.doc.data());
            inviteEmail.id = change.doc.id;
            if (change.oldIndex !== -1) {
              that.inviteEmails.splice(change.oldIndex, 1);
            }
            if (change.newIndex !== -1) {
              console.log('[InvitedList] doc id = ', change.doc.id);
              that.inviteEmails.splice(change.newIndex, 0, inviteEmail);
            }

          });

      });
    });
  }
  async onAcceptInvite(inviteId: string, teamName: string) {
    console.log('[acceptInvite] team name = ' + teamName);
    console.log('[acceptInvite] doc id = ' + inviteId);
    const that = this;
      const data = await that.surveyService.joinTeamWithName(that.userId, teamName);
      if ( data && data.error === undefined && data.error !== 'Not found') {
        const ref = await firebase.firestore().collection('emailInvites').doc(inviteId);
        return ref.update({
          'active': false
        })
        .then(function (docRef) {
          console.log('EmailInvites Document successfully updated!');
          const navigationExtras: NavigationExtras = {
            replaceUrl: true,
            queryParams: {
              fromLoginScreen: 'true'
            }
          };
          that.router.navigate(['/app/notifications'], navigationExtras);
          that.surveyService.showToastMsg('You have joined the team successfully');
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          that.surveyService.showToastMsg('accept error');
        });

      } else {
        that.surveyService.showToastMsg('This user has already registered for the team');
      }
  }
  async onDeclineInvite(inviteId: string) {
    console.log(inviteId);
    const ref = await firebase.firestore().collection('emailInvites').doc(inviteId);
    const navigationExtras: NavigationExtras = {
      replaceUrl: true,
      queryParams: {
        fromLoginScreen: 'true'
      }
    };
    this.router.navigate(['/app/notifications'], navigationExtras);
    return ref.update({
          'active': false
    });
  }
}
