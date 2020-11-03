let db;
var request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
};

// FUNCTION TO SAVE RECORD OF TRANSACTION
function saveRecord(record) {
    let transaction = db.transaction(["pending"], "readwrite");
    let store = transaction.objectStore("pending");
}

// FUNCTION TO CHECK DATABASE (ONLINE OR OFFLINE) AND CLEAR STORE WHEN COMPLETED
function checkDatabase() {
    // OPEN TRANSACTION ON PENDING DB
    let transaction = db.transaction(["pending"], "readwrite");
    // ACCESSES OBJECT STORE
    let store = transaction.objectStore("pending");
    // VARIABLE TO GET ALL RECORDS
    let getAll = store.getAll();
    getAll.onsuccess = function () {
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
                // OPENS A TRANSACTION ON PENDING DB IF SUCCESSFUL
                const transaction = db.transaction(["pending"], "readwrite");
                // ACCESSES OBJECT STORE
                const store = transaction.objectStore("pending");
                // CLEARS EVERYTHING IN STORE
                store.clear();
            });
        }
    };


}

window.addEventListener("online", checkDatabase);