var dbPromise = idb.open('audios-store', 1, function(db) {
  if (!db.objectStoreNames.contains('audios')) {
    db.createObjectStore('audios', {keyPath: 'id'});
  }
});

function writeData(store, data) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(store, 'readwrite');
      var store = tx.objectStore(store);
      store.put(data);
      return tx.complete;
    });
}


function readAllData(store) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(store, 'readonly');
      var store = tx.objectStore(store);
      return store.getAll();
    });
}

function clearAllData(store) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(store, 'readwrite');
      var store = tx.objectStore(store);
      store.clear();
      return tx.complete;
    });
}

function deleteItemFromData(store, id) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(store, 'readwrite');
      var store = tx.objectStore(store);
      store.delete(id);
      return tx.complete;
    })
    .then(function() {
      console.log('Item deleted!');
    });
}