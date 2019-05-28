import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public surveyService: SurveyServiceService,

    ) {}

  ngOnInit() {

    console.log("ngOnInit fired in notifications page ")
  }

  ionViewWillEnter(){
    console.log("view entered")
    this.notifications =[];
    firebase.auth().onAuthStateChanged(user => {
      this.userId = user.uid;
      this.attachNotificationListener(this.userId);
    });
  }

  ionViewWillLeave(){
    // this.unsubscribe();
    console.log("Detach listner")
  }

  updateListener(notificationData){
    this.notifications =[];
    this.notifications = notificationData;
  }

  attachNotificationListener(userID){
    console.log('userID ' + userID);
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
}
