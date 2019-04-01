import {Component, HostBinding} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SurveyServiceService} from '../../services/survey-service.service';
import {UserFriendsModel} from './user-friends.model';
import * as firebase from 'firebase/app';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.page.html',
  styleUrls: [
    './styles/user-friends.page.scss',
    './styles/user-friends.shell.scss',
    './styles/user-friends.md.scss'
  ]
})
export class UserFriendsPage {
  data: UserFriendsModel;

  comments: Array<any>;
  message = '';
  messageType: string | null = null;

  @HostBinding('class.is-shell') get isShell() {
    return this.data && this.data.isShell;
  }

  constructor(
    private route: ActivatedRoute,
    public surveyService: SurveyServiceService,
    private http: HttpClient
    ) { }

  getComment() {
    // get
    this.surveyService.getComments(this.surveyService.myParam.id).then((commentData) => {
      this.comments = commentData;
      console.log(this.comments);
    });
  }

  ionViewWillEnter() {
    // get the comments
    this.getComment();
    this.updateComment();
  }

  updateComment() {
    const query = firebase.firestore().collection('comments').where('questionId', '==', this.surveyService.myParam.id);

    query.onSnapshot((snapshot) => {
      console.log(snapshot);
      // retrieve anything that has changed
      const changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {
        if (change.type === 'added') {
          this.comments.push(change.doc);
        } else if (change.type === 'modified') {
          let index = 0;
          for (let i = 0; i < this.comments.length; i++) {
            if (this.comments[i].id === change.doc.id) {
              index = i;
            }
          }
          // get the index of the object
          console.log('Modified called...');
          console.log(change.doc);
          console.log(this.comments);
          console.log('index' + index);
          this.comments[index].data().score = change.doc.data().score;
        }
      });
    });
  }

  createComment() {
    // create the comment
    this.surveyService.createComment(this.surveyService.myParam.id, this.message,'comment');
    // reset the message
    this.message = '';
    this.messageType = null;
  }

  // this should be moved to the service
  increaseScore(result) {
    console.log('Update score function fired...');
    const body  = {
      questId: result.id,
      userId: firebase.auth().currentUser.uid,
      action: 'upvote'
    };
    this.http.post('https://us-central1-offsite-9f67c.cloudfunctions.net/updateScore', JSON.stringify(body), {
      responseType: 'text'
    }).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  // this should be moved to the service
  decreaseScore(result) {
    console.log('Update score function fired...');
    const body  = {
      questId: result.id,
      userId: firebase.auth().currentUser.uid,
      action: 'downvote'
    };
    this.http.post('https://us-central1-offsite-9f67c.cloudfunctions.net/updateScore', JSON.stringify(body), {
      responseType: 'text'
    }).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  segmentChanged() {
    switch (this.messageType) {
      case 'keep':
        this.message = 'Our team should keep doing...';
        break;
      case 'stop':
        this.message = 'Our team should stop doing...';
        break;
      case 'start':
        this.message = 'Our team should start doing...';
        break;
    }
  }

}

