export class RealStateItemModel {
  slug: string;
  picture: string;
  address: string;
  price: string;
  liked: boolean;
  accommodations: {
    guests: number,
    bedrooms: number,
    beds: number,
    bathrooms: number
  };
  amenities: Array<{name: string, icon: string}> = [
    {
      name: '',
      icon: ''
    },
    {
      name: '',
      icon: ''
    }
  ];
}

export class RealStateListingModel {
  items: Array<RealStateItemModel> = [
    new RealStateItemModel(),
    new RealStateItemModel(),
    new RealStateItemModel(),
    new RealStateItemModel()
  ];

  constructor(readonly isShell: boolean) { }
}
