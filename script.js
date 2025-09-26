// let domname; // domain name
// let qarr = []; // query array
// let latter = document.querySelector(".footer");
// let bttn = document.querySelector(".bttn");
// let form = document.querySelector(".form");
// let feed = document.querySelector(".feed"); 
// let toggleContainer = document.querySelector('.toggle-container');
// let isEnabled = false; 

// // Function to update the UI based on the state
// function updateToggle() {
//     if (isEnabled) {
//         toggleContainer.classList.add('enabled');
//         toggleContainer.classList.remove('disabled');
//         feed.disabled = false;
//         bttn.disabled = false;
//         feed.placeholder = "Enter your query";
//     } else {
//         toggleContainer.classList.add('disabled');
//         toggleContainer.classList.remove('enabled');
//         feed.disabled = true;
//         bttn.disabled = true;
//         feed.placeholder = "Enable extension to add queries";
//         feed.value = "";
//     }
//     display(); 
// }


// toggleContainer.addEventListener('click', () => {
//     isEnabled = !isEnabled; 
//     chrome.storage.local.set({ enabled: isEnabled }, () => {
//         // Notify content script about the state change
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             chrome.tabs.sendMessage(tabs[0].id, {action: "updateState", isEnabled: isEnabled});
//         });
//     });
//     updateToggle(); 
// });

// // Load the state when the document is ready
// document.addEventListener('DOMContentLoaded', async () => {
//     const result = await chrome.storage.local.get('enabled');
//     isEnabled = result.enabled !== undefined ? result.enabled : false; // Load the stored state
//     updateToggle(); 
//     await loadqueries(); 
//     dfetch(); 
// });

// // Fetch the current domain name
// function dfetch() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//         let url = tabs[0].url;
//         domname = new URL(url).host;
//         let web = document.querySelector('.webname');
//         web.innerText = `Link : ${domname}`;
//     });
// }

// // Fetch data from local storage
// function fetchk(keys) {
//     return new Promise((resolve, reject) => {
//         chrome.storage.local.get(keys, (result) => {
//             if (chrome.runtime.lastError) {
//                 reject(chrome.runtime.lastError);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

// // Assign data from local to qarr
// async function loadqueries() {
//     const data = await fetchk([domname]);
//     if (data[domname]) {
//         qarr = data[domname];
//     }
// }

// // Store the data in local storage
// function store() {
//     let obj = {};
//     obj[domname] = qarr;  
//     chrome.storage.local.set(obj);
// }

// // Display the stored queries
// async function display() {
//     latter.innerHTML = ''; 
//     if (!isEnabled) {
//         console.log("Extension is disabled. No queries will be displayed.");
//         return;
//     }
//     const data = await fetchk([domname]);
//     const queries = data[domname] || [];
//     for (let i = 0; i < queries.length; i++) {
//         // Create a container for each query and its remove button
//         const queryContainer = document.createElement('div');
//         // Create and append the query text
//         const queryText = document.createElement('div');
//         queryText.textContent = `Query ${i + 1}: ${queries[i]}`;
//         queryContainer.appendChild(queryText);
//         // Create and append the remove button
//         const rbuttn = document.createElement('button');
//         rbuttn.textContent = `Remove Query ${i + 1}`;
//         rbuttn.addEventListener('click', () => {
//             if (isEnabled) {
//                 for (let j = 0; j < qarr.length; j++) {
//                     if (qarr[j] == queries[i]) {
//                         qarr.splice(j, 1);
//                         store();
//                         break;
//                     }
//                 }
//                 display();
//             } else {
//                 console.log("Extension is disabled. Cannot remove query.");
//             }
//         });
//         queryContainer.appendChild(rbuttn);
//         latter.appendChild(queryContainer);
//     }
// }
// // Add to query array
// bttn.addEventListener('click', (event) => {
//     event.preventDefault(); // prevent form reload
//     if (!isEnabled) {
//         console.log("Extension is disabled. Query cannot be added.");
//         return;
//     }
//     let fvalue = feed.value.trim();
//     if (fvalue) {
//         qarr.push(fvalue); 
//         store(); 
//         display();
//         form.reset();
//     } else {
//         console.log("Query cannot be empty");
//     }
// });
// // Additional form submit listener for extra safety
// form.addEventListener('submit', (event) => {
//     event.preventDefault(); 
//     if (!isEnabled) {
//         console.log("Extension is disabled. Query cannot be added.");
//         return;
//     }
// });
// // Initial setup
// dfetch();

