let db;

const request = indexedDB.open('budget', 1)

request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true,});
}

request.onsuccess = function(e) {
    db = e.target.result;
    if (navigator.onLine) {
        
    }
};

request.onerror = function(e) {
    console.log(e.target.errorCode);
};

function budgetUpload() {
    const transaction = db.transaction(["budget"], "readwrite");
    const store = transaction.objectStore("budget");
    const getAll = store.getAll();

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
            .then(() => {
                const transaction = db.transaction(["budget", "readwrite"]);
                const store = transaction.objectStore("new_budget");
                store.clear();
            });
        }
    }
}

window.addEventListener("online", budgetUpload)