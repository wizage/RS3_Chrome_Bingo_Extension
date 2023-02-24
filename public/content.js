function filterThumbs(element){
   return element.firstChild.src.includes("thumb") || element.firstChild.src.includes("detail");
}

function gatherInfo(){
    var elements = document.getElementsByClassName('infobox-item');
    var pixelData= document.getElementsByClassName('image')[0].firstChild.src;
    var imageData = Array.from(document.getElementsByClassName('image')).find(filterThumbs);
    var finalData = {};
    finalData['name'] = elements[0].getElementsByClassName('infobox-header')[0].innerHTML;
    finalData['pixelUrl'] = pixelData;
    finalData['imageUrl'] = imageData.firstChild.src;
    return finalData;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "gatherData") {
    var data = gatherInfo();
    console.log(data);
    sendResponse(data);
  }
});