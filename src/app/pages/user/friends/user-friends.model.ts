import {ui} from 'inquirer';

export class UserFriendsModel {
  friends: Array<{
    image: string,
    name: string,
    job: string,
    followers: string,
    followings: string,
    following: boolean}> = [
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    },
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: true
    },
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    },
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    }
  ];
  followers: Array<{
    image: string,
    name: string,
    job: string,
    followers: string,
    followings: string,
    following: boolean}> = [
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    },
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    },
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    },
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: true
    }
  ];
  following: Array<{
    image: string,
    name: string,
    job: string,
    followers: string,
    followings: string,
    following: boolean}> = [
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    },
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    },
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    },
    {
      image: '',
      name: '',
      job: '',
      followers: '',
      followings: '',
      following: false
    }
  ];

  constructor(readonly isShell: boolean) { }
}

export enum CommentActionType {
  keep = 'keep',
  start = 'start',
  stop = 'stop'
}

export class CommentModel {
  uid: string;
  questionId: string;
  name: string;
  text: string;
  type: string;
  action = CommentActionType.keep;
  score = 0;

  constructor(uid: string, data: any) {
    this.uid = uid;
    this.questionId = data['questionId'];
    this.name = data['name'];
    this.text = data['text'];
    this.type = data['type'];
    if (data['action']) {
      this.action = data['action'];
    }
    if (data['score']) {
      this.score = data['score'];
    }
  }
}
