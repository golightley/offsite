import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { timingSafeEqual } from 'crypto';
import {IdeaModel,CommentActionType} from './ideas.model';
import {SurveyServiceService} from '../services/survey-service.service';
import {HttpClient} from '@angular/common/http';
import { ModalPage } from '../modal/modal.page';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.page.html',
  styleUrls: ['./ideas.page.scss'],
})
export class IdeasPage implements OnInit {

  message = ""
  suggestions= [];
  color = "green";
  ideas: IdeaModel[] = [];
  type = ""


  constructor(
    public surveyService: SurveyServiceService,
    private http: HttpClient,
    public modalController: ModalController,

    ) {this.loadSuggestions("start"), this.loadIdeas("start") }

  ngOnInit() {
    // this.loadIdeas("start");
  }

  loadSuggestions(type){
      this.suggestions = [];
      const query = firebase.firestore().collection('suggestionBank')
        .where('type', '==', type)
        // .where('type', '==', 'comment');
      query.onSnapshot((snapshot) => {
        // console.log(snapshot);
        // retrieve anything that has changed
        const changedDocs = snapshot.docChanges();
        changedDocs.forEach((change) => {
          if (change.type === 'added') {
            this.suggestions.push(change.doc.data());
          } else if (change.type === 'modified') {

          }
        });
      });
  }

  loadIdeas(type){
    this.ideas = [];
    const query = firebase.firestore().collection('ideas')
      .where('team', '==', "E4ZWxJbFoDE29ywISRQY")
      // .where("type", "==", type)
      query.onSnapshot((snapshot) => {
      console.log("ideas...")
      console.log(snapshot);
      // retrieve anything that has changed
      const changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {
        if (change.type === 'added') {
          this.ideas.push(new IdeaModel(change.doc.id, change.doc.data()));
          console.log(this.ideas)
        } else if (change.type === 'modified') {
          let index = 0;
          for (let i = 0; i < this.ideas.length; i++) {
            if (this.ideas[i].uid === change.doc.id) {
              index = i;
              break;
            }
          }
          this.ideas[index] = new IdeaModel(change.doc.id, change.doc.data());
        }
      });
    });
}




  improvementTypeChipSelected(type){
    console.log("stop")
    if(type == "start"){this.color = "green"; this.type = "start"}
    else if(type =="stop"){this.color="red"; this.type = "stop"}
    else{this.color="black"; this.type = "keep"}
    this.loadSuggestions(type);
    // this.loadIdeas(type);

  }
  getCommentActionColor(){
    return this.color; 
  }


  getCardActionColor(action: CommentActionType) {
    // console.log("Get action color"+action)
    switch (action) {
      case CommentActionType.keep:
        return '#ffae66';
      case CommentActionType.start:
        return '#6af951';
      case CommentActionType.stop:
        return '#ff6666';
    }
  }

  makeSuggestion(suggestion){
    console.log("Make suggestion")
    console.log(suggestion)
    this.message = suggestion.text;

  }

  createIdea() {
    // create the comment
    this.surveyService.createIdea("E4ZWxJbFoDE29ywISRQY", this.message, this.type, this.type);
    // reset the message
    this.message = '';
  }


    // this should be moved to the service
    increaseScore(idea: IdeaModel) {
      console.log('Update score function fired...');
      const body  = {
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
      const body  = {
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


  async inputFocus(){
    console.log("Ion focus...")
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'prop1': "test",
        'prop2': "test2"
      }
    });

    await modal.present();
  } 

}



