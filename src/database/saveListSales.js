function saveListSales(db, listSales){
    return db.run(`
    INSERT INTO list_sales (
        idStock,
        product,
        team,
        amount,
        price,
        total,
        date
      ) VALUES (
        '${listSales.idStock}',
        '${listSales.product}',
        '${listSales.team}',
        '${listSales.amount}',
        '${listSales.price}',
        '${listSales.total}',
        '${listSales.date}'
       )
    `)
}

module.exports = saveListSales