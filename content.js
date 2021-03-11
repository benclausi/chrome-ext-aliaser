function getPairs() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("pairs", (result) => {
      resolve(result.pairs);
    });
  });
}

getPairs()
  .then(pairs => {
    if (pairs.length > 0) {
      for (const pair of pairs) {
        const regex = new RegExp(pair.key, 'g');
        document.body.innerHTML = document.body.innerHTML.replace(regex, pair.value);
      }
    }
  })