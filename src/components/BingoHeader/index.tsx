import React, { useState } from 'react';
import { Navbar, Nav } from 'rsuite';
import { Item, jsonDoc } from '../../types';

interface BingoHeaderProps {
  bingoList: Item[],
  bingoSize: number,
  bingoBoard: Item[][],
  setBingoBoard:(bingoBoard: Item[][]) => void,
}


function exportJson(bingoList: Item[], bingoSize: number, bingoBoard: Item[][],){
  const title = "Card 1";
  let jsonDoc : jsonDoc = {
    cardsize: bingoSize,
    title: "Card 1",
    itemList: bingoList,
    bingoCard: {}
  };
  for (let i = 0; i < bingoBoard.length; i++){
    for (let j = 0; j < bingoBoard[i].length; j++){
      if(bingoBoard[i][j].overrideName && bingoBoard[i][j].overrideName !== '' && bingoBoard[i][j].overrideName !== undefined) {
        jsonDoc.bingoCard[bingoBoard[i][j].overrideName!] = bingoBoard[i][j];
        jsonDoc.bingoCard[bingoBoard[i][j].overrideName!].location = [i,j];
      }
      else {
        jsonDoc.bingoCard[bingoBoard[i][j].name] = bingoBoard[i][j];
        jsonDoc.bingoCard[bingoBoard[i][j].name].location = [i,j];
      }
    }
  }
  const fileName = `${title}`
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



function BingoHeader({bingoList, bingoSize, bingoBoard, setBingoBoard} : BingoHeaderProps) {
  const exportClick = (eventKey: string | undefined) => {
    switch (eventKey) {
      case 'JSON':
        exportJson(bingoList, bingoSize, bingoBoard);
        break;
      default:
        console.log(eventKey)
    }
  }
  return(
    <Navbar>
      <Navbar.Brand href="#">Runescape Bingo Creator</Navbar.Brand>
      <Nav pullRight> 
        <Nav.Item>Save</Nav.Item>
        <Nav.Menu title="Export">
          <Nav.Item eventKey='JSON' onSelect={exportClick}>JSON</Nav.Item>
          <Nav.Item eventKey='PNG' onSelect={exportClick}>PNG</Nav.Item>
          <Nav.Item eventKey='CSV' onSelect={exportClick}>CSV</Nav.Item>
        </Nav.Menu>
        <Nav.Item>Import</Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default BingoHeader;