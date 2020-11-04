const db;
var request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
};

request.onsuccess = event => {
    console.log("Success!");
    // Checks online status of app
    if (navigator.onLine) {
        checkDatabase();
    }
};
// Function to save record of transaction
function saveRecord(record) {
    // Create transaction on DB
    let transaction = db.transaction(["pending"], "readwrite");
    // Accesses object store
    let store = transaction.objectStore("pending");
    // Adds record to object store
    store.add(record);
}
// Function to check database (online or offline) and clear store when completed
function checkDatabase() {
    // Open transaction on pending DB
    let transaction = db.transaction(["pending"], "readwrite");
    // Accesses object store
    let store = transaction.objectStore("pending");
    // Variable created to get all records
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