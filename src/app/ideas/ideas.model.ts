import {ui} from 'inquirer';

export class IdeaModel {
  uid: string;
  text: string;
  type: string;
  score = 0;

  constructor(uid: string, data: any) {
    this.uid = uid;
    this.text = data['text'];
    this.type = data['type'];
    // if (data['score']) {
    //   this.score = data['score'];
    // }
  }
}
