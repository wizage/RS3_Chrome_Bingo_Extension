/* global chrome */
import React, { useState } from 'react';
import { CustomProvider, Container, Header, Content, Sidebar } from 'rsuite';
import { Item } from '../../types';
import data from './test.json';
import BingoHeader from '../BingoHeader';
import BingoSidebar from '../BingoSidebar';
import BingoCard from '../BingoCard';
import BingoCanvas from '../BingoCanvas';


function App() {
  // const [itemList, setItemList] = useState<Item[]>([]);
  // chrome.storage.local.get("itemList").then((data)=>{
  //   setItemList(data.itemList);
  // })
  const [itemList, setItemList] = useState<Item[]>(data.itemList);
  const [bingoBoard, setBingoBoard] = useState<Item[][]>([]);
  const [bingoList, setBingoList] = useState<Item[]>([]);
  const addItemCallback = (item: Item) => {
    setBingoList([...bingoList, item]);
  }
  const [bingoSize, setBingoSize] = useState<number>(5);

  return (
    <div className="App">
      <CustomProvider theme='dark'>
        <Container>
          <Header><BingoHeader bingoSize={bingoSize} bingoList={itemList} bingoBoard={bingoBoard} setBingoBoard={setBingoBoard}/></Header>
          <Container>
            <Content><BingoCard bingoSize={bingoSize} bingoList={itemList} bingoBoard={bingoBoard} setBingoBoard={setBingoBoard}/><BingoCanvas bingoSize={bingoSize} bingoBoard={bingoBoard} refresh={false}/></Content>
            <Sidebar><BingoSidebar addItemCallback={addItemCallback} itemList={itemList} bingoSize={bingoSize} setBingoSize={setBingoSize}/></Sidebar>
          </Container>
        </Container>
      </CustomProvider>
    </div>
  );
}

export default App;
