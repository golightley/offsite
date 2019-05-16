import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { IdeaModel, CommentActionType } from './ideas.model';
import { SurveyServiceService } from '../services/survey-service.service';
import { HttpClient } from '@angular/common/http';
import { ModalPage } from '../modal/modal.page';
import { ModalController } from '@ionic/angular';
import { PopoverComponentComponent } from '../popover-component/popover-component.component';
import { PopoverController } from '@ionic/angular';


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

  ) { /*this.loadSuggestions('start');*/ }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadIdeas();
  }

  async setPopover(ev: Event, idea) {
    this.currentIdea = idea;
    console.log('Idea...');
    console.log(idea);

    const popover = await this.popoverController.create({
      component: PopoverComponentComponent,
      event: ev,
      componentProps: {
        idea: idea.uid
      },
      animated: true,
      showBackdrop: true
    });
    popover.present();

  }

  /*
   loadSuggestions(type) {
     this.startSuggestions = [];
     const query = firebase.firestore().collection('suggestionBank')
       .where('type', '==', type);
     // .where('type', '==', 'comment');
     query.onSnapshot((snapshot) => {
       console.log('loaded suggestion bank')
       console.log(snapshot);
       // retrieve anything that has changed
       const changedDocs = snapshot.docChanges();
       changedDocs.forEach((change) => {
         if (change.type === 'added') {
           this.startSuggestions.push(change.doc.data());
         } else if (change.type === 'modified') {
         }
       });
     });
   }*/

  loadIdeas() {
    console.log('load ideas');
    let team = '';
    const that = this;
    that.ideas = [];
    if (typeof firebase.auth === 'function') {
      const docRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
      docRef.get().then(function (doc) {
        if (doc.exists) {
          // first fetch the team ID
          console.log('Team data:', doc.data().team);
          console.log('Team data:', doc.data());

          team = doc.data().teamId;
          that.teamId = team;
          // now get the ideas based on that team
          const query = firebase.firestore().collection('ideas')
            // .where('team', '==', 'E4ZWxJbFoDE29ywISRQY')
            .where('team', '==', team)
            .where('reported', '==', false)
            .orderBy('score', 'desc');
          query.onSnapshot((snapshot) => {
            console.log('ideas...');
            // console.log(snapshot);
            // retrieve anything that has changed
            const changedDocs = snapshot.docChanges();
            changedDocs.forEach((change) => {
              console.log('--load ideas--' + change.type);
              if (change.type === 'added') { // Occurs when get Ideas list.
                that.ideas.push(new IdeaModel(change.doc.id, change.doc.data()));
              } else if (change.type === 'modified') {  // Occurs when increasing/decreasing of score.
                const changed_idea_index = that.ideas.findIndex(idea => idea.uid === change.doc.id);
                that.ideas[changed_idea_index] = new IdeaModel(change.doc.id, change.doc.data());
              }
            });
          });
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      }).catch(function (error) {
        console.log('Error getting document:', error);
      });
    }
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
    console.log('Make suggestion')
    console.log(suggestion)
    this.message = suggestion.text;

  }

  // createIdea() {
  //   // create the comment
  //   this.surveyService.createIdea(this.teamId, this.message, this.type, this.type);
  //   // reset the message
  //   this.message = '';
  // }


  // this should be moved to the service
  increaseScore(idea: IdeaModel) {
    console.log('Update score function fired...');
    const body = {
      team: idea.uid,
      userId: firebase.auth().currentUser.uid,
      action: 'upvote'
    };
    this.http.post('https://us-central1-offsite-9f67c.cloudfunctions.net/updateIdeaScore', JSON.stringify(body), {
      responseType: 'text'
    }).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  // this should be moved to the service
  decreaseScore(idea: IdeaModel) {
    console.log('Update score function fired...');
    const body = {
      team: idea.uid,
      userId: firebase.auth().currentUser.uid,
      action: 'downvote'
    };
    this.http.post('https://us-central1-offsite-9f67c.cloudfunctions.net/updateIdeaScore', JSON.stringify(body), {
      responseType: 'text'
    }).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }


  async inputFocus() {
    console.log('Ion focus...')
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



