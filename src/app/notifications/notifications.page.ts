import { Component, OnInit } from '@angular/core';
import { AlertController, NavController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { NotificationsService } from './notifications.service';
import { SurveyServiceService } from '../services/survey-service.service';
require('firebase/auth')

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

  constructor(
    private route: ActivatedRoute,
    public NotificationsService: NotificationsService,
    private navCtrl: NavController,
    public surveyService: SurveyServiceService,

    ) { }

  ngOnInit(): void {

    //get user ID 
    let userId: any = firebase.auth().currentUser.uid;
    console.log("UID"+userId);

    // get notification data from the survey service 
    this.surveyService.getNotifications(userId).then((notificationData)=>{
      this.notifications = notificationData;
      console.log("Printing notificaitons...");
      console.log(this.notifications);
    })

    //test returning survey questions
 

  }
    teamSurvey(notification){
      this.NotificationsService.myParam = notification;
      this.surveyService.getQuestions(notification).then((questiondata)=>{
        console.log("Question data...");
        console.log(questiondata);
      })
      this.navCtrl.navigateForward('/forms-filters');
    }
  
}
