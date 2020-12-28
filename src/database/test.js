const Database = require("./db");
const saveListStock = require("./saveListStock")

Database.then(async db => {

    await saveListStock(db, {
        product: 'Pen Driver',
        team: 'Gigabytes',
        amount: '30',
        cost: '9.99',
        stock: '3',
        price: '233.89',
        profit: '100.99',
        porcentage: '100',
        comments: 'Falsificado' 
    })


    //const selectListStockId = await db.all('SELECT * FROM list_stock WHERE id="2"')
    
    //console.log(await db.run('DELETE FROM list_stock WHERE id="3"'))
    const selectListStock = await db.all('SELECT * FROM list_stock')
    console.log(selectListStock)

});
