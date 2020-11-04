console.log("Hello from your service worker!");

// All files below will be cached
const FILES_TO_CACHE = [
    "/",
    "db.js",
    "/style.css",
    "/index.html",
    "/index.js",
    "/manifest.webmanifest",
    "/icons/icon-72x72.png",
    "/icons/icon-96x96.png",
    "/icons/icon-128x128.png",
    "/icons/icon-144x144.png",
    "/icons/icon-152x152.png",
    "/icons/icon-192x192.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png"

]

const CACHE_NAME = "static-cache-v1", DATA_CACHE_NAME = "data-cache-v1";
