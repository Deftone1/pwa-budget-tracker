const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    let db = target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
    db = target.result;
    console.log("Success!");
    // Checks online status of app
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("Woops! " + event.target.errorCode);
  };
  
// Function to save record of transaction
function saveRecord(record) {
    // Create transaction on DB
    const transaction = db.transaction(["pending"], "readwrite");
    // Accesses object store
    const store = transaction.objectStore("pending");
    // Adds record to object store
    store.add(record);
}
// Function to check database (online or offline) and clear store when completed
function checkDatabase() {
    // Open transaction on pending DB
    const transaction = db.transaction(["pending"], "readwrite");
    // Accesses object store
    const store = transaction.objectStore("pending");
    // Variable created to get all records
    const getAll = store.getAll();
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
                    // Opens a transaction on pending DB if successful
                    const transaction = db.transaction(["pending"], "readwrite");
                    // Accesses object store
                    const store = transaction.objectStore("pending");
                    // Clears everything in store
                    store.clear();
                });
        }
    };


}
// Event Listener to check for app coming back online
window.addEventListener("online", checkDatabase);