import { ModalOverlay, Settings, Item} from "../types";

export const defaultSettings:Settings = {
  bingoSize: 5,
  bingoTitle: 'Card 1',
  fontFormat: 'bold',
  fontSize: 23,
  fontType: "Bree Serif",
  fontColor: "#000000",
  outlineEnable: true,
  outlineColor: "#ff0000",
  lineColor: "#325FA2",
  backgroundColor:"#ffffff",
  autoRefresh: false,
  refreshNumber: 0,
}

export const overlayEmpty:ModalOverlay = {
  title:'',
  body:'',
  footer:{
    action:()=>{},
    actionTitle:'',
  },
  open: false
}

export const blankItem:Item = {name:"_blank_", imageUrl:""}