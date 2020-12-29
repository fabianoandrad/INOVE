//const pageListStock = require("./database/fakedata.js");
const Database = require("./database/db");
const saveListStock = require("./database/saveListStock");
const saveListSales = require("./database/saveListSales");

module.exports = {

  index(req, res) {
    const test = req.query;
    return res.render("index");
  },

  //atualizar pagina de estoque
  async pageListStock(req, res) {
    try {
      const db = await Database; // aguarda a conclusao do banco de dados, essa é uma das formas de usar sem ser o then
      const id = req.query.id;
      const listStock = await db.all("SELECT * FROM list_stock");
      let selectListStockId = await db.all(`SELECT * FROM list_stock WHERE id="${id}"`);

      if (id == undefined || id <= 0) {
        selectListStockId = [0];
      }

      let sumStock = 0
      let valueStock = 0
      let sumItems = 0
      let valueItems = 0
      let sumProfit = 0
      let valueProfit = 0

      listStock.forEach(element => {
        //verificar quantidade se <= a 5
        if(element.amount <= 5) element.alert = 1

        //Total estoque / quantidade x custo
        element.stock = element.amount * element.cost

        //Total lucro / preço final - custo
        element.profit = element.price - element.cost

        //Porcentagem (preço final - custo) / custo x 100
        let porcentage = (element.price - element.cost) / element.cost * 100
        element.porcentage = porcentage.toFixed(2)

        valueStock = element.stock
        sumStock += valueStock

        valueItems = element.amount
        sumItems += valueItems

        valueProfit = element.profit
        sumProfit += valueProfit

        element.cost = element.cost.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        element.stock = element.stock.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        element.price = element.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        element.profit = element.profit.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

      });

      const sumStockFormatted = sumStock.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
      const sumProfitFormatted = sumProfit.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

      return res.render("page-List-Stock", { listStock, selectListStockId, sumStockFormatted, sumItems, sumProfitFormatted });
    } catch (error) {
      console.log(error);
      return res.send("Erro no banco de dados");
    }
  },

  //atualizar pagina de vendas
  async pageSales(req, res) {
    try {
      const id = req.query.id;
      const db = await Database;
      const listSales = await db.all("SELECT * FROM list_sales");
      let selectListStockId = await db.all(`SELECT * FROM list_stock WHERE id="${id}"`);

      // Este if serve para atualizar a lista dos botões ao iniciar a pagina
      if (id == undefined || id <= 0) {
        selectListStockId = [0];
      }

      let sumTotal = 0

      listSales.forEach(element => {

        element.total = element.amount * element.price

        sumTotal += element.total

        element.price = element.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        element.total = element.total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

      })

      const sumTotalFormatted = sumTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

      return res.render("page-sales", { selectListStockId, listSales, sumTotalFormatted });
    } catch (error) {
      console.log(error);
      return res.send("Erro na buscar de informações no banco de dados");
    }
  },

  async saveListStock(req, res) {
    const fields = req.body;

    //Salvar produto no estoque
    try {
      const dbStock = await Database;

      if (fields.id === '') {
        await saveListStock(dbStock, {
          product: fields.product,
          team: fields.team,
          amount: fields.amount,
          cost: fields.cost,
          stock: '',
          price: fields.price,
          profit: '',
          porcentage: '',
          comments: fields.comments,
          alert: 0,
        });

      } else {
        await dbStock.all(`UPDATE list_stock SET 
      product = '${fields.product}',
      team = '${fields.team}',
      amount = ${fields.amount},
      cost = ${fields.cost},
      price = ${fields.price},
      comments = '${fields.comments}'
      WHERE id="${fields.id}"
      `);

      }

      return res.redirect("/page-list-stock");
    } catch (error) {
      console.log(error);
      return res.send("Erro ao salvar produto no banco de dados");
    }
  },

  // Salvar venda
  async saveListSales(req, res) {
    const fields = req.body;

    try {
      const dbSales = await Database;
      const idStock = fields.idStock

      dbListStock = await dbSales.all(`SELECT * FROM list_stock WHERE id="${idStock}"`);
      let dateSales = ''

      dateSales = new Date()
      dateSales = dateSales.toLocaleDateString('pt-br', { day: "2-digit", month: "long", year: "numeric" })

      await saveListSales(dbSales, {
        idStock: fields.idStock,
        product: fields.product,
        team: fields.team,
        amount: fields.amount,
        price: fields.price,
        total: '',
        date: dateSales,
      });

      // Pegar quantidade de produto  vendido e subtrair pela quantidade de estoque
      let amountStock = 0
      let amountSales = fields.amount
      dbListStock.forEach(element => {
        amountStock = element.amount - amountSales;

      });

      await dbSales.all(`UPDATE list_stock SET
        amount = '${amountStock}'
        WHERE id="${idStock}"
        `)



      return res.redirect("/page-sales");
    } catch (error) {
      console.log(error);
      return res.send("Erro ao salvar venda no banco de dados");
    }
  },

  //deletar produto estoque
  async pageListStockDelete(req, res) {
    try {
      const dbDelete = await Database;
      const idDelete = req.query.id_product;

      await dbDelete.run(`DELETE FROM list_stock WHERE id="${idDelete}"`);

      return res.redirect("/page-list-stock");
    } catch (error) {
      console.log(error);
      return res.send("Erro ao tentar deletar o produto");
    }
  },

  // Deletar produto vendido
  async pageSalesDelete(req, res) {
    try {
      const dbDelete = await Database;
      const idDelete = req.query.id_delete;

      dbListSales = await dbDelete.all(`SELECT * FROM list_sales WHERE id="${idDelete}"`);

      // Pegar quantidade de produto  vendido e soma com estoque antes de deletar
      let amountSales = 0
      let idProduct = 0
      let amountSalesStock = 0

      dbListSales.forEach(element => {
        idProduct = element.idStock
        amountSales = element.amount
      });

      dbListStock = await dbDelete.all(`SELECT * FROM list_stock WHERE id="${idProduct}"`);

      dbListStock.forEach(element => {
        amountSalesStock = element.amount + amountSales
      })

      await dbDelete.all(`UPDATE list_stock SET
        amount = '${amountSalesStock}'
        WHERE id="${idProduct}"
        `)

      await dbDelete.run(`DELETE FROM list_sales WHERE id="${idDelete}"`);

      return res.redirect("/page-sales");
    } catch (error) {
      console.log(error);
      return res.send("Erro ao tentar deletar");
    }
  },
};
