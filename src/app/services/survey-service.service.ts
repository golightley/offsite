import { Injectable, ErrorHandler } from '@angular/core';
import * as firebase from 'firebase/app';
import { TeamMemberRole } from '../pages/team/invite-team-mates/invite-team-mates.model';
import { TeammatesModel } from '../pages/feedback/feedback-content/feedback-content.model';
// import {NotificationsPage} from '../notifications/notifications.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LoadingService } from './loading-service';
import { UserTeamsModel } from '../pages/team/select-team/select-team.component.model';
import to from 'await-to-js';
import { ToastController } from '@ionic/angular';
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


  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private toastController: ToastController
  ) {

  }

  getNotifications(userID) {
    let notifications = [];
    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection('surveynotifications').where('user', '==', userID).where('active', '==', true).get()
        .then((docs) => {
          docs.forEach((doc) => {
            notifications.push(doc);
          });
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
    await this.loadingService.doFirebase(async() => {
      const teamId = await this.getActiveTeam(userId);
      await firebase.firestore().collection('teams').doc(teamId).get().then(doc => {
        const dicTeam: any = doc.data();
        if (dicTeam.hasOwnProperty('members')) {
          const members = dicTeam['members'];
          members.forEach(async dicMember => {
            if (dicMember.hasOwnProperty('uid')) {
              const memberId = dicMember['uid'];
              if (userId !== memberId && 0 === aryMembers.filter(member => {
                return member.uid === userId;
              }).length) {
                console.log('My Team Members - memberid - ' + memberId);
                firebase.firestore().collection('users').doc(memberId).get().then(docUser => {
                  aryMembers.push(new TeammatesModel(docUser.id, docUser.data()));
                });
              }
            }
          });
        }
      });
    });
    return aryMembers;
  }

  // pull questions
  getQuestionData(surveyId: string) {
    const doughnutChartData: number[] = [];
    const questions = [];

    return new Promise<any>((resolve, reject) => {
      const docRef = firebase.firestore().collection('questions').doc(surveyId);
      docRef.get().then(function (doc) {
        resolve(doc.data());
      }).catch(function (error) {
        console.log('Error getting document:', error);
        reject(error);
      });
    });
  }

  async getQuestions(surveyId: string) {
    const questions = [];
    const result = await this.loadingService.doFirebase(async() => {
      const docs = await firebase.firestore().collection('questions').where('surveys', 'array-contains', surveyId);
      await docs.get().then(async(questionData) => {
        questionData.forEach(doc => {
          questions.push(doc);
        });
      })
      .catch(error => {
        return 'error';
      });
    return questions;
  });
  return result;
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
  getTeamId(userId: string) {

    console.log('ServeyService.GetTeamId.UserID=' + userId)
    // pull each question from firebase
    return new Promise<any>((resolve, reject) => {
      firebase.firestore()
        .collection('users')
        .doc(userId)
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
  async getInvitedTeams(userEmail)
  {
    const result = await this.loadingService.doFirebase(async() => {
      return new Promise<any>((resolve, reject) => {
        const that = this;

        const docRef = firebase.firestore().collection('emailInvites')
          .where("email", "==",userEmail)
          .where('active', '==', true);
        docRef.get().then(async function (teams) {
            if (teams.docs.length === 0) {
              resolve(null);
            } else {
              resolve(teams.docs);
            }
        }).catch (error => {
            reject(error);
        })
      })
    })
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
          // console.log(teams);
          if (teams.docs.length === 0) {
            resolve(null);
          }
          teams.forEach((team) => {
            resolve(team);
          });
        }, err => reject(err));
    });
  }
  // pull questions for results tab
  getTeamById(teamId) {
    return new Promise<any>((resolve, reject) => {
      console.log('Pulling team with this ID');
      console.log(teamId);
      const docRef = firebase.firestore().collection('teams').doc(teamId);
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
      const docRef = firebase.firestore().collection('teams').where('memembersids', 'array-contains', userId);
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
  async isExistedTeam(uid, teamName) {
    const result = await this.loadingService.doFirebase(async() => {
      return new Promise<any>((resolve, reject) => {
        const docRef = firebase.firestore().collection('teams')
        .where('createdBy', '==', uid)
        .where('teamName', '==', teamName);
        docRef.get().then(function (doc) {
          doc.forEach(team => {
            if (team.exists) {
              reject('exists');
            } else {
              resolve(team.id);
            }
          });
        }).catch(function (error) {
          reject(error);
        });
      });
    });
    return result;
  }

  async getUserTeams(userId) {
    const docTeams = await firebase.firestore().collection('teams')
    .where('members', 'array-contains', { uid: userId });
    docTeams.get().then(function (teams) {
      console.log('[getUserTeams] team count = ' + teams.size);
    });
  }

  async createTeamByUserId(uid, teamName) {
    const result = await this.loadingService.doFirebase(async() => {
      return new Promise<any>((resolve, reject) => {
        const that = this;

        const docRef = firebase.firestore().collection('teams').where('teamName', '==', teamName);
        docRef.get().then(function (ref) {
          console.log('count = ' + ref.size);
          if (ref.size === 0) {
            firebase.firestore().collection('teams').add({
              active: true,
              memembersids: [uid],
              members: firebase.firestore.FieldValue.arrayUnion({ uid }),
              teamName: teamName,
              createdBy: uid,
              teamCreated: firebase.firestore.FieldValue.serverTimestamp()
            }).then(async(teamData) => {
              console.log(' Team created with ID: ', teamData.id);
              console.log(teamData);
              // create survey questions for the team utilizing cloud functions
              await to(that.callCreateSurveyCloudFunction(teamData.id, 'create'));
              await to(that.updateUserWithTeamId(uid, teamData.id));
              resolve(teamData.id);
            }).catch(function (error) {
              console.error('Error creating sruvey document: ', error);
              reject(error);
            });
          } else {
            console.log('[CreateTeam] Team already exist!');
            reject('exist');
          }
        });
      });
    });
    return result;
  }

  async callCreateSurveyCloudFunction(teamId: string, isTeamCreate: string) {
    console.log('Calling createPulseChecks cloud function... team id = ' + teamId);
    console.log('Calling createPulseChecks cloud function... state = ' + isTeamCreate);
    const body = {
      teamId: teamId,
      userId: firebase.auth().currentUser.uid,
      isTeamCreate: isTeamCreate
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

  joinTeamWithCode(uid, teamId) {
    return new Promise<any>((resolve, reject) => {
      const ref = firebase.firestore().collection('teams').doc(teamId);
      // Set the 'capital' field of the city 'DC'
      return ref.update({
        memembersids: firebase.firestore.FieldValue.arrayUnion(uid),
        members: firebase.firestore.FieldValue.arrayUnion({ uid }),
      })
        .then(function (docRef) {
          console.log('Team Document successfully updated!');
          console.log(docRef);
          resolve(docRef);
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error('Error updating document: ', error);
          reject(error);
        });
    });
  }

  async showToastMsg(message) {
    const toast = await this.toastController.create({
      message: message,
      closeButtonText: 'close',
      showCloseButton: true,
      duration: 2000
    });
    toast.present();
  }


  async joinTeamWithName(uid, teamName) {
    const that = this;
    const result = await this.loadingService.doFirebase(async() => {
      return new Promise<any>((resolve, reject) => {
        const docRef = firebase.firestore().collection('teams').where('teamName', '==', teamName);
        docRef.get().then(async function (ref) {
          console.log('count = ' + ref.size);
          if (ref.size === 0) {
            console.log('[JoinTeam] Team not found!');
            reject('Not found');
          } else {
            console.log('[JoinTeam] found teamname = ' + ref.docs[0].data().teamName);
            console.log('[JoinTeam] found team');
            console.log('[JoinTeam] teamId = ' + ref.docs[0].id);
            firebase.firestore().collection('users').doc(uid).update({
              'teamId': ref.docs[0].id,
            }).then(async () => {
              console.log('[JoinTeam] user team is updated successfully!');
            });
            const docTeamRef = await firebase.firestore().collection('teams').doc(ref.docs[0].id);
            docTeamRef.get().then(async function (doc) {
              if (doc.exists) {
                const members = doc.data().memembersids;
                const index = members.findIndex(member => member === uid);
                console.log('[JoinTeam] index = ' + index);
                if (index !== -1) {
                  console.log('[JoinTeam] This user has already registered for the team.');
                  reject('already exist');
                } else {
                  console.log('start to regist...');
                  return ref.docs[0].ref.update({
                    memembersids: firebase.firestore.FieldValue.arrayUnion(uid),
                    members: firebase.firestore.FieldValue.arrayUnion({ uid }),
                  })
                  .then(async function(docRef) {
                      console.log('Team Document successfully updated!');
                      console.log(ref.docs[0].data().teamName);
                      console.log('[JoinTeam] team name = ' + ref.docs[0].data().teamName);
                      await to(that.callCreateSurveyCloudFunction(ref.docs[0].id, 'join'));
                      resolve(ref.docs[0].data().teamName);
                  })
                  .catch(function (error) {
                    // The document probably doesn't exist.
                    console.error('Error updating document: ', error);
                    reject(error);
                  });
                }
              } else {
              }
            });
          }
        });
      });
    });
    return result;
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

  async submitSurvey(surveyResponses) {
    console.log(Object.entries(surveyResponses));
    this.responses = Object.entries(surveyResponses);
    const result = await this.loadingService.doFirebase(async() => {
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
        console.log('+++ finish survey for question +++ ');
      });

      console.log('=== finish survey for all questions ===');
    });
    return result;
  }

  createSurvey(teamMates, categories, inputText, toggle) {

    const that = this;
    this.categories = categories;
    console.log('Input text ==>' + inputText);

    // people can either ask about a general cateogry 
    if (toggle === 'category') {
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
            reject(error);
          });
        });
      });
    } else {
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
          reject(error);
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
        });
      });
  }


  // add a question for each one in the template 


  // console.log('creating survey questions')
  // // Add a new document with a generated id.

  // } 

  // createQuestion(){

  // }


  createNotification(surveyId: string, user: string, type: string, name: string, category: string) {
    console.log('creating notitfication');
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

  async getActiveTeam(userId: string) {
    console.log('[ActiveTeam] userID = ' + userId);
    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection('users').doc(userId).get().then(docUser => {
        console.log('[ActiveTeam] teamID = ' + docUser.data().teamId);
        resolve(docUser.data().teamId);
      }).catch(error => {
        console.log('[ActiveTeam] error = ' + error);
        reject(error);
      });
    });
  }

  async getUserIdFromEmail(email) {
      return new Promise<any>((resolve, reject) => {
        console.log('[InviteTeam] email = ' + email);
        const docRef = firebase.firestore().collection('users').where('email', '==', email);
        docRef.get().then(async function (ref) {
          console.log('count = ' + ref.size);
          if (ref.size === 0) {
            resolve('not found');
          } else {
            console.log('[InviteTeam] found userId = ' + ref.docs[0].id);
            resolve(ref.docs[0].id);
          }
        }).catch(error => {
          reject(error);
        });
      });
  }

  // creates invite document for each person invited to the team
  async inviteTeamMembers(inviteMembersArray, teamId, teamName) {
    if ( inviteMembersArray[0].email === undefined ) {
      const toast = await this.toastController.create({
        message: 'Please input invite email.',
        closeButtonText: 'close',
        showCloseButton: true,
        duration: 2000,
        cssClass: ''
      });
      toast.present();
      return;
    }
    let teamData;
    const that = this;
    const result = await this.loadingService.doFirebase(async() => {
      console.log('[InviteTeam] userId = ' + firebase.auth().currentUser.uid);
      teamData = await that.getTeamId(firebase.auth().currentUser.uid);
        console.log('[InviteTeam] team id = ' + teamData.data().teamId);
        if (teamData.data().teamId) {
          const docRef = await firebase.firestore().collection('teams').doc(teamData.data().teamId);
             docRef.get().then(async function (doc) {
              if (doc.exists) {
                const userTeam = new UserTeamsModel(doc.data());
                teamId = teamData.data().teamId;
                teamName = userTeam.teamName;
                console.log('[InviteTeam] team name = ' + teamName);
                console.log('[InviteTeam] invite count = ' + inviteMembersArray.length);
                for (let i = 0; i < inviteMembersArray.length; i++ ) {
                  const member = inviteMembersArray[i];
                  console.log('[InviteTeam] member mail = ' + member.email);
                  if (member.email === undefined) {
                    continue;
                  }
                  const userId = await that.getUserIdFromEmail(member.email);
                  console.log('[InviteTeam] invited userId = ' + userId);
                  if ( userId !== 'not found') {
                    const members = doc.data().memembersids;
                    const index = members.findIndex(inviteMember => inviteMember === userId);
                    console.log('[InivteTeam] index = ' + index);
                    if (index !== -1) {
                      console.log('[InivteTeam] This user has already registered for the team.');
                      that.showToastMsg(member.email + ' was already invited.');
                      return;
                    } else {
                      console.log('[InivteTeam] no invited...');
                      to(that.sendEmailInvite(member, teamId, teamName));
                      that.showToastMsg('Invite email sent successfully.');
                      //return;
                    }
                  } else if (userId === 'not found') {
                    console.log('[InivteTeam] not signed...');
                    to(that.sendEmailInvite(member, teamId, teamName));
                    that.showToastMsg('Invite email sent successfully.');
                    //return;
                  } else {
                    throw new ErrorEvent(userId.error);
                  }
                }
              }
            });
        }
    });
    return result;
  }

  async sendEmailInvite(member: any, teamId: string, teamName: string ) {
    return new Promise<any>((resolve, reject) => {
      console.log('invited teamname: ' + teamName);
      const body = {
        email: member.email,
        userId: firebase.auth().currentUser.uid,
        team:  teamName,
        teamName:  teamName,
        teamId: teamId
      };
      this.http.post('https://us-central1-offsite-9f67c.cloudfunctions.net/firestoreEmail', JSON.stringify(body), {
          responseType: 'text'
      }).toPromise()
      .then(() => {
        console.log('---sent invite email---');
        resolve();
      })
      .catch(reject);
    });
  }

  addEmailInvite(name: string, email: string, team: any, teamName: string, teamId: string) {
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
    const ref = firebase.firestore().collection('surveynotifications').doc(id);
    console.log('surveynotification' + id);

    // Set active field to false and Change the timestamp field to date after a month.

    return ref.update({
      active: false,
      timestamp: new Date((new Date()).setDate((new Date).getDate() + 30))
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

    const ref = firebase.firestore().collection('ideas').doc(id);
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


  /*createTeam(team: any, teamName: string) {

    return new Promise<any>((resolve, reject) => {
      // Add a new document with a generated id.
      firebase.firestore().collection('teams').add({
        teamName: teamName,
        createdBy: firebase.auth().currentUser.uid,
        teamCreated: firebase.firestore.FieldValue.serverTimestamp(),
        members: [{
          uid: firebase.auth().currentUser.uid,
        }],
        memembersids: [{
          uid: firebase.auth().currentUser.uid,
        }],
      }).then(function (docRef) {
        console.log('Email invite written with ID: ', docRef.id);
        resolve(docRef.id);
      }).catch(function (error) {
        console.error('Error adding email invite document: ', error);
        reject(error)
      });
    });
  }*/

  createFeedbackNotifications(teamMates, surveyId, category, toggle) {
    console.log('in create feedback notificatino');
    console.log(teamMates);
    this.team = teamMates;
    // this.team = Object.entries(teamMates);

    // cycle through team mates array
    this.team.forEach(member => {
      // loop through each category
      //  this.categories.forEach(category =>{
      // if selected is true
      console.log('Looping...');
      console.log(member);
      console.log(category);
      if (member.checked) {
        if (category.checked || toggle === 'event') {
          if (toggle === 'category') {
            this.createSurveyQuestions(surveyId, member.uid, category.name, member.name);
            this.createNotification(surveyId, member.uid, 'feedback', member.name, category.name)

          } else {
            this.createFeedbackQuestion(surveyId, member.uid, category, member.name);
            this.createNotification(surveyId, member.uid, 'feedback', member.name, category)

          }
        }
      }
    });
  }

}

