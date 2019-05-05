import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {SurveyServiceService} from '../services/survey-service.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public surveyService: SurveyServiceService,

    ) {}

  ngOnInit() {

    console.log("ngOnInit fired in notifications page ")
    let userId = 'AKfOgVZrSTYsYN01JA0NUTicf703';
    if (firebase.auth().currentUser && firebase.auth().currentUser.uid) {
      userId = firebase.auth().currentUser.uid;
    }

    // this.attachNotificationListener(firebase.auth().currentUser.uid);


    // get notification data from the survey service
    // this.surveyService.getNotifications(userId).then(notificationData => {
    //   this.notifications = notificationData;
    //   console.log(this.notifications);
    // });


    // attach listener 
    // this.attachNotificationListener(userId);


  }

  ionViewWillEnter(){
    console.log("view entered")
    this.notifications =[];
    this.attachNotificationListener(firebase.auth().currentUser.uid);
  }

  ionViewWillLeave(){
    this.unsubscribe();
    console.log("Detach listner")
  }

    

  updateListener(notificationData){
    this.notifications =[];
    this.notifications = notificationData;
  }

  attachNotificationListener(userID){
 
    this.unsubscribe = firebase.firestore().collection("surveynotifications").where("user", "==",userID).where("active", "==", true)
    .onSnapshot((snapshot) => {
      console.log("Listener attached");
      console.log(snapshot);
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
      // this.notifications = notifications;

    });
  }

  teamSurvey(notification) {
    this.surveyService.myParam = notification;
    this.router.navigateByUrl('/forms-filters');
  }
}
