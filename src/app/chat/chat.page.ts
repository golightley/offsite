import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { IdeaModel, CommentActionType } from '../ideas/ideas.model';
import { SurveyServiceService } from '../services/survey-service.service';
import { ChatServiceService } from '../services/chat-service.service';
require('firebase/auth');
import { ChatModel } from './chat.model';
import { IonContent, IonDatetime } from '@ionic/angular'; 
import { LoadingService } from '../services/loading-service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})

export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonContent, {read: ElementRef}) ideaList: ElementRef;
  currentUser:firebase.User;
  idea:IdeaModel;
  ideaId:string;
  ideaText:string;
  messages: ChatModel[] = [];
  newMessage: ChatModel = {};
  teamId: string;
  private mutObserver: MutationObserver;
  unsubscribe:any;
 
  constructor(
    private route: ActivatedRoute,
    private chatService: ChatServiceService,
    public surveyService: SurveyServiceService,
    public loadingService: LoadingService
  ) { }

  
  ionViewWillEnter() {
    console.log('ionViewDidEnter')
    setTimeout(() => {
      this.content.scrollToBottom(300);
      }, 100);
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.content.scrollToBottom();
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

    //this.autoScroller = this.autoScroll();
  }

  async initMessages() {
    window.scrollTo(0, document.body.scrollHeight);
    this.content.scrollToBottom(300);

    const that = this;
    await this.route.queryParams.subscribe(params => {
      if (params) {
        
        that.ideaId = params.ideaId;
        that.ideaText = params.ideaText;
        that.teamId = params.teamId;
        console.log(params.ideaId)
        console.log(params.ideaText);
      }
    });
     
    await this.loadingService.doFirebase(async () => {
      console.log('initMessages!!!');
      console.log('teamId' + this.teamId);
      const query = await firebase.firestore().collection("messages").where("ideaId", "==",this.ideaId).where("teamId", "==", this.teamId).orderBy('createdAt','asc');
      
      query.onSnapshot((snapshot) => {
        console.log("Listener attached");
        console.log(snapshot);
        // retrieve anything that has changed
          const changedDocs = snapshot.docChanges();
          changedDocs.forEach((change) => {
            if (change.oldIndex !== -1) {
              that.messages.splice(change.oldIndex, 1);
            }
            if (change.newIndex !== -1) {
              that.messages.splice(change.newIndex, 0, new ChatModel(change.doc.data()));
            }
          if(this.messages.length == 0)
          {
          } else {
          }
          
          });
        this.content.scrollToBottom(100);
      });
    });
    this.content.scrollToBottom(100);
  }

  sendMessage() {
    if (!this.newMessage.text || !this.newMessage.text.trim()) {
      return true;
    }
    
    this.newMessage.ideaId = this.ideaId;
    this.newMessage.from = this.currentUser.uid;
    this.newMessage.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    this.newMessage.teamId = this.teamId;
    //ChatPage.messages.push(ChatPage.newMessage);
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = this.chatService.newMessage;
    //this.scrollDown();
    this.content.scrollToBottom(300);
  }

  private scrollDown() {
    if (this.scroller) 
    {
      this.scroller.scrollTop = this.scroller.scrollHeight;
    }    
  }

  private autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messageContent, {
      childList: true,
      subtree: true
    });

    return autoScroller;
  }

  ngOnDestroy() {
    //this.autoScroller.disconnect();
  }

  private get messageContent(): Element {
    return document.querySelector('.messages');
  }

  private get scroller(): Element {
    return this.messageContent.shadowRoot.querySelector('ion-scroll');
  }

}
