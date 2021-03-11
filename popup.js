let addLabelButton = document.getElementById("addLabel");
let newPairDiv = document.getElementById("new_pair");
let savedPairsDiv = document.getElementById("saved_pairs");

async function getPairs() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("pairs", (result) => {
      resolve(result.pairs);
    });
  });
}

async function deletePair(pair) {
  let pairs = await getPairs();
  chrome.storage.sync.set({ pairs: pairs.filter((xpair) => 
    xpair.key !== pair.key || xpair.value !== pair.value
  )}, () => renderPairs());
}

async function renderPairs() {
  // clear existing
  savedPairsDiv.innerHTML = "";

  const pairs = await getPairs();
  if (pairs.length > 0) {
    for (pair of pairs) {
      let pairRow = document.createElement("div");
      pairRow.setAttribute('class', 'pairRow');
      pairRow.innerHTML = pair.key + " -> " + pair.value;

      let delButton = document.createElement("button");
      delButton.setAttribute("class", "deleteButton");
      delButton.innerHTML = "X";
      delButton.addEventListener("click", () => deletePair(pair));
      pairRow.appendChild(delButton);

      savedPairsDiv.appendChild(pairRow);
    }
  } else {
    let noPairsMsg = document.createElement('span');
    noPairsMsg.setAttribute('class', 'noPairsMessage');
    noPairsMsg.innerHTML = 'No saved pairs o.O, why dont you add one?';
    savedPairsDiv.appendChild(noPairsMsg);
  }
}

async function savePair(pair) {
  return new Promise(async (resolve) => {
    const pairs = await getPairs();
    chrome.storage.sync.set({ pairs: [...pairs, { ...pair }] }, () => {
      renderPairs();
      resolve(true);
    });
  });
}

// page loaded
document.addEventListener("DOMContentLoaded", async (event) => {
  await renderPairs();
});

addLabelButton.addEventListener("click", async () => {
  if (newPairDiv.innerHTML !== '') {
    return;
  }

  let keyField = document.createElement("input");
  keyField.setAttribute("type", "text");
  keyField.setAttribute("name", "key");
  keyField.setAttribute("placeholder", "Label");
  keyField.setAttribute(
    "style",
    "width:40%;margin-right: 10px;",
  );

  let valueField = document.createElement("input");
  valueField.setAttribute("type", "text");
  valueField.setAttribute("name", "value");
  valueField.setAttribute("placeholder", "Value");
  valueField.setAttribute("style", "width:40%;");

  let toggles = document.createElement("div");
  toggles.setAttribute(
    "style",
    "width:20%;text-align:right;font-size:18px;font-weight:bold;display:flex;align-items:top;",
  );
  let saveButton = document.createElement("button");
  saveButton.innerHTML = "Save";
  saveButton.setAttribute("style", "color:green;margin-left: .5rem;");

  saveButton.addEventListener("click", async () => {
    const saved = await savePair({ key: keyField.value, value: valueField.value });
    if (saved) {
      newPairDiv.innerHTML = ''; // remove form
    }
  });

  toggles.appendChild(saveButton);

  newPairDiv.appendChild(keyField);
  newPairDiv.appendChild(valueField);
  newPairDiv.appendChild(toggles);
});

// The body of this function will be executed as a content script inside the
// current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }
