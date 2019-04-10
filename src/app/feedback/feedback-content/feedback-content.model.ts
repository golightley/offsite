export class FeedbackCategoryModel {
  name: string;
  checked = false;

  constructor(name: string) {
    this.name = name;
  }
}

export class TeammatesModel {
  name: string;
  checked = false;

  constructor(data: any) {
    this.name = data['teamName'];
  }
}
