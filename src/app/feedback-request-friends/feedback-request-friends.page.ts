import { Component, OnInit } from '@angular/core';
import { AlertController, NavController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { SurveyServiceService } from '../services/survey-service.service';
require('firebase/auth')
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-feedback-request-friends',
  templateUrl: './feedback-request-friends.page.html',
  styleUrls: ['./feedback-request-friends.page.scss'],
})
export class FeedbackRequestFriendsPage implements OnInit {
  
  members: any   = [];
  category: any  = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    public surveyService: SurveyServiceService,
    private http:HttpClient,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
      let userId: any = firebase.auth().currentUser.uid;
      // let userId: any = "AKfOgVZrSTYsYN01JA0NUTicf703";

      // get the categories from the previous page
      this.category = this.route.snapshot.paramMap.get('categories');
      console.log("Printing categories array -->");
      this.category = this.surveyService.categories;
      console.log(this.category);

      // get notification data from the survey service 
      this.surveyService.getTeamMembers(userId).then((notificationData)=>{
        this.members = notificationData[0];
        console.log("Printing team members...");
        console.log(this.members);
      })
  }

  // this should be moved to the service 
  createFeedbackRequest(result){
    this.category.forEach(category => {
      console.log("Iterating through each category");
      console.log(category);
      console.log(category.data().name);

        if (category.checked == true){
          console.log("Like function fired...");
          let body  = {
            team: this.members,
            userId: firebase.auth().currentUser.uid,
            category: category.data().name,
            displayName:firebase.auth().currentUser.displayName
          }
          this.http.post("https://us-central1-offsite-9f67c.cloudfunctions.net/createFeedbackRequest", JSON.stringify(body),{
            responseType:"text"
          }).subscribe((data) => {
            console.log(data);

          }, (error) => {
            console.log(error)
          })
          this.router.navigateByUrl('/app/user/feedback-request-submitted');

        }

    });


  }

}

