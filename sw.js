const staticRadioTata = "radioTata-v1"

const assets = [
  "/",
  "/index.html",
  "/css/app.css",
  "/js/app.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticRadioTata).then(cache => {
      cache.addAll(assets)
    })
  )
})


self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})

