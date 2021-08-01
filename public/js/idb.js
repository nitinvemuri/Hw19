let db;

const request = indexedDB.open('budget_tracker', 1)

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('data', { autoIncrement: true,});
}

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        budgetUpload();
    }
};

request.onerror = function(event) {
    console.log("Error:" + event.target.errorCode);
};

function saveRecord(record){
    const transaction = db.transaction(["budget"], "readwrite");

    const budgetObjectStore = transaction.objectStore("budget");
    budgetObjectStore.add(record);
};

function budgetUpload() {
    const transaction = db.transaction(["budget"], "readwrite");
    const budgetObjectStore = transaction.objectStore("budget");
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['budget'], 'readwrite');
                const budgetObjectStore = transaction.objectStore('budget');
                budgetObjectStore.clear();
                alert('all budget items are submitted')
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
};



function deletePending() {
    const transaction = db.transaction(["budget"], "readwrite");
    const store = transaction.objectStore("budget");
    store.clear();
}

window.addEventListener("online", budgetUpload)