chrome.action.onClicked.addListener(function() {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

chrome.runtime.onInstalled.addListener(function() { 
    chrome.contextMenus.create({
      id: 'new-entry',
      title: 'Create new entry for bingo',
      documentUrlPatterns:["*://*.runescape.wiki/w/*"]
    });
});

chrome.runtime.onStartup.addListener(function() {
  chrome.storage.local.set({
    itemList: [],
  });
});

chrome.contextMenus.onClicked.addListener(function(item, tab){
  if (item.menuItemId === "new-entry"){
    chrome.tabs.sendMessage(tab.id, {
      type: "gatherData",
    }, function (response){
      pushItem(response);
    })
  }
})

function pushItem(item){
  chrome.storage.local.get("itemList").then(function(value){
    console.log(value.itemList)
    value.itemList.push(item);
    chrome.storage.local.set({
      itemList: value.itemList,
    });
  })
}