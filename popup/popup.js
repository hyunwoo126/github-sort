console.log('popup index.js');


let deprioritize = getFromStorage('deprioritize');

const elemInput = document.getElementById('first');

elemInput.onchange = (event) => {
  console.log('onchange');
  saveToStorage({
    deprioritize: [event.target.value],
  }).then(() => {
    console.log('saveToStorage success');
  });
}


function sort() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "sort" }, function(response) {
      console.log(response);
    });
  });
}

document.getElementById('button-sort').addEventListener('click', sort);

getFromStorage('deprioritize').then((values) => {
  document.getElementById('first').value = values[0];
})

console.log('end');