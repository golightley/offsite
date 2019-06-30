import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import { IdeaModel, CommentActionType } from './ideas.model';
import { SurveyServiceService } from '../../services/survey-service.service';
import { HttpClient } from '@angular/common/http';
import { ModalPage } from '../modal/modal.page';
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverReportComponent } from '../../components/popover-report/popover-report.component';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { LoadingService } from '../../services/loading-service';
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
  navigationSubscription;
  messageCount = '';
  unsubscribe: any;
  buttonMessage:string = "Next tip"

  constructor(
    public surveyService: SurveyServiceService,
    private http: HttpClient,
    public modalController: ModalController,
    public popoverController: PopoverController,
    private router: Router,
    public loadingService: LoadingService,
    private zone: NgZone
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd
        && (this.router.url === '/app/ideas')) {
        this.initialiseInvites();
      }
    });
  }

  async initialiseInvites() {
    // Set default values and re-fetch any data you need.
    console.log('[Ideas] initialiseInvites unsubscrib = ' + this.unsubscribe);
    console.log('[Ideas] ionViewDidEnter teamId = ' + this.teamId);
    if (this.unsubscribe !== undefined) {
      console.log('[Ideas] call unsubscribe!');
      this.unsubscribe();
    }
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        console.log('[Ideas] Got user!');
        await this.loadIdeas();
      }
    });
  }

  ngOnInit() {
    console.log('[Ideas] ngOnInit');
  }

  ionViewWillEnter() {
    console.log('[Ideas] ionViewWillEnter teamId = ' + this.teamId);
  }

  async ionViewDidEnter() {
    console.log('[Ideas] end ionViewDidEnter!');
  }

  ionViewWillLeave() {
  }

  ionViewDidLeave() {
    console.log('[Ideas] ionViewDidLeave teamId = ' + this.teamId);
    console.log('[Ideas] ionViewDidLeave unsubscribe = ' + this.unsubscribe);
    console.log(this.unsubscribe);
    if (this.unsubscribe && this.teamId) {
      this.unsubscribe();
    }
  }

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

  enterChatRoom(idea) {
    console.log('enter chat_room');
    const navigationExtras: NavigationExtras = {
      replaceUrl: true,
      queryParams: {
        ideaId: idea.uid,
        ideaText: idea.text,
        teamId: this.teamId
      }
    };

    this.router.navigate(['/ideas/chat'], navigationExtras);
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  async getMessageCount(ideaId) {
    const that = this;
      const query = firebase.firestore().collection('chats')
        .where('ideaId', '==', ideaId);
      query.onSnapshot((snapshot) => {
        const ideaMessageCount = snapshot.size.toString();
        const idea_index = that.ideas.findIndex(idea => idea.uid === ideaId);
        console.log('[Ideas] message count = ' + ideaMessageCount);
        that.ideas[idea_index].messageCount = ideaMessageCount;
      });
  }


  async loadIdeas() {
    console.log('== load Ideas ==');
    const that = this;
    await this.loadingService.doFirebase(async () => {
      that.ideas = [];
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
              .where('reported', '==', false)
              .orderBy('score', 'desc')
              .orderBy('timestamp', 'asc');
            this.unsubscribe = query.onSnapshot((snapshot) => {
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
                  that.getMessageCount(change.doc.id);
                }
                // UI Refresh
                this.zone.run(() => {});
                
              });
            });
          } else if (teamId.data().teamId === '') {
            that.surveyService.showToastMsg('you have already been deleted from this team by team creator!');
          } else {
            // doc.data() will be undefined in this case
            console.log('[Ideas] No such document!');
          }
      }
    });
  }

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

  onClickBtnNext(){
    this.router.navigate(['/app/feedback']);

  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    console.log('[Ideas] ngOnDestroy');
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
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

