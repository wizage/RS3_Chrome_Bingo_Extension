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

  useEffect(() => {
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
      /* 
      // DRAW CENTERLINES to verify items are centered
      for (let lines = 0; lines <= size; lines++){
        context!.strokeStyle = '#ff0000'
        context!.beginPath();
        context!.moveTo(5, lines*squareSize+5 +squareSize/2);
        context!.lineTo(width-5, lines*squareSize+5 +squareSize/2)
        context!.stroke()
        context!.beginPath();
        context!.moveTo(lines*squareSize+5+squareSize/2, 5);
        context!.lineTo(lines*squareSize+5+squareSize/2, height-5)
        context!.stroke()
      }
      */
      context!.fillStyle = '#000000';
      context!.strokeStyle = '#ff0000';
      context!.lineWidth = 0.5;
      for (let i = 0; i < bingoBoard.length; i++){
        for (let j = 0; j < bingoBoard[i].length; j++){
          let img = new Image;
          img.src = bingoBoard[i][j].imageUrl;
          img.onload = function(){
            let scaledHeight = 0;
            let scaledWidth = 0;
            if (img.naturalWidth >= img.naturalHeight){
              let ratio = img.naturalHeight/img.naturalWidth;
              scaledHeight = 70*ratio;
              scaledWidth = 70;
            } else {
              let ratio = img.naturalWidth/img.naturalHeight;
              scaledHeight = 70;
              scaledWidth = 70*ratio;
            }
            context!.drawImage(img, 5+((squareSize-scaledWidth)/2)+(j*squareSize), 75+i*squareSize, scaledWidth, scaledHeight);
            if (bingoBoard[i][j].overrideName && bingoBoard[i][j].overrideName !== ""){
              wrapText(context!, bingoBoard[i][j].overrideName!,  82+(j*squareSize), 30+i*squareSize, squareSize, 24);
            } else if (bingoBoard[i][j].name !== "_blank_"){
              wrapText(context!, bingoBoard[i][j].name,  82+(j*squareSize), 30+i*squareSize, squareSize, 24);
            }
          }
        }
      }
    }
  //}, [refresh]);
  });
  return <canvas ref={canvasRef} className={styles.content}></canvas>;
}

export default BingoCanvas