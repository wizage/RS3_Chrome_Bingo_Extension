import React, { useRef, useEffect } from 'react' 
import styles from './index.module.css';
import { Item } from '../../types';

interface BingoCanvasProps {
  bingoSize: number,
  bingoBoard: Item[][],
  refresh: boolean
}

function wrapText(context:CanvasRenderingContext2D, text:string, x:number, y:number, maxWidth:number, lineHeight:number) {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      context.strokeText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
  context.strokeText(line, x, y);
}

function BingoCanvas({bingoSize, bingoBoard, refresh}:BingoCanvasProps){
  
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  let size = bingoSize;
  let squareSize = 150;
  let width = size*squareSize+10;
  let height = width;
  console.log("rerender?")

  useEffect(() => {
    console.log("called");
    // Initialize
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      let context = canvasCtxRef.current;
      context!.fillStyle = "#ffffff";
      context!.font = "bold 28px serif";
      context!.textAlign = "center";
      context!.fillRect(0, 0, width, height);
      context!.moveTo(0, 0);
      context!.strokeStyle = '#325FA2';
      context!.fillStyle = '#eeeeee';
      context!.lineWidth = 2;
      for (let lines = 0; lines <= size; lines++){
        context!.strokeStyle = '#325FA2'
        context!.beginPath();
        context!.moveTo(5, lines*squareSize+5);
        context!.lineTo(width-5, lines*squareSize+5)
        context!.stroke()
        context!.beginPath();
        context!.moveTo(lines*squareSize+5, 5);
        context!.lineTo(lines*squareSize+5, height-5)
        context!.stroke()
      }
      context!.fillStyle = '#000000';
      context!.strokeStyle = '#ff0000';
      context!.lineWidth = 0.5;
      for (let i = 0; i < bingoBoard.length; i++){
        for (let j = 0; j < bingoBoard[i].length; j++){
          let img = new Image;
          img.src = bingoBoard[i][j].imageUrl;

          context!.drawImage(img, 45+(j*squareSize), 70+i*squareSize, 70, 70);
          if (bingoBoard[i][j].overrideName && bingoBoard[i][j].overrideName !== ""){
            wrapText(context!, bingoBoard[i][j].overrideName!,  82+(j*squareSize), 30+i*squareSize, squareSize, 24);
          } else if (bingoBoard[i][j].name !== "_blank_"){
            wrapText(context!, bingoBoard[i][j].name,  82+(j*squareSize), 30+i*squareSize, squareSize, 24);
          }
          
          //context!.fillText(bingoBoard[i][j].name, 10+(j*squareSize), 150+i*squareSize, squareSize-10);
        }
      }
    }
  //}, [refresh]);
  });
  return <canvas ref={canvasRef} className={styles.content}></canvas>;
}

export default BingoCanvas

/*

```
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const {parse} = require('csv-parse');


function drawBingoCardGrid(){

    // Dimensions for the image
    const size = 4;
    if (size < 2){
        return;
    }
    const squareSize = 100;
    const width = size*squareSize+10;
    const height = width;

    // Instantiate the canvas object
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    // Fill the rectangle with purple
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    context.moveTo(0, 0);
    context.strokeStyle = '#325FA2'
    context.fillStyle = '#eeeeee'
    context.lineWidth = 2

    // //Draw lines
    for (let lines = 0; lines <= size; lines++){
        context.strokeStyle = '#325FA2'
        context.beginPath();
        context.moveTo(5, lines*squareSize+5);
        context.lineTo(width-5, lines*squareSize+5)
        context.stroke()
        context.beginPath();
        context.moveTo(lines*squareSize+5, 5);
        context.lineTo(lines*squareSize+5, height-5)
        context.stroke()
    }

    getBingoCardData(context, squareSize, size).then(()=> {
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./image.png", buffer);
    });

    
}

// const card = [[0, 0.5, 0, 1],
//               [1, 0, 1, 0],
//               [0, 1, 0, 1],
//               [0, 1, 0.5, 0]];

// loadImage("./bingocard.png").then((image) => {
//     const { w, h, x, y } = imagePosition;
//     context.drawImage(image, x, y, w, h);
//     context.textAlign = "center";
    
//     context.font = "100pt 'PT Sans'";
//     card.forEach((row, column) => {
//         row.forEach((slot, index) => {
//             if (slot === 1){
//                 context.fillStyle = "#ff0000";
//             } else if (slot === 0.5) {
//                 context.fillStyle = "#ffff00";
//             }
//             if (slot !== 0){
//                 console.log (column, index);
//                 let x = 60 + (column*115);
//                 let y = 105 + (index*115);
//                 context.fillText('X', x, y);
//             }
//         });
//     });
    
    
  
//     const buffer = canvas.toBuffer("image/png");
//     fs.writeFileSync("./image.png", buffer);
// });

//https://r2.weirdgloop.org/rs-render/dii/11286.png



async function getBingoCardData(context, squareSize, size){
    const dataFile = await fs.promises.readFile('./test.csv');
    const parser = parse(dataFile, {columns: false, trim: true});
    let index = 0;
    for await (const record of parser) {
        console.log(record);
        
        const myimg = await loadImage(`https://r2.weirdgloop.org/rs-render/dii/${record[0]}.png`)
        context.drawImage(myimg, 25+(0*squareSize), 15+index*squareSize, 70, 70);
        const myimg1 = await loadImage(`https://r2.weirdgloop.org/rs-render/dii/${record[1]}.png`)
        context.drawImage(myimg1, 25+(1*squareSize), 15+index*squareSize, 70, 70);
        const myimg2 = await loadImage(`https://r2.weirdgloop.org/rs-render/dii/${record[2]}.png`)
        context.drawImage(myimg2, 25+(2*squareSize), 15+index*squareSize, 70, 70);
        const myimg3 = await loadImage(`https://r2.weirdgloop.org/rs-render/dii/${record[3]}.png`)
        context.drawImage(myimg3, 25+(3*squareSize), 15+index*squareSize, 70, 70);

        index++;
    }
}

// drawBingoBoard(()=>{
//     console.log("done");
// });

drawBingoCardGrid();

```*/