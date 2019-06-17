import { Component, NgZone } from '@angular/core';
import {SurveyServiceService} from '../services/survey-service.service';
import { MenuController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { IdeaModel } from '../pages/ideas/ideas.model';
import { internals } from 'rx';
// import { ChatModel } from '../pages/ideas/chat/chat.model';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
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
  navigationSubscription;
  userId: string;
  constructor(
    public menu: MenuController,
    public surveyService: SurveyServiceService,
    private zone: NgZone,
    private router: Router,
  ) {
    const that = this;
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        console.log('[Tabs] Got user!!!!!!!!!! >> user ID = ' + user.email);
        that.userId = user.uid;
        if (that.router.url === '/app/notifications' || that.router.url === '/app/notifications?fromLoginScreen=true') {
          console.log('[Tabs] router >> call app/notifications');
          that.notiBadgeCnt = 0;
          await that.readNotifications();
          that.loadIdeas();
        } else if (that.router.url === '/app/ideas') {
          console.log('[Tabs] router >> call app/ideas');
          that.ideaBadgeCnt = 0;
          that.readIdeas();
          that.attachNotificationListener(this.userId);
        } else {
          console.log('[Tabs] router >> call other url = ' + that.router.url);
          that.attachNotificationListener(this.userId);
          that.loadIdeas();
        }
      }
    });
  }
  async readNotifications() {
    this.notiBadgeCnt = 0;
    const teamData = await this.surveyService.getTeamId(this.userId);
    const teamId = teamData.data().teamId;
    if (teamId && teamId !== '') {
      console.log('[Tabs] !!!!! teamID = ' + teamId);
      const query = await firebase.firestore().collection('surveynotifications')
        .where('user', '==', this.userId)
        .where('teamId', '==', teamId)
        .where('readFlag', '==', 'unchecked')
        .where('active', '==', true);
      query.get().then((notifications) => {
        notifications.forEach((notification) => {
          notification.ref.update({
            readFlag: 'checked',
          });
        });
      });
    }
  }
  async readIdeas() {
    firebase.firestore().collection('users').doc(this.userId).update({
      'readIdeaTime': firebase.firestore.FieldValue.serverTimestamp(),
    }).then(async () => {
      console.log('[Tabs] reset readIdeaTime = ' + firebase.firestore.FieldValue.serverTimestamp());
    }).catch((error) => {
      console.log('[Tabs] reset reset readIdeaTime error = ' + error);
    });
  }

  async ionViewWillEnter() {
    console.log('[Tabs] ionViewWillEnter');
    this.menu.enable(true);
  }

  async attachNotificationListener(userID) {
    const that = this;
    that.notifications = [];
    that.notiBadgeCnt = 0;
    const teamId = await that.surveyService.getTeamId(firebase.auth().currentUser.uid);
    console.log('[Tabs] called attachNotificationListener >> team id = ' + teamId.data().teamId);
    if (teamId.data().teamId && teamId.data().teamId !== '') {
      if (this.unsubFeedback !== undefined) {
        console.log('[Tabs] Stop Feedback Listener');
        this.unsubFeedback();
      }
      // create snapshot for feedback and instructional
      const queryFeedback = await firebase.firestore().collection('surveynotifications')
        .where('user', '==', userID)
        .where('teamId', '==', teamId.data().teamId)
        .where('type', '==', 'feedback')
        .where('active', '==', true)
        .where('readFlag', '==', 'unchecked');
      that.unsubFeedback = queryFeedback.onSnapshot((snapshot) => {
        console.log('[Tabs] Listener attached Feed back notification count = ' + snapshot.size);
        // retrieve anything that has changed
        const changedDocsFeedback = snapshot.docChanges();
        changedDocsFeedback.forEach((change) => {
          console.log('@feedback onsnapshot');
          if (change.oldIndex !== -1) {
            // UI Refresh
          }
          if (change.newIndex !== -1) {
              that.notiBadgeCnt++;
              console.log('[Tabs] Received feedback >> so add.. count = ' + that.notiBadgeCnt);
          }
          this.zone.run(() => {});
        });
      });
    } else if (teamId.data().teamId === '') {
    } else {
    }
  }

  async loadIdeas() {
    const that = this;
    that.ideas = [];
    if (typeof firebase.auth === 'function') {
      const teamId = await that.surveyService.getTeamId(firebase.auth().currentUser.uid);
      console.log('[Tabs] team id = ' + teamId.data().teamId);
      if (teamId.data().teamId && teamId.data().teamId !== '') {
          // first fetch the team ID
        console.log('[Tabs] Selected Team ID:', teamId.data().teamId);
        that.teamId = teamId.data().teamId;
        if (that.teamId === undefined) {
          console.log('[Tabs] No selected team! returned');
          return;
        }
        if (that.unsubIdea !== undefined) {
          console.log('[Tabs] Stop Idea Listener');
          that.unsubIdea();
        }
        // now get the ideas based on that team
        firebase.firestore().collection('users').doc(that.userId).get().then(async docUser => {
          console.log('[Tabs] readIdeaTime = ' + docUser.data().readIdeaTime);
          const readIdeaTime = docUser.data().readIdeaTime;
          if (readIdeaTime === undefined) {
            firebase.firestore().collection('users').doc(this.userId).update({
              'readIdeaTime': new Date(new Date(2000, 1, 1, 0, 0, 0)),
            }).then(async () => {
              console.log('[Tabs] reset readIdeaTime = ' + firebase.firestore.FieldValue.serverTimestamp());
              const query = await firebase.firestore().collection('ideas')
              .where('team', '==', that.teamId)
              .where('timestamp', '>', readIdeaTime)
              .where('reported', '==', false);
              this.unsubIdea = query.onSnapshot((snapshot) => {
              console.log('[Tabs] Listener attached >> idea count = ' + snapshot.size);
              const changedDocs = snapshot.docChanges();
              changedDocs.forEach((change) => {
                if (change.oldIndex !== -1) {
                  // that.ideas.splice(change.oldIndex, 1);
                }
                if (change.newIndex !== -1) {
                  if (that.router.url === '/app/ideas') {
                    this.ideaBadgeCnt = 0;
                    this.readIdeas();
                  } else {
                    console.log('[Tabs] ideas onSnapshot >> add...');
                    that.ideaBadgeCnt++;
                  }
                  this.zone.run(() => {});
                }
                // UI Refresh
                });
              });
            }).catch((error) => {
              console.log('[Tabs] !!!!! reset readIdeaTime error = ' + error);
            });
          } else {
              const query = await firebase.firestore().collection('ideas')
                .where('team', '==', that.teamId)
                .where('timestamp', '>', readIdeaTime)
                // .where('timestamp', '>', new Date((new Date()).setDate((new Date).getDate() + 1)))
                .where('reported', '==', false);
              this.unsubIdea = query.onSnapshot((snapshot) => {
              console.log('[Tabs] !!!!! Listener attached >> idea count = ' + snapshot.size + ' url = ' + this.router.url);
              const changedDocs = snapshot.docChanges();
              changedDocs.forEach((change) => {
                if (change.oldIndex !== -1) {
                  // that.ideas.splice(change.oldIndex, 1);
                }
                if (change.newIndex !== -1) {
                  if (that.router.url === '/app/ideas') {
                    this.ideaBadgeCnt = 0;
                    this.readIdeas();
                  } else {
                    console.log('[Tabs] ideas onSnapshot >> add...');
                    that.ideaBadgeCnt++;
                  }
                  this.zone.run(() => {});
                }
                // UI Refresh
                });
              });
            }
        });
      } else if (teamId.data().teamId === '') {
      } else {
        // doc.data() will be undefined in this case
        console.log('[Tabs] No such document!');
      }
    }
  }
  async onNotiClick() {
    console.log('[Tabs] onNotiClick');
    this.notiBadgeCnt = 0;
    await this.readNotifications();
    await this.loadIdeas();
  }

  async onCateClick() {
    console.log('[Tabs] onCateClick');
    await this.attachNotificationListener(this.userId);
    await this.loadIdeas();
  }

  async onIdeasClick() {
    console.log('[Tabs] onIdeasClick');
    this.ideaBadgeCnt = 0;
    this.readIdeas();
    this.attachNotificationListener(this.userId);
  }

  async onFeedbackClick() {
    console.log('[Tabs] onFeedbackClick');
    this.attachNotificationListener(this.userId);
    this.loadIdeas();
  }

  ngOnDestroy() {
    console.log('[Tabs] ngOnDestroy');
    if (this.unsubFeedback !== undefined) {
      this.unsubFeedback();
      this.unsubSurvey();
      this.unsubIdea();
    }
  }
}
