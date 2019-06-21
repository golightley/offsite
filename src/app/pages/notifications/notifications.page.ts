import {Component, OnInit, NgZone} from '@angular/core';
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
  unsubFeedback: any;
  unsubSurvey: any;
  userId: string;
  titleName:string = "Welcome!";
  tipCount:any = 0;
  showNotifications:any = false;
  navigationSubscription;
  imageName:any = "assets/images/chat.svg";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public surveyService: SurveyServiceService,
    public loadingService: LoadingService,
    private zone: NgZone
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
      console.log('[Notification] initialiseInvites unsubscrib');
      /*if (this.unsubFeedback !== undefined) {
        console.log('[Notification] call unsubscribe!');
        this.unsubFeedback();
        this.unsubSurvey();
      }*/
      this.notifications = [];
      firebase.auth().onAuthStateChanged(user => {
        this.userId = user.uid;
        this.attachNotificationListener(this.userId);
      });
    }
  
  onClickBtnNext(){
     
    switch(this.tipCount) { 
      case 0: { 
         //statements; 
         this.imageName = "assets/images/notifications.svg";
         this.titleName = "Tabs"

         break; 
      } 
      case 1: { 
        this.imageName = "assets/images/posts.svg";
        this.titleName = "Next tip"        
        break; 
      } 
      case 2: { 
        //statements; 
        break; 
     } 
      default: { 
         //statements; 
         break; 
      } 
   } 
   this.tipCount++;

  }

  ngOnInit() {
    // console.log('[Notification] ngOnInit');
  }

  ionViewWillEnter() {
    // console.log('[Notification] ionViewWillEnter');
  }

  ionViewWillLeave() {
    // this.unsubscribe();
    // console.log('[Notification] Detach listner');
  }
  ionViewDidLeave() {
    if (this.unsubFeedback !== undefined) {
      console.log('[Notification] call unsubscribe!');
      this.unsubSurvey();
      this.unsubFeedback();
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
      if (teamId.data().teamId && teamId.data().teamId !== '') {
            // create snapshot for pulse check
            const querySurvey = await firebase.firestore().collection('surveynotifications')
            .where('user', '==', userID)
            .where('teamId', '==', teamId.data().teamId)
            .where('type', '==', 'pulse')
            .where('timestamp', '<', new Date((new Date()).setDate((new Date).getDate() + 1)));
          that.unsubSurvey = querySurvey.onSnapshot((snapshot1) => {
            console.log('[Notification] Listener attached Survey notification count = ' + snapshot1.size);
            // retrieve anything that has changed
            const changedDocsSurvey = snapshot1.docChanges();
            changedDocsSurvey.forEach((change) => {
              console.log('@pulse survey onsnapshot');
              if (change.oldIndex !== -1) {
                // UI Refresh
                this.zone.run(() => {
                  that.notifications.splice(change.oldIndex, 1);
                });
              }
              if (change.newIndex !== -1) {
                console.log('[Notification] onSnapshot add >> display name = ' + change.doc.data().displayName);
                this.zone.run(() => {
                  that.notifications.splice(change.newIndex, 0, change.doc);
                });
              }
            });
          });
          // create snapshot for feedback and instructional
          const queryFeedback = await firebase.firestore().collection('surveynotifications')
            .where('user', '==', userID)
            .where('teamId', '==', teamId.data().teamId)
            .where('active', '==', true);
          that.unsubFeedback = queryFeedback.onSnapshot((snapshot) => {
            console.log('[Notification] Listener attached Feed back notification count = ' + snapshot.size);
            // retrieve anything that has changed
            const changedDocsFeedback = snapshot.docChanges();
            changedDocsFeedback.forEach((change) => {
              console.log('@feedback onsnapshot');
              if (change.oldIndex !== -1) {
                // UI Refresh
                this.zone.run(() => {
                  that.notifications.splice(change.oldIndex, 1);
                });
              }
              if (change.newIndex !== -1) {
                this.zone.run(() => {
                  that.notifications.splice(change.newIndex, 0, change.doc);
                });
              }
            });
          });
      } else if (teamId.data().teamId === '') {
        that.surveyService.showToastMsg('you have already been deleted from this team by team creator!');
      } else {
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
    console.log('[Notification] ngOnDestroy unsubscribe');
    if (this.unsubFeedback) {
      this.unsubFeedback();
      this.unsubSurvey();
    }
  }
}
