import React, { useState } from 'react';
import { Panel, InputPicker, Placeholder, Input } from 'rsuite';
import { Item, Settings } from '../../types';
import styles from './index.module.css';

interface BingoCardProps {
  bingoList: Item[],
  bingoSettings: Settings,
  bingoBoard: Item[][],
  setBingoBoard:(bingoBoard: Item[][]) => void,
}

interface DrawCardProps {
  bingoSettings: Settings, 
  bingoBoard:Item[][], 
  setBingoCard:(item: Item, position:number[]) => void,
  setOverrideName:(name:string, position:number[]) => void,
  bingoList: Item[]
}

interface BingoSpaceProps {
  item:Item, 
  location:number[],
  setBingoCard:(item: Item, position:number[]) => void,
  setOverrideName:(name:string, position:number[]) => void,
  bingoList: Item[]
}

const blankItem:Item = {name:"_blank_", imageUrl:""}

function bingoSpace({item, location, setBingoCard, setOverrideName, bingoList }:BingoSpaceProps){
  const dropDownData = bingoList.map((item, index) => ({label: item.name, value: index}))
  let itemView = (<Placeholder.Paragraph />);
  let override = (<div />);
  if (item.name !== '_blank_'){
    itemView = (<img src={item.imageUrl} className={styles.imageStyle}></img>)
    override = (<Input as="textarea" rows={2} placeholder="Override name" onChange={(value) => (setOverrideName(value, location))}/>);
  }
    return(
      <Panel bordered className={styles.bingoSpace}>
        {itemView}
        <InputPicker block data={dropDownData} onChange={(index => setBingoCard(bingoList[index], location))}/>
        {override}
      </Panel>
    )
}

function drawBoard({bingoSettings, bingoBoard, setBingoCard, setOverrideName, bingoList}:DrawCardProps){
  let board = [];
  for(let i = 0; i < bingoSettings.bingoSize; i++){
    let row = [];
    for(let j = 0; j < bingoSettings.bingoSize; j++){
      if (bingoBoard[i] && bingoBoard[i][j]){
        row.push(bingoSpace({item:bingoBoard[i][j], location:[i,j], setBingoCard, setOverrideName, bingoList}))
      } else{
        row.push(bingoSpace({item:blankItem, location:[i,j], setBingoCard, setOverrideName, bingoList}))
      }
    }
    let completeRow = (<div className={styles.bingoRow}>{row}</div>)
    board.push(completeRow);
  }
  return board;
}
function BingoCard({bingoList, bingoSettings, bingoBoard, setBingoBoard}:BingoCardProps) {
  const setBingoCard = (item: Item, position:number[]) => {
    if(!item){
      item = blankItem;
    }
    let copy_array = [...bingoBoard];
    
    if ( position[0] < copy_array.length ){
      if (position[1] < copy_array[position[0]].length){
        copy_array[position[0]][position[1]]=item;
      } else {
        for(let j = copy_array[position[0]].length; j < position[1]; j++){
          copy_array[position[0]][j] = blankItem;
        }
        copy_array[position[0]][position[1]]=item;
      } 
    } else {
      for(let i = copy_array.length; i <= position[0]; i++){
        copy_array[i]=[];
        copy_array[i][0] = blankItem;
      }
      for(let j = copy_array[position[0]].length - 1; j < position[1]; j++){
        copy_array[position[0]][j] = blankItem;
      }
      copy_array[position[0]][position[1]]=item;
    }
    setBingoBoard(copy_array);
  }

  const setOverrideName = (value: string, position:number[]) => {
    let copy_array = [...bingoBoard];
    if (position[0] < copy_array.length && position[1] < copy_array[position[0]].length){
      copy_array[position[0]][position[1]].overrideName = value;
    }
    setBingoBoard(copy_array);
  }
  return(
    <div className={styles.content}>
      <div>
        {drawBoard({bingoSettings, bingoBoard, setBingoCard, setOverrideName, bingoList})}
      </div>
    </div>
  );
}

export default BingoCard;