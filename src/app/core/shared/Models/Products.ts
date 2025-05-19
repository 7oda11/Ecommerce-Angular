export interface IProduct {
  name: string;
  description: string;
  newPrice: number;
  oldPrice: number;
  categoryName: string;
  photos: IPhoto[];
}

export interface IPhoto {
  imageName: string;
  productId: number;
}
