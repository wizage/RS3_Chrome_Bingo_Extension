export interface Item {
  name: string;
  imageUrl: string;
  pixelUrl?: string;
  overrideName?:string;
  location?:number[];
}

export interface bingoStore {
  [key: string]: Item;
}
export interface jsonDoc {
  cardsize: number;
  title: string;
  itemList: Item[];
  bingoCard: bingoStore;
}

export interface Settings {
  bingoSize: number;
  bingoTitle: string;
  fontFormat: string;
  fontSize: number;
  fontType: string;
  fontColor: string;
  outlineEnable: boolean;
  outlineColor: string;
  lineColor: string;
}