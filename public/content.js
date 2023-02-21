// function drawAddButton(){

// }



// function storeData(){
//     console.log(itemData);
// }
// var elements = document.getElementsByClassName('infobox-item');

// var itemData = tableToJson(elements[0]);

// var row = elements[0].getElementsByTagName('tbody')[0].insertRow(5);
// row.innerHTML = `<th colspan="20">Add to bingo</th><td colspan="40"><span class="button" onCLick=${storeData()}>Yes</span></td>`;



function gatherInfo(){
    var elements = document.getElementsByClassName('infobox-item');
    var itemData = tableToJson(elements[0]);
    var pixelData= document.getElementsByClassName('image')[0].firstChild.src;
    var imageData = document.getElementsByClassName('image')[1].firstChild.src;
    if (!imageData.includes("thumb")){
        imageData = document.getElementsByClassName('image')[2].firstChild.src;
    }
    var finalData = {};
    finalData['name'] = itemData['name'];
    finalData['pixelUrl'] = pixelData;
    finalData['imageUrl'] = imageData;
    return finalData;
}

function tableToJson(table) {
    var data = {};

    // first row needs to be headers
    // var headers = [];
    // for (var i=0; i<table.rows[0].cells.length; i++) {
    //     headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
    // }

    // go through cells
    for (var i=0; i<table.rows.length; i++) {
        

        var tableRow = table.rows[i];
        if (tableRow.cells.length === 1){
            if (i === 1){
                data['name'] = tableRow.cells[0].innerHTML;
            } else if (i === 20){
                data['description'] = tableRow.cells[0].innerHTML;
            }
            
        }
        for (var j=1; j<tableRow.cells.length; j++) {
            
            var HTMLCell = tableRow.cells[j];
            var CellTitle = tableRow.cells[0];
            var innerHTML = "";
            var cellTitle = "";
            if(HTMLCell.childElementCount > 0){
                innerHTML = HTMLCell.children[0].innerHTML;
            } else {
                innerHTML = tableRow.cells[j].innerHTML;
            }
            if(CellTitle.childElementCount > 0){
                cellTitle = CellTitle.children[0].innerHTML;
            } else {
                cellTitle = tableRow.cells[0].innerHTML
            }
            if (cellTitle !== "Exchange"){
                data[ cellTitle ] = innerHTML;
            }
            
        }
    }       

    return data;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "gatherData") {
    var data = gatherInfo();
    sendResponse(data);
  }
});