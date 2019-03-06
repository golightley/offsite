import * as dayjs from 'dayjs';

export class DealsItemModel {
  slug: string;
  logo: string;
  name: string;
  code: string;
  description: string;
  // Default mock value
  // expirationDate = '12/01/2018';
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
