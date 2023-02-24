import exp from 'constants';
import { AnyARecord } from 'dns';
import React, { useEffect, useState, useRef } from 'react';
import { Panel, Table, InputGroup, InputNumber, Form, Toggle, InputPicker, Schema, ButtonToolbar, Button} from 'rsuite';
import { Item, Settings } from '../../types';
import FontPicker from '../Font-Picker';
const { StringType, NumberType, BooleanType } = Schema.Types;

interface BingoSidebarProps {
  itemList: Item[],
  bingoSettings: Settings,
  setBingoSettings: (value:Settings) => void,
  removeItemList: (value:Item[], itemRemoved?:Item) => void,
  clearBingoSettings:()=>void,
  clearBingoBoard:()=>void,
}

interface ImageCellProps {
  rowData?: Item,
  dataKey: string,
}

const formModel = Schema.Model({
  bingoSize: NumberType('Please enter a valid number').range(
    2,
    10,
    'Please enter a number between 2 and 10'
  ),
  bingoTitle: StringType(),
  fontSize: NumberType(),
  fontType: StringType(),
  fontColor: StringType().addRule((value) =>{
    var reg=/^#([0-9a-f]{3}){1,2}$/i;
    return reg.test(value);
  }, 'Please enter a valid color hex'),
  outlineEnable: BooleanType(),
  outlineColor: StringType().addRule((value) =>{
    var reg=/^#([0-9a-f]{3}){1,2}$/i;
    return reg.test(value);
  }, 'Please enter a valid color hex'),
  lineColor: StringType().addRule((value) =>{
    var reg=/^#([0-9a-f]{3}){1,2}$/i;
    return reg.test(value);
  }, 'Please enter a valid color hex'),
  backgroundColor:StringType().addRule((value) =>{
    var reg=/^#([0-9a-f]{3}){1,2}$/i;
    return reg.test(value);
  }, 'Please enter a valid color hex')
});

const ImageCell = ({ rowData, dataKey, ...props }:ImageCellProps) => (
  <Table.Cell {...props} style={{ padding: 0 }}>
    <div
      style={{
        width: 40,
        height: 40,
        background: '#f5f5f5',
        borderRadius: 6,
        marginTop: '25%',
        overflow: 'hidden',
        display: 'inline-block'
      }}
    >
      <img src={rowData?.imageUrl} height="40" width="40" style={{objectFit:"contain"}} />
    </div>
  </Table.Cell>
);

function drawTable(itemList:Item[], updateItemList: (value:Item[], itemRemoved: Item) => void){
  const removeItem = (rowData:any) => {
    let newItemList = [...itemList];
    let removeIndex = newItemList.findIndex((item) => rowData.name === item.name);
    const itemRemoved = newItemList.splice(removeIndex, 1);
    updateItemList(newItemList, itemRemoved[0]);
  }
  return(
  <Table data={itemList} height={295} wordWrap="break-word" onRowClick={removeItem}>
    <Table.Column width={80} align="center">
      <Table.HeaderCell>Image</Table.HeaderCell>
      <ImageCell dataKey="imageUrl" />
    </Table.Column>
    <Table.Column width={181} align="center" verticalAlign='middle'>
      <Table.HeaderCell>Item Name</Table.HeaderCell>
      <Table.Cell dataKey="name" />
    </Table.Column>
  </Table>)
}


