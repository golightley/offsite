import { Component, OnInit } from '@angular/core';
import { AlertController, NavController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { SurveyServiceService } from '../services/survey-service.service';
require('firebase/auth')
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  
  categories: any = [];

  constructor(
    private navCtrl: NavController,
    public surveyService: SurveyServiceService,
    private router: Router,


    ) { }

  ngOnInit() {

          //get user ID 
      // let userId: any = firebase.auth().currentUser.uid;
      let userId: any = "AKfOgVZrSTYsYN01JA0NUTicf703";

      console.log("NG ONINIT fired in feedback module");

      // get notification data from the survey service 
      this.surveyService.getFeedbackCategories(userId).then((notificationData)=>{
        this.categories = notificationData;
        console.log("Printing feedback categories...");
        console.log(this.categories);
      })
  
  }

  nextFeedback(){
    this.router.navigateByUrl('/app/user/feedback-request-friends');

  }

}
