// Variaveis
const btnSales = document.querySelector('.buttons .btn-sales')
const btnStock = document.querySelector('.buttons .btn-stock')

//Botão venda
btnSales.addEventListener('click', () =>{
    btnSales.classList.add('btn-sales-hide')  
})

btnSales.addEventListener('animationend', event =>{
    if(event.animationName === "hide") btnSales.style.display = "none"
})

//Botão estoque
btnStock.addEventListener('click', () =>{
    btnStock.classList.add('btn-stock-hide')
})

btnStock.addEventListener('animationend', event =>{
    if(event.animationName === "hide") btnStock.style.display = "none"
})
