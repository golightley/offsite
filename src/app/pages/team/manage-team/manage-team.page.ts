import { Component, OnInit } from '@angular/core';
import {SurveyServiceService} from '../../../services/survey-service.service';
import {FeedbackCategoryModel, TeammatesModel} from '../../feedback/feedback-content/feedback-content.model';
import * as firebase from 'firebase/app';
require('firebase/auth');

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.page.html',
  styleUrls: ['./manage-team.page.scss'],
})
export class ManageTeamPage implements OnInit {
  teammates: TeammatesModel[] = [];
  userId: string;
  bCreator: string;
  constructor(
    private surveyService: SurveyServiceService,
    ) {
    }

  async ngOnInit() {
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        console.log('[ManageTeam] Got user >> user ID = ' + user.uid);
        this.userId = user.uid;
        this.isCreator();
        this.getTeamMembers();
      }
    });

  }
  async isCreator() {
    this.bCreator = '';
    const data = await this.surveyService.isCreator(this.userId);
    console.log('[ManageTeam] !!!!!!!!!!!!!!!!!!! isCreator = ' + data);
    if (data !== null && data !== undefined && data === 'creator' && data !== 'not found team') {
      this.bCreator = 'true';
    } else if (data !== null && data !== undefined && data === 'member' && data !== 'not found team') {
      this.bCreator = 'false';
    } else {
      this.bCreator = '';
    }
  }
  async onRemove() {
    console.log('[ManageTeam] called onRemove');
  }

  private getTeamMembers() {
    this.surveyService.getTeamMembers(this.userId)
      .then(docs => {
        this.teammates = docs;
        console.log(this.teammates);
    });
  }

}
