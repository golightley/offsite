import {ui} from 'inquirer';

export enum CommentActionType {
  keep = 'keep',
  start = 'start',
  stop = 'stop'
}

export class IdeaModel {
  uid: string;
  text: string;
  type: CommentActionType.keep;
  score = 0;
  messageCount:string;
  constructor(uid: string, data: any) {
    this.uid = uid;
    this.text = data['text'];
    this.type = data['type'];
    if (data['score']) {
      this.score = data['score'];
    }
  }
}
