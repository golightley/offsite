import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as firebase from 'firebase/app';
import {SurveyServiceService} from '../services/survey-service.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  val;
  suggestions= [];

  message = "";
  constructor(
    public modalController: ModalController, 
    public navParams:NavParams,
    public surveyService: SurveyServiceService,
    ) { 
    this.val = navParams.get('prop1');
    this.loadSuggestions("start");
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

makeSuggestion(type) {
  // create the comment
  this.surveyService.createIdea("E4ZWxJbFoDE29ywISRQY", this.message,type,type);
  // reset the message
  this.message = '';

}
  
  inputFocus(){

  }

  ngOnInit() {
  }

  dismiss(){
    this.modalController.dismiss();

  }

}
