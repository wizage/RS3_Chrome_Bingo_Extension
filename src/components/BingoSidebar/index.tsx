import React, { useState } from 'react';
import { Panel, Table, InputGroup, InputNumber} from 'rsuite';
import { Item } from '../../types';

interface BingoSidebarProps {
  itemList: Item[],
  addItemCallback: (item:Item) => void,
  bingoSize: number,
  setBingoSize: (value:number) => void,
}

interface ImageCellProps {
  rowData?: Item,
  dataKey: string,
}

const styleCenter = {
  display: 'flex',
  //justifyContent: 'center',
  alignItems: 'center',
  height: '20px'
};

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
      <img src={rowData?.imageUrl} height="40" width="40" />
    </div>
  </Table.Cell>
);

function BingoSidebar({itemList, addItemCallback, bingoSize, setBingoSize}:BingoSidebarProps):JSX.Element {
  return(
    <Panel bordered style={{height:'85vh', overflow: 'auto'}}>
      <InputGroup>
        <InputNumber onChange={value => { 
            if(typeof value === 'string') setBingoSize(parseInt(value))
            else setBingoSize(value)}
          }
        value={bingoSize}
        />
        <InputGroup.Addon>x</InputGroup.Addon>
        <InputNumber onChange={value => { 
          console.log(value, typeof value)
            if(typeof value === 'string') setBingoSize(4)
            else setBingoSize(value)}
          }
        value={bingoSize}
        />
      </InputGroup>
      <Table data={itemList} autoHeight wordWrap="break-word" onRowClick={rowData => {
        addItemCallback(rowData as Item)
      }}>
        <Table.Column width={80} align="center">
          <Table.HeaderCell>Image</Table.HeaderCell>
          <ImageCell dataKey="imageUrl" />
        </Table.Column>
        <Table.Column width={138} align="center" verticalAlign='middle'>
          <Table.HeaderCell>Item Name</Table.HeaderCell>
          <Table.Cell dataKey="name" />
        </Table.Column>
      </Table>
    </Panel>
  );
}

export default BingoSidebar;