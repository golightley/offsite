import { Component, OnInit, ViewChild } from '@angular/core';
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
  startSuggestions = [];
  stopSuggestions  = [];
  color = "grey";
  array = [];
  @ViewChild('inputToFocus') inputToFocus;

  message = "";
  constructor(
    public modalController: ModalController, 
    public navParams:NavParams,
    public surveyService: SurveyServiceService,
    ) { 
    this.val = navParams.get('prop1');
    this.loadSuggestions("start");
    this.loadSuggestions("stop");

  }

  getCommentActionColor(){
    return this.color; 
  }

  loadSuggestions(type){

    // clear both arrays 
    this.startSuggestions = [];
    this.stopSuggestions  = [];

    const query = firebase.firestore().collection('suggestionBank')
      .where('type', '==', type)
      // .where('type', '==', 'comment');
    query.onSnapshot((snapshot) => {
      // console.log(snapshot);
      console.log("loaded suggestion bank")
      console.log(snapshot);
      // retrieve anything that has changed
      const changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {
        if (change.type === 'added') {

          // determine which array to add suggesitons to
          if(type == "start"){this.startSuggestions.push(change.doc.data());}
          else{this.stopSuggestions.push(change.doc.data())}

        } else if (change.type === 'modified') {

        }
      });
    });
}

// ngAfterViewChecked() {
//   this.inputToFocus.setFocus()
// }

makeSuggestion(suggestion){
  console.log("Make suggestion")
  console.log(suggestion)
  this.message = suggestion.text;
  this.inputToFocus.setFocus();



}

createIdea(type) {
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
