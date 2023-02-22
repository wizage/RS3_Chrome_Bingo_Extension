/* global chrome */
import React, { useState, useEffect } from 'react';
import { CustomProvider, Container, Header, Content, Sidebar, IconButton } from 'rsuite';
import GearIcon from '@rsuite/icons/Gear';
import styles from './index.module.css';
import { Item, Settings } from '../../types';
import testData from './test.json';
import BingoHeader from '../BingoHeader';
import BingoSidebar from '../BingoSidebar';
import BingoCard from '../BingoCard';
import BingoCanvas from '../BingoCanvas';
import { defaultSettings } from '../defaults';


function App() {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [bingoSettings, setBingoSettings] = useState<Settings>(defaultSettings);
  if (window.chrome && chrome.storage){
    chrome.storage.local.get("itemList").then((data)=>{
      setItemList(data.itemList);
    });
    useEffect(() => {
      chrome.storage.local.get("settings").then((data)=>{
        if (data){
          setBingoSettings(data.settings);
        } else {
          chrome.storage.local.set({
            settings: defaultSettings,
          });
        }
      });
    }, []);
  } else{
    useEffect(() => {
      setItemList(testData.itemList);
    },[])
  }
  
  // const [itemList, setItemList] = useState<Item[]>(data.itemList);
  const [bingoBoard, setBingoBoard] = useState<Item[][]>([]);
  const [bingoSize, setBingoSize] = useState<number>(5);


  const setSettings = (newSettings:Settings) => {
    if (window.chrome && chrome.storage){
      chrome.storage.local.set({
        settings: newSettings,
      });
    }
    setBingoSettings(newSettings);
  }

  return (
    <div className="App">
      <CustomProvider theme='dark'>
        <Container>
          <Header><BingoHeader bingoSize={bingoSize} bingoList={itemList} bingoBoard={bingoBoard} setBingoBoard={setBingoBoard}/></Header>
          <Container>
            <Content><BingoCard bingoSize={bingoSize} bingoList={itemList} bingoBoard={bingoBoard} setBingoBoard={setBingoBoard}/><BingoCanvas bingoSize={bingoSize} bingoBoard={bingoBoard} refresh={false}/></Content>
            <Sidebar  
              style={{ display: 'flex', flexDirection: 'column'}}
              width={300}
            >
              <BingoSidebar 
                itemList={itemList} 
                bingoSize={bingoSize} 
                setBingoSize={setBingoSize}

              />

            </Sidebar>
            
          </Container>
        </Container>
      </CustomProvider>
    </div>
  );
}

export default App;
