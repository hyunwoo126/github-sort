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
};

const isFilesView = () => {
  // example: "/BuildingRobotics/Comfy/pull/2393/files"
  return RegExp('^.+\/pull\/[0-9]+\/files').test(window.location.pathname);
};

const run = () => {
  console.log(`count: ${totalChildElemCount()}`);

  // const lastItem = Array.from(document.querySelectorAll('.float-left .diffbar-item')).slice(-1).pop();
  // lastItem.parentNode.appendChild(`<span>${totalChildElemCount()}</span>`);
};


(() => {
  console.log('good to go!');
  run();

  if (isFilesView()) {
    // extension loads after content load complete.
    // if loaded page is file view,
    // then js-diff-progressive-container is already present.
    // so attach observer to those DOM
    attachObserver();
  }

  document.addEventListener("pjax:end", () => {
    console.log('----- pjax:end -----');
    run();
    if (isFilesView()) {
      attachObserver();
    }
  });

  
})();
