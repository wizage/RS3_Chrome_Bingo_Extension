/* global chrome */
import React, { useState, useEffect } from 'react';
import { CustomProvider, Container, Header, Content, Sidebar, Modal, Button } from 'rsuite';
import styles from './index.module.css';
import { Item, ModalOverlay, Settings } from '../../types';
import testData from './test.json';
import BingoHeader from '../BingoHeader';
import BingoSidebar from '../BingoSidebar';
import BingoCard from '../BingoCard';
import BingoCanvas from '../BingoCanvas';
import { blankItem, defaultSettings, overlayEmpty } from '../defaults';


function App() {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [bingoSettings, setBingoSettings] = useState<Settings>(defaultSettings);
  const [bingoBoard, setBingoBoard] = useState<Item[][]>([]);
  const [modalOverlay, setModalOverlay] = useState<ModalOverlay>(overlayEmpty);;
  if (window.chrome && chrome.storage){
    useEffect(() => {
      chrome.storage.local.get("settings").then((data)=>{
        if (data && data.settings){
          setBingoSettings(data.settings);
        } else {
          chrome.storage.local.set({
            settings: defaultSettings,
          });
        }
      });
      chrome.storage.local.get("itemList").then((data)=>{
        if (data.itemList){
          setItemList(data.itemList);
        } else {
          setItemList([]);
        }
      });
      chrome.storage.local.get("bingoBoard").then((data)=>{
        if (data && data.bingoBoard){
          setBingoBoard(data.bingoBoard);
        }
      });
    }, []);
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.itemList) {
        setItemList(changes.itemList.newValue);
      }
    })
  } else{
    useEffect(() => {
      setItemList(testData.itemList);
    },[])
  }

  const clearBingoBoard = () => {
    const newModal:ModalOverlay = {
      title:'Are you sure?',
      body:'You will lose your entire bingo board.',
      footer:{
        action:(()=>updateBingoBoard([])),
        actionTitle:'Reset Bingo Board',
      },
      open: true
    }
    setModalOverlay(newModal);
  }

  const clearBingoSettings = () => {
    const newModal:ModalOverlay = {
      title:'Are you sure?',
      body:'You will be reset to the default settings.',
      footer:{
        action:(()=>setSettings(defaultSettings)),
        actionTitle:'Reset Settings',
      },
      open: true
    }
    setModalOverlay(newModal);
  }

  const updateBingoBoard = (board: Item[][]) => {
    if (window.chrome && chrome.storage){
      chrome.storage.local.set({
        bingoBoard: board,
      });
    }
    setBingoBoard(board);
    if(bingoSettings.autoRefresh){
      refreshImage();
    }
  }

  const removeItemList = (newItemList:Item[], itemRemoved?: Item) => {
    const deleteItem = () => {
      if (window.chrome && chrome.storage){
        chrome.storage.local.set({
          itemList: newItemList,
        });
      }
      if(newItemList.length === 0){
        setBingoBoard([]);
      } else {
        const newBingoBoard = [...bingoBoard];
        for(let i = 0; i < newBingoBoard.length; i++){
          for (let j = 0; j < newBingoBoard[i].length; j++){
            if (newBingoBoard[i][j].name === itemRemoved?.name){
              newBingoBoard[i][j] = blankItem;
            }
          }
        }
      }
      setItemList([...newItemList]);
    }
    if (itemRemoved){
      const newModal:ModalOverlay = {
        title:'Are you sure?',
        body:'You will delete this item from your list. You will have to find it again on the wiki.\n\nThis will also change your bingo card so be careful.',
        footer:{
          action:deleteItem,
          actionTitle:'Delete Item',
        },
        open: true
      }
      setModalOverlay(newModal);
    } else {
      const newModal:ModalOverlay = {
        title:'Are you sure?',
        body:'You will delete all your items from your list. You will have to find them again on the wiki.\n\nThis will also clear your bingo card so be careful.',
        footer:{
          action:deleteItem,
          actionTitle:'Delete Items',
        },
        open: true
      }
      setModalOverlay(newModal);
    } 
    
  }

  const refreshImage = () => {
    const randomNumber = Math.random()*10000;
    setBingoSettings({
      ...bingoSettings,
      refreshNumber: randomNumber
    });
  }

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
          <Header><BingoHeader bingoSettings={bingoSettings} bingoList={itemList} bingoBoard={bingoBoard} setBingoBoard={setBingoBoard}/></Header>
          <Container>
            <Content>
              <Modal size={'xs'} open={modalOverlay.open} onClose={() => setModalOverlay({...modalOverlay, open:false})}>
                <Modal.Header>
                  <Modal.Title>{modalOverlay.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalOverlay.body}</Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => setModalOverlay({...modalOverlay, open:false})} appearance="subtle">
                    Cancel
                  </Button>
                  <Button onClick={() => {modalOverlay.footer.action(); setModalOverlay({...modalOverlay, open:false}); refreshImage();}} color='red' appearance="primary">
                    {modalOverlay.footer.actionTitle}
                  </Button>
                </Modal.Footer>
              </Modal>
              <BingoCard bingoSettings={bingoSettings} bingoList={itemList} bingoBoard={bingoBoard} setBingoBoard={updateBingoBoard}/>
              {bingoSettings.autoRefresh ? null: <Button onClick={refreshImage} className={styles.button}>Update Image</Button>}
              <BingoCanvas bingoSettings={bingoSettings} bingoBoard={bingoBoard} refresh={false}/>
            </Content>
            <Sidebar  
              style={{ display: 'flex', flexDirection: 'column'}}
              width={300}
            >
              <BingoSidebar 
                itemList={itemList} 
                bingoSettings={bingoSettings} 
                setBingoSettings={setSettings}
                removeItemList={removeItemList}
                clearBingoSettings={clearBingoSettings}
                clearBingoBoard={clearBingoBoard}
              />
            </Sidebar>
          </Container>
        </Container>
      </CustomProvider>
    </div>
  );
}

export default App;
