import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { ChatModel } from '../chat/chat.model';
@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  constructor() { }

  get newMessage() {
    const message: ChatModel = {};
    message.text = '';

    return message;
  }

  sendMessage(message: ChatModel) {
    // Add a new document with a generated id.
    firebase.firestore().collection('chats').add({
      userId: message.userId,
      text: message.text,
      ideaId: message.ideaId,
      teamId: message.teamId,
      createdAt: message.createdAt
    }).then(function (docRef) {
      console.log('Document written with ID: ', docRef.id);
    }).catch(function (error) {
      console.error('Error adding document: ', error);
    });
  }
}
