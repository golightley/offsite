import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as firebase from 'firebase/app';
import {SurveyServiceService} from '../services/survey-service.service';
import { timer } from 'rxjs/observable/timer';

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
  step = 1;
  type = "start";
  prompt = "Great. What would you like your team to start doing?";


  @ViewChild('inputToFocus') inputToFocus;
  @ViewChild('chatScroll') chatScroll;

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

categoryselected(type){
  timer(500).subscribe(() => this.step = 5) // <-- hide animation after 3s
  timer(1500).subscribe(() => this.step = 6) // <-- hide animation after 3s
  this.chatScroll.scrollToBottom();
  this.type = type;

  if(type == "stop"){
    this.prompt = "Great. What would you like your team to stop doing?";
  }
  if(type == "keep"){
    this.prompt = "Great. What would you like your team to keep doing?";
  }
  // this.contentAreaReference.scrollToBottom();

}


createIdea() {
  // create the comment
  this.surveyService.createIdea("E4ZWxJbFoDE29ywISRQY", this.message,this.type,this.type);
  // reset the message
  this.message = '';
  this.dismiss();

}
  
  inputFocus(){

  }

  ngOnInit() {

    timer(1500).subscribe(() => this.step = 2) // <-- hide animation after 3s
    timer(2000).subscribe(() => this.step = 3) // <-- hide animation after 3s
    timer(3000).subscribe(() => this.step = 4) // <-- hide animation after 3s

  }

  dismiss(){
    this.modalController.dismiss();

  }

}
