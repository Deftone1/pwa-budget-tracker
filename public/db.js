let db;
var request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
};

// FUNCTION TO SAVE RECORD OF TRANSACTION
function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
}

// FUNCTION TO CHECK DATABASE (ONLINE OR OFFLINE) AND CLEAR STORE WHEN COMPLETED
function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();


}

window.addEventListener("online", checkDatabase);