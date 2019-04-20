import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { timingSafeEqual } from 'crypto';
import {IdeaModel} from './ideas.model';
import {SurveyServiceService} from '../services/survey-service.service';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.page.html',
  styleUrls: ['./ideas.page.scss'],
})
export class IdeasPage implements OnInit {

  message = ""
  suggestions= [];
  color = "success";
  ideas: IdeaModel[] = [];
  type = ""


  constructor(public surveyService: SurveyServiceService,) {this.loadSuggestions("start"), this.loadIdeas("start") }

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
      .where("type", "==", type)
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
    this.loadIdeas(type);

  }
  getCommentActionColor(){
    return this.color; 
  }

  createIdea() {
    // create the comment
    this.surveyService.createIdea("E4ZWxJbFoDE29ywISRQY", this.message, this.type, this.type);
    // reset the message
    this.message = '';
  }

}



