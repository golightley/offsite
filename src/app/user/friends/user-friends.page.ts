import {Component, HostBinding} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SurveyServiceService} from '../../services/survey-service.service';
import {CommentActionType, CommentModel, UserFriendsModel} from './user-friends.model';
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

  comments: CommentModel[] = [];
  message = 'Our team should keep doing...';
  messageType = 'keep';

  @HostBinding('class.is-shell') get isShell() {
    return this.data && this.data.isShell;
  }

  constructor(
    private route: ActivatedRoute,
    public surveyService: SurveyServiceService,
    private http: HttpClient
    ) {
    this.updateComment();
  }

  updateComment() {
    if (this.surveyService.myParam && this.surveyService.myParam.id) {
      const query = firebase.firestore().collection('comments')
        .where('questionId', '==', this.surveyService.myParam.id)
        .where('type', '==', 'comment');
      query.onSnapshot((snapshot) => {
        console.log(snapshot);
        // retrieve anything that has changed
        const changedDocs = snapshot.docChanges();
        changedDocs.forEach((change) => {
          if (change.type === 'added') {
            this.comments.push(new CommentModel(change.doc.id, change.doc.data()));
          } else if (change.type === 'modified') {
            let index = 0;
            for (let i = 0; i < this.comments.length; i++) {
              if (this.comments[i].uid === change.doc.id) {
                index = i;
                break;
              }
            }
            this.comments[index] = new CommentModel(change.doc.id, change.doc.data());
          }
        });
      });
    } else {
      this.comments = [
        new CommentModel('1', {
          name: 'Anonymous',
          text: 'Text1',
          score: 3,
          action: 'keep',
          type: 'comment'
        }),
        new CommentModel('2', {
          name: 'Anonymous',
          text: 'Text1',
          score: 0,
          action: 'start',
          type: 'comment'
        }),
        new CommentModel('2', {
          name: 'Anonymous',
          text: 'This is long long long text test. It really looks good',
          score: 3,
          action: 'stop',
          type: 'comment'
        })
      ];
    }
  }

  createComment() {
    // create the comment
    this.surveyService.createComment(this.surveyService.myParam.id, this.message, 'comment', this.messageType);
    // reset the message
    this.message = '';
  }

  // this should be moved to the service
  increaseScore(comment: CommentModel) {
    console.log('Update score function fired...');
    const body  = {
      questId: comment.uid,
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
  decreaseScore(comment: CommentModel) {
    console.log('Update score function fired...');
    const body  = {
      questId: comment.uid,
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

  getCommentActionColor(action: CommentActionType) {
    switch (action) {
      case CommentActionType.keep:
        return '#ffae66';
      case CommentActionType.start:
        return '#6af951';
      case CommentActionType.stop:
        return '#ff6666';
    }
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

