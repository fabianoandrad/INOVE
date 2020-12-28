const Database = require('sqlite-async')


function execute (db){
   return db.exec(`
        CREATE TABLE IF NOT EXISTS list_stock (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product TEXT,
            team TEXT,
            amount INTEGER,
            cost INTEGER,
            stock INTEGER,
            price INTEGER,
            profit INTEGER,
            porcentage INTEGER,
            comments TEXT
            );
            
        CREATE TABLE IF NOT EXISTS list_sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idStock INTEGER,
            product TEXT,
            team TEXT,
            amount INTEGER,
            price INTEGER,
            total INTEGER,
            date TEXT
            )
    `)
    
}

module.exports = Database.open(__dirname + '/database.sqlite').then(execute)