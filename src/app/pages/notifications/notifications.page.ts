import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import * as firebase from 'firebase/app';
import {SurveyServiceService} from '../../services/survey-service.service';
import { LoadingService } from '../../services/loading-service';
require('firebase/auth');

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: [
    './styles/notifications.page.scss',
    './styles/notifications.shell.scss'
  ]
})
export class NotificationsPage implements OnInit {

  notifications: any = [];
  unsubscribe: any;
  userId: string;
  navigationSubscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public surveyService: SurveyServiceService,
    public loadingService: LoadingService
    ) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd
          && (this.router.url === '/app/notifications' || this.router.url === '/app/notifications?fromLoginScreen=true')) {
          this.initialiseInvites();
        }
      });
    }

    initialiseInvites() {
      // Set default values and re-fetch any data you need.
      console.log('[Notification] initialiseInvites unsubscrib = ' + this.unsubscribe);
      if (this.unsubscribe !== undefined) {
        console.log('[Notification] call unsubscribe!');
        this.unsubscribe();
      }
      this.notifications = [];
      firebase.auth().onAuthStateChanged(user => {
        this.userId = user.uid;
        this.attachNotificationListener(this.userId);
      });
    }

  ngOnInit() {
    console.log('[Notification] ngOnInit');
  }

  ionViewWillEnter() {
    console.log('[Notification] ionViewWillEnter');
  }

  ionViewWillLeave() {
    // this.unsubscribe();
    console.log('[Notification] Detach listner');
  }
  ionViewDidLeave() {
    if (this.unsubscribe !== undefined) {
      console.log('[Notification] call unsubscribe!');
      this.unsubscribe();
    }
  }

  updateListener(notificationData) {
    this.notifications = [];
    this.notifications = notificationData;
  }

  async attachNotificationListener(userID) {
    const that = this;
    await that.loadingService.doFirebase(async () => {
      const teamId = await that.surveyService.getTeamId(firebase.auth().currentUser.uid);
      console.log('[Notification] team id = ' + teamId.data().teamId);
      if (teamId.data().teamId) {
          const query = firebase.firestore().collection('surveynotifications')
            .where('user', '==', userID)
            .where('teamId', '==', teamId.data().teamId)
            .where('active', '==', true);
          that.unsubscribe = query.onSnapshot((snapshot) => {
          console.log('[Notification] Listener attached notification count = ' + snapshot.size);
          // retrieve anything that has changed
          const changedDocs = snapshot.docChanges();
          changedDocs.forEach((change) => {
            if (change.oldIndex !== -1) {
              that.notifications.splice(change.oldIndex, 1);
            }
            if (change.newIndex !== -1) {
              console.log('[Notification] onSnapshot add >> display name = ' + change.doc.data().displayName);
              that.notifications.splice(change.newIndex, 0, change.doc);
            }
          });
        });
      }
    });
  }

  teamSurvey(notification) {
    console.log('Sending to survey page with survey id: ' + notification);
    if (notification.data().type === 'instructional') {
      this.router.navigateByUrl(notification.data().link);
    } else if (notification.data().type === 'feedback-ask') {
      this.router.navigateByUrl(notification.data().link);
    } else {
      this.surveyService.myParam = notification;
      this.router.navigateByUrl('/forms-filters');
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
    console.log('[Notification] ngOnDestroy unsubscribe = ' + this.unsubscribe);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
