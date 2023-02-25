import React, { useState, useRef} from 'react';
import { Navbar, Nav, Uploader } from 'rsuite';
import { Item, jsonDoc, Settings } from '../../types';

interface BingoHeaderProps {
  bingoList: Item[],
  bingoSettings: Settings,
  bingoBoard: Item[][],
  setBingoBoard:(bingoBoard: Item[][]) => void,
  setItemList:(list: Item[]) => void,
  setSettings:(value:Settings) => void,
}

function exportJson(bingoList: Item[], bingoSettings: Settings, bingoBoard: Item[][],){
  let jsonDoc : jsonDoc = {
    settings: bingoSettings,
    itemList: bingoList,
    bingoCardBot: {},
    bingoBoard: bingoBoard,
  };
  for (let i = 0; i < bingoBoard.length; i++){
    for (let j = 0; j < bingoBoard[i].length; j++){
      if(bingoBoard[i][j].overrideName && bingoBoard[i][j].overrideName !== '' && bingoBoard[i][j].overrideName !== undefined) {
        jsonDoc.bingoCardBot[bingoBoard[i][j].overrideName!] = bingoBoard[i][j];
        jsonDoc.bingoCardBot[bingoBoard[i][j].overrideName!].location = [i,j];
      }
      else {
        jsonDoc.bingoCardBot[bingoBoard[i][j].name] = bingoBoard[i][j];
        jsonDoc.bingoCardBot[bingoBoard[i][j].name].location = [i,j];
      }
    }
  }
  const fileName = `${bingoSettings.bingoTitle !== ''? bingoSettings.bingoTitle:'BingoCard'}`
  const json = JSON.stringify(jsonDoc, undefined, 2);
  const blob = new Blob([json], {type: "application/json"});
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}

function exportPNG(bingoSettings: Settings){
  console.log("Clicked");
  const fileName = `${bingoSettings.bingoTitle !== ''? bingoSettings.bingoTitle:'BingoCard'}`;
  var canvasElement = document.getElementById("PNGEXPORT") as HTMLCanvasElement;
  const link = document.createElement("a");
  link.href = canvasElement!.toDataURL();;
  console.log(link.href);
  link.download = fileName + ".png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportCSV(bingoBoard: Item[][], bingoSettings: Settings){
  const fileName = `${bingoSettings.bingoTitle !== ''? bingoSettings.bingoTitle:'BingoCard'}`
  const csv = bingoBoard.map((i) => {
    var row = i.map((item) => item.name);
    return row.join(',');
  }).join('\n');
  const blob = new Blob([csv], {type: "application/csv"});
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName + ".csv";
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}


function BingoHeader({bingoList, bingoSettings, bingoBoard, setBingoBoard, setSettings, setItemList} : BingoHeaderProps) {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const exportClick = (eventKey: string | undefined) => {
    switch (eventKey) {
      case 'JSON':
        exportJson(bingoList, bingoSettings, bingoBoard);
        break;
      case 'PNG':
        exportPNG(bingoSettings);
        break;
      case 'CSV':
        exportCSV(bingoBoard, bingoSettings);
        break;
      default:
        console.log(eventKey)
    }
  }

  const importClick = () => {
    inputFile.current!.click();
  }

  const uploadFile = (event: any) => {
    const reader = new FileReader();
    reader.onload = function(){
      const imported = JSON.parse(this.result as string);
      
      if (imported.settings){
        setSettings(imported.settings);
      }
      if (imported.itemList){
        if (window.chrome && chrome.storage){
          chrome.storage.local.set({
            itemList: imported.itemList,
          });
        }
        setItemList(imported.itemList);
      }
      if(imported.bingoBoard){
        setBingoBoard(imported.bingoBoard);
      }
      
    }
    reader.readAsText(event.target.files[0]);
  }
  return(
    <Navbar>
      <Navbar.Brand href="#">Runescape Bingo Creator</Navbar.Brand>
      <Nav pullRight> 
        <Nav.Menu title="Export">
          <Nav.Item eventKey='JSON' onSelect={exportClick}>JSON</Nav.Item>
          <Nav.Item eventKey='PNG' onSelect={exportClick}>PNG</Nav.Item>
          <Nav.Item eventKey='CSV' onSelect={exportClick}>CSV</Nav.Item>
        </Nav.Menu>
        <Nav.Item onSelect={importClick}>Import</Nav.Item>
      </Nav>
      <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={uploadFile}/>
    </Navbar>
  );
}

export default BingoHeader;