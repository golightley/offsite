import * as dayjs from 'dayjs';

export class DealsItemModel {
  slug: string;
  logo: string;
  name: string;
  code: string;
  description: string;
  expirationDate: string = dayjs().add(5, 'day').format('MM/DD/YYYY HH:mm:ss') as string;
}

export class DealsListingModel {
  items: Array<DealsItemModel> = [
    new DealsItemModel(),
    new DealsItemModel(),
    new DealsItemModel(),
    new DealsItemModel()
  ];

  constructor(readonly isShell: boolean) { }
}

export enum QuestionType {
  input = 'input',
  multiple = 'multiple'
}

export class QuestionModel {
  id: string;
  question: string;
  commentsCount = 0;
  avgScore = 0;
  category: string;
  updatedAt: Date;
  type = QuestionType.input;
  goal: string;

  constructor(id: string, data: any) {
    this.id = id;
    this.goal = data['goal'];
    this.question = data['Question'];
    this.category = data['category'];

    if (data['commentsCount']) {
      this.commentsCount = data['commentsCount'];
    }
    if (data['averagescore']) {
      this.avgScore = data['averagescore'];
    }
    if (data['lastUpdate']) {
      this.updatedAt = data['lastUpdate'].toDate();
    } else {
      this.updatedAt = new Date();
    }
    if (data['type']) {
      this.type = data['type'];
    }
  }
}
