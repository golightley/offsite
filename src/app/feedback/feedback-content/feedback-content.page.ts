import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SurveyServiceService} from '../../services/survey-service.service';
import {FeedbackCategoryModel, TeammatesModel} from './feedback-content.model';
import * as firebase from 'firebase/app';

require('firebase/auth');

@Component({
  selector: 'app-feedback-content',
  templateUrl: './feedback-content.page.html',
  styleUrls: ['./feedback-content.page.scss'],
})
export class FeedbackContentPage {
  page = 'what';
  categories: FeedbackCategoryModel[] = [];
  teammates: TeammatesModel[] = [];

  constructor(private surveyService: SurveyServiceService,
              private router: Router) {
    this.getFeedbackQuestions();
    this.getTeamMembers();
  }

  private getFeedbackQuestions() {
    // get notification data from the survey service
    this.surveyService.getFeedbackCategories()
      .then(docs => {
        docs.forEach(doc => {
          if (doc.data().hasOwnProperty('name')) {
            this.categories.push(new FeedbackCategoryModel(doc.data()['name']));
          }
        });
        console.log(this.categories);
    });
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

  checkSubmitStatus() {
    return 0 === this.categories.filter(category => {
             return category.checked;
           }).length
           || 0 === this.teammates.filter(teammate => {
             return teammate.checked;
           }).length;
  }

  submitFeedback() {
    this.surveyService.createFeedbackNotifications(this.teammates);
    this.router.navigateByUrl('app/feedback/feedback-request');
  }
}
