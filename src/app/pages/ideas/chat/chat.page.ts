import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { IdeaModel } from '../ideas.model';
import { SurveyServiceService } from '../../../services/survey-service.service';
import { ChatServiceService } from '../../../services/chat-service.service';
require('firebase/auth');
import { ChatModel } from './chat.model';
import { IonContent } from '@ionic/angular';
import { LoadingService } from '../../../services/loading-service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})

export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonContent, {read: ElementRef}) ideaList: ElementRef;
  currentUser: firebase.User;
  idea: IdeaModel;
  ideaId: string;
  ideaText: string;
  messages: ChatModel[] = [];
  newMessage: ChatModel = {};
  teamId: string;
  mutObserver: MutationObserver;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatServiceService,
    public surveyService: SurveyServiceService,
    public loadingService: LoadingService
  ) { }

  ionViewWillEnter() {

  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.initMessages();
      }
    });
    this.mutObserver = new MutationObserver(async (mutations) => {
      console.log('scroll move');
      await this.content.scrollToBottom(300);
    });
    this.mutObserver.observe(this.ideaList.nativeElement, {
        childList: true,
        subtree: true,
    });

  }

  async initMessages() {
    const that = this;
    await this.route.queryParams.subscribe(params => {
      if (params) {
        that.ideaId = params.ideaId;
        that.ideaText = params.ideaText;
        that.teamId = params.teamId;
        console.log(params.ideaId);
        console.log(params.ideaText);
      }
    });
    await this.loadingService.doFirebase(async () => {
      console.log('initMessages!!!');
      console.log('teamId' + this.teamId);
      const query = await firebase.firestore().collection('chats')
      .where('ideaId', '==', this.ideaId)
      .where('teamId', '==', this.teamId)
      .orderBy('createdAt', 'asc');

      query.onSnapshot((snapshot) => {
        console.log('Listener attached');
        // console.log('onSnapshot changed count = ' + ' ' + snapshot.size);
        // console.log(snapshot);
        // retrieve anything that has changed
          const changedDocs = snapshot.docChanges();
          changedDocs.forEach((change) => {
            // console.log(change.doc.data());
            const message = change.doc.data();
            const msgTime = message.createdAt;
            if ( msgTime !== undefined && msgTime !== null) {
              const date = new Date(msgTime.seconds * 1000);
              message.createdDateTime = that.formatDate(date);
              // change.doc.data()['createdDateTime'] = that.formatDate(date);
              // console.log(message);
              if (change.oldIndex !== -1) {
                that.messages.splice(change.oldIndex, 1);
              }
              if (change.newIndex !== -1) {
                that.messages.splice(change.newIndex, 0, new ChatModel(message));
              }
            }

          });

      });
    });

  }

  sendMessage() {
    if (!this.newMessage.text || !this.newMessage.text.trim()) {
      return true;
    }

    this.newMessage.ideaId = this.ideaId;
    this.newMessage.userId = this.currentUser.uid;
    this.newMessage.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    this.newMessage.teamId = this.teamId;
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = this.chatService.newMessage;
  }

  formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getFullYear() + '/'  +  (date.getMonth() + 1)  + '/'  +  date.getDate() + '/'   + ' ' + strTime;
  }
}
