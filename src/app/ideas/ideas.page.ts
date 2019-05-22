import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { IdeaModel, CommentActionType } from './ideas.model';
import { SurveyServiceService } from '../services/survey-service.service';
import { HttpClient } from '@angular/common/http';
import { ModalPage } from '../modal/modal.page';
import { ModalController } from '@ionic/angular';

import { PopoverController } from '@ionic/angular';
import { PopoverReportComponent } from '../components/popover-report/popover-report.component';

import { LoadingService } from '../services/loading-service';
require('firebase/auth');
@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.page.html',
  styleUrls: ['./ideas.page.scss'],
})
export class IdeasPage implements OnInit {

  message = '';
  startSuggestions = [];
  stopSuggestions = [];
  currentIdea;
  color = 'green';
  ideas: IdeaModel[] = [];
  type = '';
  teamId = '';

  constructor(
    public surveyService: SurveyServiceService,
    private http: HttpClient,
    public modalController: ModalController,
    public popoverController: PopoverController,
    public loadingService: LoadingService

  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.loadIdeas();
      }
    });
  }

  ngOnInit() { }

  ionViewWillEnter() { }

  async setPopover(ev: Event, idea) {
    this.currentIdea = idea;
    console.log('show Report Idea Popover');
    // console.log(idea);

    const popover = await this.popoverController.create({
      component: PopoverReportComponent,
      event: ev,
      componentProps: {
        idea: idea.uid
      },
      animated: true,
      showBackdrop: true
    });
    popover.present();
  }

  async loadIdeas() {

    console.log('== load Ideas ==');
    await this.loadingService.doFirebase(async () => {

      const that = this;
      that.ideas = [];
      if (typeof firebase.auth === 'function') {
        const teamData = await this.surveyService.getTeamByUserId(firebase.auth().currentUser.uid);
        if (teamData.exists) {
            // first fetch the team ID
            console.log('Selected Team Name:', teamData.data().teamName);
            that.teamId = teamData.id;
            if (that.teamId === undefined) {
              console.log('No selected team! returned');
              return;
            }
            // now get the ideas based on that team
            const query = await firebase.firestore().collection('ideas')
              // .where('team', '==', 'E4ZWxJbFoDE29ywISRQY')
              .where('team', '==', that.teamId)
              .where('reported', '==', false)
              .orderBy('score', 'desc')
              .orderBy('timestamp', 'asc');
            query.onSnapshot((snapshot) => {
              // console.log(snapshot);
              // retrieve anything that has changed
              console.log('-- Changed ideas count: ' + that.ideas.length);
              const changedDocs = snapshot.docChanges();
              changedDocs.forEach((change) => {
                // console.log('-- Ideas onSnapshot -- ' + change.type);
                if (change.oldIndex !== -1) {
                  that.ideas.splice(change.oldIndex, 1);
                }
                if (change.newIndex !== -1) {
                  that.ideas.splice(change.newIndex, 0, new IdeaModel(change.doc.id, change.doc.data()));
                }
              });
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
      }
    });

  }

  /*improvementTypeChipSelected(type) {
    console.log('stop');
    if (type === 'start') {
      this.color = 'green';
      this.type = 'start';
    } else if ( type === 'stop') {
       this.color = 'red';
       this.type = 'stop';
    } else {
       this.color = 'black';
       this.type = 'keep';
    }
    this.loadSuggestions(type);
    // this.loadIdeas(type);
  }*/

  getCommentActionColor() {
    return this.color;
  }


  getCardActionColor(action: CommentActionType) {
    // console.log('Get action color'+action)
    switch (action) {
      case CommentActionType.keep:
        return '#ffae66';
      case CommentActionType.start:
        return '#6af951';
      case CommentActionType.stop:
        return '#ff6666';
    }
  }

  makeSuggestion(suggestion) {
    console.log('Make suggestion');
    console.log(suggestion);
    this.message = suggestion.text;

  }

  // this should be moved to the service
  async increaseScore(idea: IdeaModel) {
    console.log('Update score function fired...');
    const body = {
      team: idea.uid,
      userId: firebase.auth().currentUser.uid,
      action: 'upvote'
    };
    const result = await this.loadingService.doFirebase(async () => {
      const resp = await this.http.post('https://us-central1-offsite-9f67c.cloudfunctions.net/updateIdeaScore', JSON.stringify(body), {
        responseType: 'text'
      }).toPromise();
      return resp;
    });
    if (!result || !result.status) {
      console.log(result.error);
      if (result.errorMessage) {
        console.log(result.errorMessage);
      }
    }
  }

  // this should be moved to the service
  async decreaseScore(idea: IdeaModel) {
    console.log('Update score function fired...');
    const body = {
      team: idea.uid,
      userId: firebase.auth().currentUser.uid,
      action: 'downvote'
    };
    const result = await this.loadingService.doFirebase(async () => {
      const resp = await this.http.post('https://us-central1-offsite-9f67c.cloudfunctions.net/updateIdeaScore', JSON.stringify(body), {
        responseType: 'text'
      }).toPromise();
      return resp;
    });
    if (!result || !result.status) {
      console.log(result.error);
      if (result.errorMessage) {
        console.log(result.errorMessage);
      }
    }
  }


  async inputFocus() {
    console.log('Ion focus...');
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'team': this.teamId,
        'prop2': 'test2'
      }
    });
    await modal.present();
  }
}



