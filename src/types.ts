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
  settings: Settings;
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
  backgroundColor:string;
  autoRefresh:boolean;
  refreshNumber:number;
}

export interface ModalOverlay{
  title:string;
  body:string;
  footer:{
    action: ()=>void;
    actionTitle: string;
  }
  open:boolean;
}