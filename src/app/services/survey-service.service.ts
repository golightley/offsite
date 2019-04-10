import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {TeamMemberRole} from '../invite-team-mates/invite-team-mates.model';
import {TeammatesModel} from '../feedback/feedback-content/feedback-content.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyServiceService {
  
  public myParam: any; 
  public email: any; 
  public responses: any; 
  public categories: any; 
  public invites:any;
  public teamId:any;

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

  // get notifications for tab 1 of interface
  getFeedbackCategories() {
    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection('feedbackCategories')
        .where('active', '==', true).get()
        .then((docs) => {
          resolve(docs);
      }, err => reject(err));
    });
  }

  // get notifications for tab 1 of interface
  async getTeamMembers(userId: string) {
    const aryMembers: TeammatesModel[] = [];

    const docTeams = await firebase.firestore().collection('teams')
      .where('members', 'array-contains', {uid: userId}).get();

    docTeams.docs.forEach(doc => {
      const dicTeam: any = doc.data();
      if (dicTeam.hasOwnProperty('members')) {
        const members = dicTeam['members'];
        members.forEach(async dicMember => {
          if (dicMember.hasOwnProperty('uid')) {
            const memberId = dicMember['uid'];
            if (userId !== memberId && 0 === aryMembers.filter(member => {
              return member.uid === userId;
            }).length) {
              const docUser = await firebase.firestore().collection('users').doc(memberId).get();
              aryMembers.push(new TeammatesModel(docUser.id, docUser.data()));
            }
          }
        });
      }
    });

    return aryMembers;
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

    // pull questions for results tab
    checkIfInvitedtoAteam() {

      console.log("checking email function");
      console.log(this.email);

      // pull each question from firebase
      return new Promise<any>((resolve, reject) => {
        firebase.firestore().collection('teams')
        .where('invitedMembers', 'array-contains', this.email)
        .get()
        .then((teams) => {
          teams.forEach((doc) => {
              resolve(doc.data().teamName);
          });
        }, err => reject(err));
      });
    }
        // pull questions for results tab
    getTeamById(teamId) {
      return new Promise<any>((resolve, reject) => {
    console.log("Pulling team with this ID");
    console.log(teamId);
    var docRef = firebase.firestore().collection("teams").doc(teamId);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            resolve(doc.data());

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        reject(error);
    });
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


    // creates invite document for each person invited to the team
    inviteTeamMembers(teamMembersArray,teamName) {

          // holds simple array for dynamic email template 
          let emails = [];
          let teamId:string;

          // gets the array from the view 
          this.invites = Object.entries(teamMembersArray);

          // loops through each invited member to fill the array
          this.invites.forEach((invite) => {
            emails.push(invite[1].invitedEmail);
          });

          // create the team and add the list of invites
          this.teamId = this.createTeam(emails,teamName).then(docId =>{

            this.invites.forEach((invite) => {
              // need to replace 
              this.createEmailInvite(invite[1].invitedName, invite[1].invitedEmail,emails,teamName,docId) 
          });

          })

        //   // create a document for each person to be invited. Cloud function
        //   // triggers SendGrid on each document creation and handles on backend 
        //   this.invites.forEach((invite) => {
        //         // need to replace 
        //         this.createEmailInvite(invite[1].invitedName, invite[1].invitedEmail,emails,teamName,this.teamId) 
        // });
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


    createEmailInvite(name:string,email:string,team:any,teamName:string,teamId:string) {
      // Add a new document with a generated id.
      firebase.firestore().collection('emailInvites').add({
        name: name,
        email: email,
        team: team,
        teamId:teamId,
        teamName: teamName,
        user: firebase.auth().currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(function(docRef) {
        console.log('Email invite written with ID: ', docRef.id);
      }).catch(function(error) {
        console.error('Error adding email invite document: ', error);
      });
    }


    createTeam(team:any,teamName:string) {

      return new Promise<any>((resolve, reject) => {
      // Add a new document with a generated id.
      firebase.firestore().collection('teams').add({
        teamName: teamName,
        invitedMembers: team,
        user: firebase.auth().currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        members:[{
          uid:firebase.auth().currentUser.uid,
        }]


      }).then(function(docRef) {
        console.log('Email invite written with ID: ', docRef.id);
        resolve(docRef.id);
      }).catch(function(error) {
        console.error('Error adding email invite document: ', error);
        reject(error)
      });
    });
    }
}

