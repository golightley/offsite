import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {SurveyServiceService} from '../services/survey-service.service';

require('firebase/auth');

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

      
      let userId: any = firebase.auth().currentUser.uid;
      // let userId: any = "AKfOgVZrSTYsYN01JA0NUTicf703";

      console.log("NG ONINIT fired in feedback module");

      // get notification data from the survey service 
      this.surveyService.getFeedbackCategories(userId).then((notificationData)=>{
        this.categories = notificationData;
        console.log("Printing feedback categories...");
        console.log(this.categories);
      })
  
  }

  nextFeedback(){
    console.log(this.categories);
    this.surveyService.categories = this.categories;
    this.router.navigate(['/app/user/feedback-request-friends', { categories:"test" }]);
    // this.router.navigate(['/detail', { id: itemId }]);
  }

}
