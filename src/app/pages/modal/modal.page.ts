import { Component, OnInit, ViewChild, ElementRef, ViewChildren, ContentChildren, Input } from '@angular/core';
// import { ModalController, NavParams, IonContent } from '@ionic/angular';
import { ModalController, IonContent } from '@ionic/angular';

import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AlertController } from '@ionic/angular';

import * as firebase from 'firebase/app';
import { SurveyServiceService } from '../../services/survey-service.service';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  private mutationObserver: MutationObserver;
  // team: any;
  @Input() team: any;

  // team;
  suggestions = [];
  startSuggestions = [];
  stopSuggestions = [];
  color = 'grey';
  array = [];
  step = 1;
  type = 'start';
  prompt = 'Great. What would you like your team to start doing?';


  @ViewChild('inputToFocus') inputToFocus;
  // @ViewChild(IonContent) contentArea: IonContent;
  @ViewChild('chatList', { read: ElementRef }) chatList: ElementRef;
  // @ViewChildren('myContent') contentArea: IonContent;
  @ViewChild('content') private content: any;


  message = '';
  constructor(
    public modalController: ModalController,
    // public navParams: NavParams,
    public surveyService: SurveyServiceService,
    private keyboard: Keyboard,
    public alertController: AlertController
  ) {
    // team
    console.log("[Ideas.Modal] Team Name=" + this.team);


    // this.team = navParams.get('team');
    this.loadSuggestions('start');
    this.loadSuggestions('stop');

    window.addEventListener('keyboardWillShow', (event) => {
      console.log('Keyboard showing');
      this.content.scrollToBottom(300);
    });

    window.addEventListener('keyboardDidShow', (event) => {
      console.log('Keyboard showing');
      this.content.scrollToBottom(300);
      // Describe your logic which will be run each time when keyboard is about to be shown.
    });

  }
  async presentAlert() {
    const alert = await this.alertController.create({
      // header: 'Info',
      subHeader: 'What activities do you want your team to start, stop, or keep doing? Structuring feedback makes it actionable.',
      // message: 'Structuring feedback helps make it actionable.',
      buttons: ['OK']
    });

    await alert.present();
  }

  ionViewDidLoad() {

    this.keyBoardShow();

    this.mutationObserver = new MutationObserver((mutations) => {
      console.log('mutation');
      // this.contentArea.scrollToBottom();
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
    });
  }

  keyBoardShow() {

  }

  getCommentActionColor() {
    return this.color;
  }

  loadSuggestions(type) {

    // clear both arrays 
    this.startSuggestions = [];
    this.stopSuggestions = [];

    const query = firebase.firestore().collection('suggestionBank')
      .where('type', '==', type);
    // .where('type', '==', 'comment');
    query.onSnapshot((snapshot) => {
      // console.log(snapshot);
      console.log('loaded suggestion bank')
      console.log(snapshot);
      // retrieve anything that has changed
      const changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {
        if (change.type === 'added') {

          // determine which array to add suggesitons to
          if (type == 'start') { this.startSuggestions.push(change.doc.data()); }
          else { this.stopSuggestions.push(change.doc.data()) }

        } else if (change.type === 'modified') {

        }
      });
    });
  }

  // ngAfterViewChecked() {
  //   this.inputToFocus.setFocus()
  // }

  makeSuggestion(suggestion) {
    console.log('Make suggestion')
    console.log(suggestion)
    this.message = suggestion.text;
    this.inputToFocus.setFocus();
  }

  categoryselected(type) {
    timer(500).subscribe(() => this.step = 5); // <-- hide animation after 3s
    timer(1500).subscribe(() => this.step = 6); // <-- hide animation after 3s
    this.type = type;

    if (type === 'stop') {
      this.prompt = 'Great. What would you like your team to stop doing?';
      // this.contentArea.scrollToBottom();
      window.scrollTo(0, document.body.scrollHeight);

    }
    if (type === 'keep') {
      this.prompt = 'Great. What would you like your team to keep doing?';
      // this.contentArea.scrollToBottom();
      window.scrollTo(0, document.body.scrollHeight);

    }
    // this.contentAreaReference.scrollToBottom();

  }


  createIdea() {
    console.log('Creater idea...');
    // create the comment
    this.surveyService.createIdea(this.team, this.message, this.type, this.type);
    // reset the message
    this.message = '';
    this.dismiss();
  }

  cancel() {
    this.dismiss();
  }

  inputFocus() {
    // this.contentArea.scrollToBottom();
    console.log('Ion-Focus');

    // window.scrollTo(0,document.body.scrollHeight);
    // this.contentArea.el.scrollToBottom();
    // this.contentArea.ionScrollEnd();
    this.content.scrollToBottom(300);

  }

  ngOnInit() {
    console.log('[Ideas.Modal] Team Name=');
    console.log(`${this.team}`);

    timer(1500).subscribe(() => this.step = 2); // <-- hide animation after 3s
    timer(2000).subscribe(() => this.step = 3); // <-- hide animation after 3s
    timer(3000).subscribe(() => this.step = 4); // <-- hide animation after 3s
    // this.contentArea.scrollToBottom();
  }

  dismiss() {
    this.modalController.dismiss();

  }

}