function BingoSidebar({itemList, bingoSettings, setBingoSettings, removeItemList, clearBingoSettings, clearBingoBoard}:BingoSidebarProps):JSX.Element {
  const hiddenDebugFont = true;
  const firstUpdate = useRef(true);
  const [formUpdates, setFormUpdates] = useState<Settings>(bingoSettings);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const timeOutId = setTimeout(() => {setBingoSettings(formUpdates)}, 500);
    return () => clearTimeout(timeOutId);
  }, [formUpdates]);
  useEffect(() => {
    setFormUpdates(bingoSettings);
  }, [bingoSettings]);
  const updateFontFamily = (value:string) => {
    setFormUpdates({
      ...formUpdates,
      fontType: value,
    });
  }
  const formMap = (value:Record<string,any>) => {
    setFormUpdates({
      ...value as Settings,
      fontSize: parseInt(value.fontSize),
      bingoSize: parseInt(value.bingoSize),
      refreshNumber: value.autoRefresh ? Math.random()*10000 : value.refreshNumber,
    })
  }

  return(
    <Panel bordered style={{height:"1250px", overflow: 'auto'}} header="Settings">
      <Form 
        fluid
        formValue={formUpdates}
        model={formModel}
        onChange={formMap}
      >
        <Form.Group controlId={'name-input'}>
          <Form.ControlLabel>Bingo Card Name</Form.ControlLabel>
          <Form.Control name="bingoTitle" />
        </Form.Group>
        <Form.Group controlId={'size-input'}>
          <Form.ControlLabel>Bingo Card Size</Form.ControlLabel>
          <InputGroup>
            <Form.Control 
              name='bingoSize'
              accepter={InputNumber}
            />
            <InputGroup.Addon>x</InputGroup.Addon>
            {/* <InputNumber onChange={value => { 
              console.log(value, typeof value)
                if(typeof value === 'string') setBingoSize(4)
                else setBingoSize(value)}
              }
            value={bingoSize}
            /> */}
            <Form.Control 
              name='bingoSize'
              accepter={InputNumber}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId={'font-family-input'}>
          <Form.ControlLabel>Font Family</Form.ControlLabel>
          <FontPicker apiKey='AIzaSyD8Q42WjTFB6ECYa7Xjm-DK4eZtW0z8APA' activeFontFamily={formUpdates.fontType} updateFontFamily={updateFontFamily}/>
        </Form.Group>
        <Form.Group controlId={'font-size-input'}>
          <Form.ControlLabel>Font Size</Form.ControlLabel>
          <Form.Control 
            name='fontSize'
            postfix="px"
            accepter={InputNumber}
          />
        </Form.Group>
        <Form.Group controlId={'font-style-input'}>
          <Form.ControlLabel>Font Style</Form.ControlLabel>
          <Form.Control 
            name='fontFormat'
            block
            data={[{value:'bold', label:'Bold'}, {value:'italic', label: 'Italic'}, {value:'italic bold', label:'Italic Bold'}]}
            accepter={InputPicker}
          />
        </Form.Group>
        <Form.Group controlId={'font-color-input'}>
          <Form.ControlLabel>Font Color (Hex)</Form.ControlLabel>
          <Form.Control name="fontColor" />
        </Form.Group>
        <Form.Group controlId={'outline-enable-input'}>
          <Form.ControlLabel>Outline Color Enabled</Form.ControlLabel>
          <Form.Control name="outlineEnable" accepter={Toggle}/>
        </Form.Group>
        <Form.Group controlId={'outline-color-input'}>
          <Form.ControlLabel>Outline Color (Hex)</Form.ControlLabel>
          <Form.Control name="outlineColor" />
        </Form.Group>
        <Form.Group controlId={'background-color-input'}>
          <Form.ControlLabel>Background Color (Hex)</Form.ControlLabel>
          <Form.Control name="backgroundColor" />
        </Form.Group>
        <Form.Group controlId={'line-color-input'}>
          <Form.ControlLabel>Line Color (Hex)</Form.ControlLabel>
          <Form.Control name="lineColor" />
        </Form.Group>
        
        <Form.Group controlId={'auto-refresh-input'}>
          <Form.ControlLabel>Enable Auto Refresh</Form.ControlLabel>
          <Form.Control name="autoRefresh" accepter={Toggle}/>
          <Form.HelpText>This can slow down or heavily impact performance on slower computers.</Form.HelpText>
        </Form.Group>
        <Form.Group controlId={'table-input-label'}>
          <Form.ControlLabel>Remove item from list</Form.ControlLabel>
          {drawTable(itemList, removeItemList)}
        </Form.Group>
        <Form.Group controlId={'destroy-label'}>
          <Button block appearance="primary" color="red" onClick={()=>removeItemList([])}>Clear Item List</Button>
          <Button block appearance="primary" color="red" onClick={()=>clearBingoBoard()}>Clear Bingo Board</Button>
          <Button block appearance="primary" color="red" onClick={()=>clearBingoSettings()}>Reset Settings</Button>
        </Form.Group>
      </Form>
      <div className='apply-font' style={{visibility:hiddenDebugFont?'hidden':'visible'}}>Testing font</div>
    </Panel>
  );
}

export default BingoSidebar;