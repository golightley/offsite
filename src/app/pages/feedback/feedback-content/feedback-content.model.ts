export class FeedbackCategoryModel {
  name: string;
  checked = false;

  constructor(name: string) {
    this.name = name;
  }
}

export class TeammatesModel {
  uid: string;
  name: string;
  checked = false;
  email: string;
  constructor(uid: string, data: any) {
    this.uid = uid;
    this.name = data['name'];
    this.email = data['email'];
  }
}
