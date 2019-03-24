import { Component, OnInit } from '@angular/core';
import { AlertController, NavController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { SurveyServiceService } from '../services/survey-service.service';
require('firebase/auth')

@Component({
  selector: 'app-feedback-request-friends',
  templateUrl: './feedback-request-friends.page.html',
  styleUrls: ['./feedback-request-friends.page.scss'],
})
export class FeedbackRequestFriendsPage implements OnInit {
  
  members: any = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    public surveyService: SurveyServiceService,
  ) { }

  ngOnInit() {
      // let userId: any = firebase.auth().currentUser.uid;
      let userId: any = "AKfOgVZrSTYsYN01JA0NUTicf703";

      // get notification data from the survey service 
      this.surveyService.getTeamMembers(userId).then((notificationData)=>{
        this.members = notificationData[0];
        console.log("Printing team members...");
        console.log(this.members);
      })
  }



}
