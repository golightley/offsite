import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class SurveyServiceService {
  
  public myParam: any; 
  public responses: any; 
  public categories: any; 

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

    //get notifcations for tab 1 of interface
    getFeedbackCategories(userID){
      let notifications = [];
      return new Promise<any>((resolve, reject) => {
        firebase.firestore().collection("feedbackCategories").get()
        .then((docs)=>{
          docs.forEach((doc)=>{
            notifications.push(doc);
          })
          resolve(notifications);
        }, err => reject(err));
      });
    }

       //get notifcations for tab 1 of interface
       getTeamMembers(userID){
        let notifications = [];
        return new Promise<any>((resolve, reject) => {
          firebase.firestore().collection("teams")
          .where("members", "array-contains", userID)
          .get()
          .then((docs)=>{
            docs.forEach((doc)=>{
              notifications.push(doc.data().memberinfo);
            })
            resolve(notifications);
          }, err => reject(err));
        });
      }

  // pull questions
  getQuestions(surveyId: string) {
    const questions = [];

    // pull each question from firebase
    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection('questions').where('surveys', 'array-contains', surveyId).get()
      .then(questionData => {
        questionData.forEach(doc => {
          questions.push(doc);
        });
        resolve(questions);
      }, err => reject(err));
    });
  }

  // pull questions for results tab
  getResults(userID) {
    const questions = [];
    // pull each question from firebase
    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection('questions').where('users', 'array-contains', userID).orderBy('lastUpdate', 'desc').get()
        .then((questionData) => {
          questionData.forEach((doc) => {
            questions.push(doc);
          });
        console.log('Printing result data for the results page...');
        console.log(questions);
        resolve(questions);
      }, err => reject(err));
    });
  }


    updateComments(questionID){

      let query = firebase.firestore().collection("comments").where("questionId", "==", questionID)

      query.onSnapshot((snapshot)=>{
        console.log("Changed")
        console.log(snapshot)

        //retrieve anything that has changed
        let changedDocs = snapshot.docChanges();
        changedDocs.forEach((change) => {

          if(change.type == "added"){
            return change;
          }

          if(change.type == "modified"){

          }
          
          if(change.type == "removed"){

          }

        })

      })

    }

    getComments(questionID) {
      const comments: any[] = [];
      // pull each question from firebase
      return new Promise<any>((resolve, reject) => {
        firebase.firestore().collection('comments').where('questionId', '==', questionID).get()
          .then((commentData) => {
            commentData.forEach((doc) => {
              comments.push(doc);
            });
            resolve(comments);
        }, err => reject(err));
      });
    }

    // submit survey response
    submitSurvey(surveyResponses) {
      console.log(Object.entries(surveyResponses));
      this.responses = Object.entries(surveyResponses);
      this.responses.forEach((response) => {
          this.updateDocument(response);
          this.createResponse(response);
          if (typeof response[1] === 'string') {
            console.log(response[1]);
            // if does not contain a number then save as a comment
            if (!((response[1].includes('1') || response[1].includes('2') || response[1].includes('3') || response[1].includes('4')))) {
              this.createComment(response[0], response[1], 'feedback', '');
            }
          }
      });
    }

    updateDocument(response) {
      // get data
      var questionRef = firebase.firestore().collection("questions").doc(response[0]);

      questionRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            let oldTotal  = (doc.data().averagescore * doc.data().numresponses);
            let newTotal  = parseInt(response[1], 10) + oldTotal;
            let newNumRes = doc.data().numresponses +1;
            let newAvg    = newTotal / newNumRes;

            console.log("Old total:"+oldTotal + "new total:"+newTotal + "new responses #"+newNumRes + "New average"+ newAvg)


            // 1 *2 / # of res (2)
            // Set the "capital" field of the city 'DC'
              return questionRef.update({
                lastresponse: response[1],
                averagescore:  newAvg,
                numresponses:newNumRes,
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp()

              })
              .then(function() {
                console.log("Document successfully updated!");
              })
              .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
              });
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

      // Set the "capital" field of the city 'DC'
      // Atomically add a new region to the "regions" array field.
      questionRef.update({
        responses: firebase.firestore.FieldValue.arrayUnion(response[1])
      });
    }

    createResponse(response) {
      // Add a new document with a generated id.
      firebase.firestore().collection('surveyResponses')
        .add({
          question: response[0],
          answer: response[1],
          user: firebase.auth().currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function(docRef) {
          console.log('Document written with ID: ', docRef.id);
        }).catch(function(error) {
          console.error('Error adding document: ', error);
        });
    }
    createComment(surveyId: string, comment: string, type: string, action: string) {
      // Add a new document with a generated id.
      firebase.firestore().collection('comments').add({
        questionId: surveyId,
        text: comment,
        name: 'Anonymous',
        type: type,
        action: action,
        user: firebase.auth().currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(function(docRef) {
        console.log('Document written with ID: ', docRef.id);
      }).catch(function(error) {
        console.error('Error adding document: ', error);
      });
    }
}
