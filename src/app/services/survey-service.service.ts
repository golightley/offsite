import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class SurveyServiceService {

  constructor() { }

  //get notifcations for tab 1 of interface
  getNotifications(userID){
    let notifications = [];
    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection("surveynotifications").where("user", "==",userID).where("active", "==", true).get()
      .then((docs)=>{
        docs.forEach((doc)=>{
          notifications.push(doc);
        })
        resolve(notifications);
      }, err => reject(err));
    });
  }

  getQuestions(selectedSurveyObect){
    let questions = [];
    //iterate through list of questions
    let surveyID = selectedSurveyObect.data().survey;
    //pull each question from firebase 
    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection("questions").where("surveys", "array-contains", surveyID).get()
      .then((docs)=>{
        docs.forEach((doc)=>{
          questions.push(doc);
        })
        resolve(questions);
      }, err => reject(err));
    });
  }


}


