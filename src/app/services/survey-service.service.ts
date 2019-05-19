import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { TeamMemberRole } from '../invite-team-mates/invite-team-mates.model';
import { TeammatesModel } from '../feedback/feedback-content/feedback-content.model';
// import {NotificationsPage} from '../notifications/notifications.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SurveyServiceService {

  public myParam: any;
  public showBottom: any;
  public email: any;
  public responses: any;
  public categories: any;
  public invites: any;
  public teamId: any;
  public team: any;


  constructor(private http: HttpClient) { }

  //get notifcations for tab 1 of interface
  getNotifications(userID) {
    let notifications = [];
    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection('surveynotifications').where('user', '==', userID).where('active', '==', true).get()
        .then((docs) => {
          docs.forEach((doc) => {
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
      .where('members', 'array-contains', { uid: userId }).get();

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
              firebase.firestore().collection('users').doc(memberId).get().then(docUser => {
                aryMembers.push(new TeammatesModel(docUser.id, docUser.data()));

              })
            }
          }
        });
      }
    });

    return aryMembers;
  }

  // pull questions
  getQuestionData(surveyId: string) {
    const doughnutChartData: number[] = [];
    const questions = [];

    return new Promise<any>((resolve, reject) => {
      var docRef = firebase.firestore().collection('questions').doc(surveyId);
      docRef.get().then(function (doc) {
        resolve(doc.data());
      }).catch(function (error) {
        console.log('Error getting document:', error);
        reject(error);
      });
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
  getResults(userID, goal) {
    const questions = [];
    // pull each question from firebase
    return new Promise<any>((resolve, reject) => {
      // firebase.firestore().collection('questions').where('goal', '==',goal).orderBy('lastUpdate', 'desc').get()
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
  getTeamId(userID) {

    console.log('ServeyService.GetTeamId.UserID=' + userID)
    // pull each question from firebase
    return new Promise<any>((resolve, reject) => {
      firebase.firestore()
        .collection('users')
        .doc(userID)
        .get()
        .then((questionData) => {
          resolve(questionData);
        }, err => reject(err));
    });
  }

  // pull questions for results tab
  checkIfInvitedtoAteam() {

    console.log('checking email function');
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
  checkIfInvitedtoAteamWithEmail(email) {
    console.log('checking email function');
    console.log(email);
    // pull each question from firebase                                                                                                      
    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection('emailInvites')
        .where('email', '==', email)
        .where('active', '==', true)
        .get()
        .then((teams) => {

          console.log('returned checkIfInvitedToTeamsFunction');
          console.log(teams);
          if (teams.docs.length == 0) {
            resolve(null);
          }
          teams.forEach((doc) => {
            resolve(doc);
          });
        }, err => reject(err));
    });
  }
  // pull questions for results tab
  getTeamById(teamId) {
    return new Promise<any>((resolve, reject) => {
      console.log('Pulling team with this ID');
      console.log(teamId);
      var docRef = firebase.firestore().collection('teams').doc(teamId);
      docRef.get().then(function (doc) {
        if (doc.exists) {
          console.log('Document data:', doc.data());
          resolve(doc.data());

        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      }).catch(function (error) {
        console.log('Error getting document:', error);
        reject(error);
      });
    });

  }

  getTeamByUserId(userId) {

    return new Promise<any>((resolve, reject) => {
      console.log('Pulling team with this User ID');
      console.log(userId)
      var docRef = firebase.firestore().collection('teams').where('membersids', 'array-contains', userId);
      docRef.get().then(function (doc) {
        doc.forEach(team => {
          console.log('Team found')
          console.log(team)
          resolve(team);
        })

      }).catch(function (error) {
        console.log('Error getting document:', error);
        reject(error);
      });
    });

  }

  createTeamByUserId(userId, teamName) {
    return new Promise<any>((resolve, reject) => {
      const that = this;
      firebase.firestore().collection('teams').add({
        active: true,
        memembersids: [userId],
        members: {
          uid: userId
        },
        teamName: teamName,
        createdBy: userId,
        teamCreated: firebase.firestore.FieldValue.serverTimestamp()
      }).then(async(docRef) => {
        console.log(' Team created with ID: ', docRef.id);
        // create survey questions for the team utilizing cloud functions
        await that.callCreateSurveyCloudFunction(docRef.id);
        await that.updateUserWithTeamId(userId, docRef.id);
        resolve(docRef.id);
      }).catch(function (error) {
        console.error('Error creating sruvey document: ', error);
        reject(error);
      });
    });
  }

  async callCreateSurveyCloudFunction(teamId) {
    console.log('Calling cloud function... ');
    const body = {
      teamId: teamId,
      userId: firebase.auth().currentUser.uid
    };
    try {
      const resp = await this.http.post('//us-central1-offsite-9f67c.cloudfunctions.net/createPulseChecks', JSON.stringify(body), {
        responseType: 'text'
      }).toPromise();
      console.log(resp);
      return resp;
    } catch (error) {
      console.log(error);
    }

  }

  async updateUserWithTeamId(userId, teamId) {

    try {
      await firebase.firestore().collection('users').doc(userId).update({
        teamId: teamId
      });
      console.log('User\'s teamID successfully updated!');
    } catch (error) {
      // The document probably doesn't exist.
      console.error('Error updating user: ', error);
    }
  }

  joinTeamWithCode(myUserId, teamId) {

    return new Promise<any>((resolve, reject) => {
      var ref = firebase.firestore().collection('teams').doc(teamId);

      // Set the 'capital' field of the city 'DC'
      return ref.update({
        membersids: firebase.firestore.FieldValue.arrayUnion(myUserId),
        members: firebase.firestore.FieldValue.arrayUnion({ myUserId }),
      })
        .then(function (docRef) {
          console.log('Team Document successfully updated!');
          console.log(ref);
          resolve(ref);

        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error('Error updating document: ', error);
          reject(error)

        });

    });


  }


  updateComments(questionID) {

    let query = firebase.firestore().collection('comments').where('questionId', '==', questionID)

    query.onSnapshot((snapshot) => {
      console.log('Changed')
      console.log(snapshot)

      //retrieve anything that has changed
      let changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {

        if (change.type == 'added') {
          return change;
        }

        if (change.type == 'modified') {

        }

        if (change.type == 'removed') {

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



  createSurvey(teamMates, categories, inputText, toggle) {

    var that = this;
    this.categories = categories;
    console.log('Input text ==>' + inputText);

    // people can either ask about a general cateogry 
    if (toggle == 'category') {
      this.categories.forEach(category => {
        return new Promise<any>((resolve, reject) => {
          // Add a new document with a generated id.
          firebase.firestore().collection('surveys').add({
            active: true,
            category: category.name,
            type: 'feedback',
            month: 'May',
            from: firebase.auth().currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }).then(function (docRef) {
            console.log(' Survey written with ID: ', docRef.id);

            // create the corresponding notitifcations
            that.createFeedbackNotifications(teamMates, docRef.id, category, toggle)


            resolve(docRef.id);
          }).catch(function (error) {
            console.error('Error creating sruvey document: ', error);
            reject(error)
          });
        });
      });
    }
    // or a specific event
    else {

      return new Promise<any>((resolve, reject) => {
        // Add a new document with a generated id.
        firebase.firestore().collection('surveys').add({
          active: true,
          category: inputText,
          type: 'feedback',
          month: 'May',
          from: firebase.auth().currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function (docRef) {
          console.log(' Survey written with ID: ', docRef.id);

          // create the corresponding notitifcations
          that.createFeedbackNotifications(teamMates, docRef.id, inputText, toggle)
          console.log('Created survey');

          resolve(docRef.id);
        }).catch(function (error) {
          console.error('Error creating survey document: ', error);
          reject(error)
        });
      });



    }



  }

  createFeedbackQuestion(surveyId: string, user: string, categoryName: string, name: string) {

    console.log('Id: ' + surveyId);
    console.log('User: ' + user);
    console.log('Name: ' + name);
    console.log('categoryName: ' + categoryName);


    // look up the teamplate 
    let that = this;
    firebase.firestore().collection('questions').add({
      active: true,
      Question: 'What is one thing that ' + name + ' did well?',
      type: 'input',
      users: [user],
      goal: 'feedback',
      surveys: [surveyId],
      from: firebase.auth().currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function (docRef) {
      console.log('Survey question written with ID: ', docRef.id);
    }).catch(function (error) {
      console.error('Error adding document: ', error);
    });


    firebase.firestore().collection('questions').add({
      active: true,
      Question: 'What is one thing that ' + name + ' could have done better?',
      type: 'input',
      users: [user],
      goal: 'feedback',
      surveys: [surveyId],
      from: firebase.auth().currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function (docRef) {
      console.log('Survey question written with ID: ', docRef.id);
    }).catch(function (error) {
      console.error('Error adding document: ', error);
    });
  }


  createSurveyQuestions(surveyId: string, user: string, categoryName: string, name: string) {

    // look up the teamplate 
    const questionTemplates: any[] = [];
    let that = this;

    // pull each question from firebase
    firebase.firestore().collection('questionTemplate').where('category', '==', categoryName).get()
      .then((questionTemplate) => {
        questionTemplate.forEach((templates) => {
          console.log('Create question template function')
          console.log(templates)
          console.log('Create question template data function')
          console.log(templates.data().Questions)
          let questions: any[] = [];

          questions = templates.data().Questions;

          questions.forEach(question => {
            let questionText: string = '';

            if (question.type === 'input') {
              questionText = 'What are examples of ' + name + '\'s ' + question.question;
            } else {
              questionText = 'Would you recommend ' + name + ' \'s ' + question.question;
            }

            console.log(question)
            firebase.firestore().collection('questions').add({
              active: true,
              Question: questionText,
              type: question.type,
              users: [user],
              goal: 'feedback',
              surveys: [surveyId],
              from: firebase.auth().currentUser.uid,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function (docRef) {
              console.log('Survey question written with ID: ', docRef.id);
            }).catch(function (error) {
              console.error('Error adding document: ', error);
            });
          });
          // templates.questions.forEach(template => {


          // });

        });
      })
  }


  // add a question for each one in the template 


  // console.log('creating survey questions')
  // // Add a new document with a generated id.

  // } 

  // createQuestion(){

  // }


  createNotification(surveyId: string, user: string, type: string, name: string, category: string) {

    console.log('creating notitfication')
    // Add a new document with a generated id.
    firebase.firestore().collection('surveynotifications').add({
      active: true,
      category: category,
      name: name,
      survey: surveyId,
      // user:'AKfOgVZrSTYsYN01JA0NUTicf703',
      user: user,
      type: type,
      month: 'May',
      from: firebase.auth().currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function (docRef) {
      console.log('Document written with ID: ', docRef.id);
    }).catch(function (error) {
      console.error('Error adding document: ', error);
    });
  }

  // creates invite document for each person invited to the team
  inviteTeamMembers(teamMembersArray, teamName) {

    // holds simple array for dynamic email template 
    let emails = [];
    let teamId: string;

    // gets the array from the view 
    this.invites = Object.entries(teamMembersArray);

    // loops through each invited member to fill the array
    this.invites.forEach((invite) => {
      emails.push(invite[1].invitedEmail);
    });

    // create the team and add the list of invites
    this.teamId = this.createTeam(emails, teamName).then(docId => {

      this.invites.forEach((invite) => {
        // need to replace 
        this.createEmailInvite(invite[1].invitedName, invite[1].invitedEmail, emails, teamName, docId)
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
    var questionRef = firebase.firestore().collection('questions').doc(response[0]);

    questionRef.get().then(function (doc) {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        let oldTotal = (doc.data().averagescore * doc.data().numresponses)
        let newTotal = parseInt(response[1], 10) + oldTotal;
        let newNumRes = doc.data().numresponses + 1;
        let newAvg = newTotal / newNumRes;
        let newResp = parseInt(response[1], 10);
        let pieChart = doc.data().piechart;
        let lineChart = doc.data().linechart;

        // if the pie chart isn't set
        if (pieChart == undefined) {
          pieChart = [0, 0, 0, 0]
        }
        // update the pie chart 
        if (newResp == 1) { pieChart[0] = pieChart[0] + 1 }
        else if (newResp == 2) { pieChart[1] = pieChart[1] + 1 }
        else if (newResp == 3) { pieChart[2] = pieChart[2] + 1 }
        else { pieChart[3] = pieChart[3] + 1 }

        // if the line chart isn't set
        if (lineChart == undefined) {
          lineChart = []
        }
        lineChart.push(newAvg);

        // if Nan then first time 
        if (isNaN(newAvg)) { newAvg = parseInt(response[1], 10); }
        if (isNaN(newNumRes)) { newNumRes = 1 }



        console.log('Old total:' + oldTotal + 'new total:' + newTotal + 'new responses #' + newNumRes + 'New average' + newAvg)


        // 1 *2 / # of res (2)
        // Set the 'capital' field of the city 'DC'
        return questionRef.update({
          lastresponse: response[1],
          averagescore: newAvg,
          numresponses: newNumRes,
          piechart: pieChart,
          linechart: lineChart,
          lastUpdate: firebase.firestore.FieldValue.serverTimestamp()

        })
          .then(function () {
            console.log('Document successfully updated!');
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error('Error updating document: ', error);
          });

      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    }).catch(function (error) {
      console.log('Error getting document:', error);
    });

    // Set the 'capital' field of the city 'DC'
    // Atomically add a new region to the 'regions' array field.
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
      }).then(function (docRef) {
        console.log('Document written with ID: ', docRef.id);
      }).catch(function (error) {
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
    }).then(function (docRef) {
      console.log('Document written with ID: ', docRef.id);
    }).catch(function (error) {
      console.error('Error adding document: ', error);
    });
  }

  async createIdea(team: string, comment: string, type: string, action: string) {
    // Add a new document with a generated id.
    await firebase.firestore().collection('ideas').add({
      team: team,
      text: comment,
      name: 'Anonymous',
      type: type,
      score: 0,
      action: type,
      reported: false,
      user: firebase.auth().currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function (docRef) {
      console.log('Document written with ID: ', docRef.id);
    }).catch(function (error) {
      console.error('Error adding document: ', error);
    });
  }



  markSurveyComplete(id: string) {
    var ref = firebase.firestore().collection('surveynotifications').doc(id);
    console.log('surveynotification' + id);

    // Set the 'capital' field of the city 'DC'
    return ref.update({
      active: false
    })
      .then(function () {
        console.log('Document successfully updated!');
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
      });
  }
  reportIdea(id: string) {

    var ref = firebase.firestore().collection('ideas').doc(id);
    // Set the 'capital' field of the city 'DC'
    return ref.update({
      reported: true
    })
      .then(function () {
        console.log('Document successfully updated!');
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
      });
  }








  createEmailInvite(name: string, email: string, team: any, teamName: string, teamId: string) {
    // Add a new document with a generated id.
    firebase.firestore().collection('emailInvites').add({
      name: name,
      email: email,
      team: team,
      teamId: teamId,
      active: true,
      teamName: teamName,
      user: firebase.auth().currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function (docRef) {
      console.log('Email invite written with ID: ', docRef.id);
    }).catch(function (error) {
      console.error('Error adding email invite document: ', error);
    });
  }


  createTeam(team: any, teamName: string) {

    return new Promise<any>((resolve, reject) => {
      // Add a new document with a generated id.
      firebase.firestore().collection('teams').add({
        teamName: teamName,
        invitedMembers: team,
        user: firebase.auth().currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        members: [{
          uid: firebase.auth().currentUser.uid,
        }]


      }).then(function (docRef) {
        console.log('Email invite written with ID: ', docRef.id);
        resolve(docRef.id);
      }).catch(function (error) {
        console.error('Error adding email invite document: ', error);
        reject(error)
      });
    });
  }

  createFeedbackNotifications(teamMates, surveyId, category, toggle) {
    console.log('in create feedback notificatino')
    console.log(teamMates)
    this.team = teamMates;
    // this.team = Object.entries(teamMates);

    // cycle through team mates array
    this.team.forEach(member => {
      // loop through each category
      //  this.categories.forEach(category =>{
      // if selected is true 
      console.log('Looping...')
      console.log(member)
      console.log(category)
      if (member.checked) {
        if (category.checked || toggle == 'event') {
          //create survey 
          if (toggle == 'category') {
            this.createSurveyQuestions(surveyId, member.uid, category.name, member.name);
            this.createNotification(surveyId, member.uid, 'feedback', member.name, category.name)

          } else {
            this.createFeedbackQuestion(surveyId, member.uid, category, member.name);
            this.createNotification(surveyId, member.uid, 'feedback', member.name, category)

          }
        }

      }
      //  });

    });
    // send notification 
  }

}

