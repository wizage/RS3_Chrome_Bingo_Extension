import exp from 'constants';
import React, { useState } from 'react';
import { Panel, Table, InputGroup, InputNumber, IconButton} from 'rsuite';
import ArrowLeftIcon from '@rsuite/icons/ArrowLeft';
import { Item } from '../../types';

interface BingoSidebarProps {
  itemList: Item[],
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
      <img src={rowData?.imageUrl} height="40" width="40" style={{objectFit:"contain"}} />
    </div>
  </Table.Cell>
);

function drawTable(itemList:Item[]){

    return(
    <Table data={itemList} autoHeight wordWrap="break-word">
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


function BingoSidebar({itemList, bingoSize, setBingoSize}:BingoSidebarProps):JSX.Element {
  return(
    <Panel bordered style={{height:"100%", overflow: 'auto'}} header="Settings">
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
      {drawTable(itemList)}
    </Panel>
  );
}

export default BingoSidebar;