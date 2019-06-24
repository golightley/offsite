import {Component, ViewChild, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SurveyServiceService} from '../../../services/survey-service.service';
import {FeedbackCategoryModel, TeammatesModel} from './feedback-content.model';
import * as firebase from 'firebase/app';
import { MessageChannel } from 'worker_threads';
import { LoadingService } from '../../../services/loading-service';
import { InviteTeamMatesModel } from '../../team/invite-team-mates/invite-team-mates.model';

require('firebase/auth');

@Component({
  selector: 'app-feedback-content',
  templateUrl: './feedback-content.page.html',
  styleUrls: ['./feedback-content.page.scss'],
})
export class FeedbackContentPage implements OnInit {
  aryMembers: InviteTeamMatesModel[];
  page = 'what';
  categories: FeedbackCategoryModel[] = [];
  teammates: TeammatesModel[] = [];
  message = '';
  userId:string = "";
  teamId:string;
  toggle: string;
  teamName:string;
  startSuggestions = [
    {text: 'How did the presentation go?'},
    {text: 'How did I lead that meeting?'},
  ];

  @ViewChild('inputToFocus') inputToFocus;

  constructor(private surveyService: SurveyServiceService,
              private router: Router,
              public loadingService: LoadingService
  ) {
    this.getFeedbackQuestions();
  }

  ngOnInit() {
    // console.log('[feedback-content] NgInit - feedback content loaded - ');
  }

  ionViewWillEnter() {
    console.log('[feedback-content] ViewWillEnter - feedback content loaded - ');
    this.page = 'what';
    this.getTeamMembers();
    const that = this;
    this.aryMembers = [
      new InviteTeamMatesModel()
    ];

  }

  async loadTeam() {
    this.teamId = await this.surveyService.getTeamId(firebase.auth().currentUser.uid);
    this.teamName = await this.surveyService.getTeamName(this.teamId);
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

  
  
  onClickBtnAddMember() {
    this.aryMembers.push(new InviteTeamMatesModel());
  }

  onClickBtnRemoveMember(index) {
    this.aryMembers.splice(index, 1);
  }

  

  async onClickBtnInvite() {
    console.log('[InviteTeam] count = ' + this.aryMembers.length);
    await this.surveyService.inviteTeamMembers(this.aryMembers, this.teamId, this.teamName);
    console.log(' **** Sent all invite email **** ');
    this.router.navigateByUrl('app/feedback/feedback-request');

    // this.router.navigateByUrl('app/notifications');
  }

  async getTeamMembers() {
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const userId = firebase.auth().currentUser.uid;
        this.surveyService.getTeamMembers(userId)
          .then(docs => {
            this.teammates = docs;
            console.log('[feedback-content] - finished get team members - ');
        });
      }
    });
  }

  // checkSubmitStatus() {
  //   return 0 === this.categories.filter(category => {
  //            return category.checked;
  //          }).length
  //          || 0 === this.teammates.filter(teammate => {
  //            return teammate.checked;
  //          }).length;
  // }

  checkSubmitStatus() {
    return 0 === this.teammates.filter(teammate => {
             return teammate.checked;
           }).length;
  }

  submitFeedback() {
     console.log('Submitted...');
     this.surveyService.createSurvey(this.teammates, this.categories, this.message, this.toggle);
     this.router.navigateByUrl('app/feedback/feedback-request');
  }

  makeSuggestion(suggestion) {
    console.log('Make suggestion');
    console.log(suggestion);
    this.message = suggestion.text;
    this.inputToFocus.setFocus();
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    this.toggle = ev.detail.value;
    console.log('Value is ' + this.toggle);
  }

  goToWho() {
    this.page = 'who';
  }

  getCommentActionColor() {
    return 'grey';
  }

}
