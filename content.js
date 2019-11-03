function getElementsToSort() {
  return Array.from(
    document.querySelectorAll('.js-diff-progressive-container .file.js-details-container'),
  );
}

function reorderDom(domList) {
  console.log('reorderDom', domList.length);
  const containers = document.getElementsByClassName('js-diff-progressive-container');
  const lastContainer = containers[containers.length - 1];
  domList.forEach((dom) => {
    lastContainer.appendChild(dom);
  });
}


function deprioritize() {
  getFromStorage('deprioritize').then((depriorityList) => {
    const regex = RegExp(depriorityList[0]);
    const sorted = getElementsToSort().sort((a, b) => {
      const aTitle = a.querySelector('.file-header .file-info a').getAttribute('title');
      const bTitle = b.querySelector('.file-header .file-info a').getAttribute('title');
      const aMatch = regex.test(aTitle);
      const bMatch = regex.test(bTitle);

      if (aMatch && !bMatch) return 1;
      else if (!aMatch && bMatch) return -1;
      else return 0;
    });
    reorderDom(sorted);
  });
}



const totalChildElemCount = () => {
  const elemsToObserve = document.getElementsByClassName('js-diff-progressive-container');
  return Array.from(elemsToObserve).reduce((total, elem) => {
    const elemFiles = Array.from(elem.getElementsByClassName('file'));
    elemFiles.forEach((elem) => {
      console.log(elem.querySelector('.file-header .file-info a').getAttribute('title'));
    });

    return total + elem.getElementsByClassName('file').length;
  }, 0);
};

const attachObserver = () => {
  const elemsToObserve = document.getElementsByClassName('js-diff-progressive-container');
  Array.from(elemsToObserve).forEach((toObserve) => {
    const observer = new MutationObserver(function() {
      console.log('callback that runs when observer is triggered');
      run();
    });
    observer.observe(toObserve, { childList: true });
  });

  console.log(`js-diff-progressive-container count: ${Array.from(elemsToObserve).length}`);
};

const isFilesView = () => {
  // example: "/BuildingRobotics/Comfy/pull/2393/files"
  return RegExp('^.+\/pull\/[0-9]+\/files').test(window.location.pathname);
};

const run = () => {
  if (isFilesView()) {
    deprioritize();
  }
  // console.log(`count: ${totalChildElemCount()}`);

  // const lastItem = Array.from(document.querySelectorAll('.float-left .diffbar-item')).slice(-1).pop();
  // lastItem.parentNode.appendChild(`<span>${totalChildElemCount()}</span>`);
};

function initialize() {
  run();

  if (isFilesView()) {
    // extension loads after content load complete.
    // if loaded page is file view,
    // then js-diff-progressive-container is already present.
    // so attach observer to those DOM
    attachObserver();
  }

  document.addEventListener("pjax:end", () => {
    run();
    if (isFilesView()) {
      attachObserver();
    }
  });
}


(() => {
  console.log('good to go!');

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.action == "sort") {
        run();
        sendResponse(true);
      }
    });



  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
      console.log(storageChange.newValue);
    }
  });
 
})();