let domname; // domain name
let qarr = []; // query array
let latter = document.querySelector(".footer");
let bttn = document.querySelector(".bttn");
let form = document.querySelector(".form");
let feed = document.querySelector(".feed"); 
let toggleContainer = document.querySelector('.toggle-container');
let isEnabled = false; 

// Function to update the UI based on the state
function updateToggle() {
    if (isEnabled) {
        toggleContainer.classList.add('enabled');
        toggleContainer.classList.remove('disabled');
        feed.disabled = false;
        bttn.disabled = false;
        feed.placeholder = "Enter your query";
    } else {
        toggleContainer.classList.add('disabled');
        toggleContainer.classList.remove('enabled');
        feed.disabled = true;
        bttn.disabled = true;
        feed.placeholder = "Enable extension to add queries";
        feed.value = "";
    }
    display(); 
}

toggleContainer.addEventListener('click', () => {
    isEnabled = !isEnabled; 
    chrome.storage.local.set({ enabled: isEnabled }, () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "updateState", isEnabled: isEnabled});
        });
    });
    updateToggle(); 
});

// Load the state when the document is ready
document.addEventListener('DOMContentLoaded', async () => {
    const result = await chrome.storage.local.get('enabled');
    isEnabled = result.enabled !== undefined ? result.enabled : false;

    await dfetch();        // make sure domname is set first
    await loadqueries();   // now safe to use domname
    updateToggle(); 
});

// Fetch the current domain name
function dfetch() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let url = tabs[0].url;
            domname = new URL(url).host;
            let web = document.querySelector('.webname');
            if (web) web.innerText = `Link : ${domname}`;
            resolve();
        });
    });
}

// Fetch data from local storage
function fetchk(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });
}

// Assign data from local to qarr
async function loadqueries() {
    if (!domname) return;
    const data = await fetchk([domname]);
    if (data[domname]) {
        qarr = data[domname];
    }
}

// Store the data in local storage
function store() {
    let obj = {};
    obj[domname] = qarr;  
    chrome.storage.local.set(obj);
}

// Display the stored queries
async function display() {
    latter.innerHTML = ''; 
    if (!isEnabled) {
        console.log("Extension is disabled. No queries will be displayed.");
        return;
    }
    if (!domname) return;
    const data = await fetchk([domname]);
    const queries = data[domname] || [];
    for (let i = 0; i < queries.length; i++) {
        const queryContainer = document.createElement('div');
        const queryText = document.createElement('div');
        queryText.textContent = `Query ${i + 1}: ${queries[i]}`;
        queryContainer.appendChild(queryText);

        const rbuttn = document.createElement('button');
        rbuttn.textContent = `Remove Query ${i + 1}`;
        rbuttn.addEventListener('click', () => {
            if (isEnabled) {
                qarr = qarr.filter(q => q !== queries[i]);
                store();
                display();
            } else {
                console.log("Extension is disabled. Cannot remove query.");
            }
        });
        queryContainer.appendChild(rbuttn);
        latter.appendChild(queryContainer);
    }
}

// Add to query array
bttn.addEventListener('click', (event) => {
    event.preventDefault();
    if (!isEnabled) {
        console.log("Extension is disabled. Query cannot be added.");
        return;
    }
    let fvalue = feed.value.trim();
    if (fvalue) {
        qarr.push(fvalue); 
        store(); 
        display();
        form.reset();
    } else {
        console.log("Query cannot be empty");
    }
});

// Extra safeguard for form submit
form.addEventListener('submit', (event) => {
    event.preventDefault(); 
    if (!isEnabled) {
        console.log("Extension is disabled. Query cannot be added.");
        return;
    }
});
