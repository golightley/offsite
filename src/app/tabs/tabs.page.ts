import { Component } from '@angular/core';
import {SurveyServiceService} from '../services/survey-service.service';
import { MenuController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { IdeaModel } from '../pages/ideas/ideas.model';
import { internals } from 'rx';
require('firebase/auth');
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: [
    './styles/tabs.page.scss'
  ]
})
export class TabsPage  {
  unsubSurvey: any;
  unsubFeedback: any;
  unsubIdea: any;
  notifications: any = [];
  ideas: IdeaModel[] = [];
  teamId: string;
  ideaBadgeCnt: number = 0;
  notiBadgeCnt: number = 0;
  constructor(
    public menu: MenuController,
    public surveyService: SurveyServiceService,
  ) {

  }

  async ionViewWillEnter() {
    console.log('[Tabs] ionViewWillEnter');
    this.menu.enable(true);
    const that = this;
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        console.log('[Tabs] !!!!!!!!!!!! Got user >> user ID = ' + user.email);
        that.loadIdeas();
        that.attachNotificationListener(user.uid);
      }
    });
  }

  async attachNotificationListener(userID) {
    const that = this;
    that.notifications = [];
    
    const teamId = await that.surveyService.getTeamId(firebase.auth().currentUser.uid);
    console.log('[Notification] team id = ' + teamId.data().teamId);
    if (teamId.data().teamId && teamId.data().teamId !== '') {
      // create snapshot for pulse check
      const querySurvey = await firebase.firestore().collection('surveynotifications')
        .where('user', '==', userID)
        .where('teamId', '==', teamId.data().teamId)
        .where('type', '==', 'pulse')
        .where('timestamp', '<', new Date((new Date()).setDate((new Date).getDate() + 1)));
      that.unsubSurvey = querySurvey.onSnapshot((snapshot1) => {
        console.log('[Notification] Listener attached Survey notification count = ' + snapshot1.size);
        // retrieve anything that has changed
        const changedDocsSurvey = snapshot1.docChanges();
        changedDocsSurvey.forEach((change) => {
          console.log('@pulse survey onsnapshot');
          if (change.oldIndex !== -1) {
            // UI Refresh
              that.notifications.splice(change.oldIndex, 1);
          }
          if (change.newIndex !== -1) {
            console.log('[Notification] onSnapshot add >> display name = ' + change.doc.data().displayName);
              that.notifications.splice(change.newIndex, 0, change.doc);
          }
        });
      });
      // create snapshot for feedback and instructional
      const queryFeedback = await firebase.firestore().collection('surveynotifications')
        .where('user', '==', userID)
        .where('teamId', '==', teamId.data().teamId)
        .where('active', '==', true);
      that.unsubFeedback = queryFeedback.onSnapshot((snapshot) => {
        console.log('[Notification] Listener attached Feed back notification count = ' + snapshot.size);
        // retrieve anything that has changed
        const changedDocsFeedback = snapshot.docChanges();
        changedDocsFeedback.forEach((change) => {
          console.log('@feedback onsnapshot');
          if (change.oldIndex !== -1) {
            // UI Refresh
              that.notifications.splice(change.oldIndex, 1);
          }
          if (change.newIndex !== -1) {
              //that.notifications.splice(change.newIndex, 0, change.doc);
              that.ideaBadgeCnt++;
          }
        });
      });
    } else if (teamId.data().teamId === '') {
    } else {
    }
  }

  async loadIdeas() {
    console.log('== load Ideas ==');
    const that = this;
      that.ideas = [];
      if (this.unsubIdea) {
        this.unsubIdea();
      }
      if (typeof firebase.auth === 'function') {
        const teamId = await that.surveyService.getTeamId(firebase.auth().currentUser.uid);
        console.log('[Ideas] team id = ' + teamId.data().teamId);
        if (teamId.data().teamId && teamId.data().teamId !== '') {
            // first fetch the team ID
            console.log('[Ideas] Selected Team ID:', teamId.data().teamId);
            that.teamId = teamId.data().teamId;
            if (that.teamId === undefined) {
              console.log('[Ideas] No selected team! returned');
              return;
            }
            // now get the ideas based on that team
            const query = await firebase.firestore().collection('ideas')
              .where('team', '==', that.teamId)
              .where('reported', '==', false);
            this.unsubIdea = query.onSnapshot((snapshot) => {
              console.log('[Ideas] Listener attached >> idea count = ' + snapshot.size);
              const changedDocs = snapshot.docChanges();
              changedDocs.forEach((change) => {
                if (change.oldIndex !== -1) {
                  that.ideas.splice(change.oldIndex, 1);
                }
                if (change.newIndex !== -1) {
                  console.log('[Ideas] onSnapshot >> add...');
                  const newIdea = new IdeaModel(change.doc.id, change.doc.data());
                  that.ideas.splice(change.newIndex, 0, newIdea);
                }
                // UI Refresh
              });
            });
          } else if (teamId.data().teamId === '') {
          } else {
            // doc.data() will be undefined in this case
            console.log('[Ideas] No such document!');
          }
      }
  }
  async onNotiClick() {
    console.log('[Tabs] !!!!! onNotiClick');
    this.notiBadgeCnt = 0;
  }

  ngOnDestroy() {
    if (this.unsubFeedback !== undefined) {
      this.unsubFeedback();
      this.unsubSurvey();
    }
  }
}
