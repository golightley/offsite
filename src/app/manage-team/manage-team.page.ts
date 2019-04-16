import { Component, OnInit } from '@angular/core';
import {SurveyServiceService} from '../services/survey-service.service';
import {FeedbackCategoryModel, TeammatesModel} from '../feedback/feedback-content/feedback-content.model';
import * as firebase from 'firebase/app';
require('firebase/auth');

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.page.html',
  styleUrls: ['./manage-team.page.scss'],
})
export class ManageTeamPage implements OnInit {
  teammates: TeammatesModel[] = [];


  constructor(private surveyService: SurveyServiceService) { }

  ngOnInit() {
    this.getTeamMembers();

  }


  private getTeamMembers() {
    let userId = 'rFeEWfEvUOQMvrp7LADUEPKt3U23';
    if (firebase.auth().currentUser && firebase.auth().currentUser.uid) {
      userId = firebase.auth().currentUser.uid;
    }

    this.surveyService.getTeamMembers(userId)
      .then(docs => {
        this.teammates = docs;
        console.log(this.teammates);
    });
  }

}
