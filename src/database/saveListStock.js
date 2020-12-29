function saveListStock(db, listStock){
    return db.run(`
    INSERT INTO list_stock (
        product,
        team,
        amount,
        cost,
        stock,
        price,
        profit,
        porcentage,
        comments,
        alert
      ) VALUES (
    
        '${listStock.product}',
        '${listStock.team}',
        '${listStock.amount}',
        '${listStock.cost}',
        '${listStock.stock}',
        '${listStock.price}',
        '${listStock.profit}',
        '${listStock.porcentage}',
        '${listStock.comments}',
        '${listStock.alert}'

       )
    `)
}

module.exports = saveListStock