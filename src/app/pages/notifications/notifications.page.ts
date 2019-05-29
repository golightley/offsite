import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import * as firebase from 'firebase/app';
import {SurveyServiceService} from '../../services/survey-service.service';

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
  unsubscribe:any;
  empty = false;
  userId: string;
  navigationSubscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public surveyService: SurveyServiceService,

    )
    {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        //console.log('[Notification] router = ' + this.router.url);
        if (e instanceof NavigationEnd && this.router.url === '/app/notifications') {
          this.initialiseInvites();
        }
      });
    }

    initialiseInvites() {
      // Set default values and re-fetch any data you need.
      console.log("[Notification] initialiseInvites")
      this.notifications =[];
      firebase.auth().onAuthStateChanged(user => {
        this.userId = user.uid;
        this.attachNotificationListener(this.userId);
      });
    }

  ngOnInit() {
    console.log("[Notification] ngOnInit")
  }

  ionViewWillEnter(){
    console.log("[Notification] ionViewWillEnter")
  }

  ionViewWillLeave(){
    // this.unsubscribe();
    console.log("[Notification] Detach listner")
  }
  
  updateListener(notificationData){
    this.notifications =[];
    this.notifications = notificationData;
  }

  attachNotificationListener(userID){
    this.unsubscribe = firebase.firestore().collection("surveynotifications").where("user", "==",userID).where("active", "==", true)
    .onSnapshot((snapshot) => {
      console.log("[Notification] Listener attached notification count = " + snapshot.size);
      // retrieve anything that has changed
      const changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {
        if (change.type === 'added') {
          console.log("Added in listener")
          this.notifications.push(change.doc);
        } else if (change.type === 'modified') {
          console.log("Modified")
          console.log(change)  
          // this.notifications.push(change.doc);
        }
      });

      if(this.notifications.length == 0){this.empty=true;}else{this.empty = false}

    });
  }

  teamSurvey(notification) {

    console.log('Sending to survey page with survey id: '+notification)

    if(notification.data().type=="instructional"){
      this.router.navigateByUrl(notification.data().link);
    }else if(notification.data().type=="feedback-ask"){
      this.router.navigateByUrl(notification.data().link);
    }
    else{
      this.surveyService.myParam = notification;
      this.router.navigateByUrl('/forms-filters');
    }
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

}
