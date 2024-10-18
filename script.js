//reload function
document.addEventListener("DOMContentLoaded",loaded)

//fetch data from link

async function getData() {
    try{

        let response= await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
        let data= await response.json()
        console.log(data)
        //set userId
        let userId=data.items[0].id 
        //store data on localStorage
        localStorage.setItem(userId, JSON.stringify(data))
        //create function to display data
        await displayData(data,userId)

    }
    catch(err){
        console.log("Something wrong in getData",err)
    }

}

async function displayData(data,userId){

    try{
        let  storedData = JSON.parse(localStorage.getItem(userId))
        console.log("storedData",storedData)

        let tbody=document.querySelector('.cart-body')
        console.log(tbody)

        data.items.forEach(item => {

            let row=document.createElement('tr')
            row.className="product-row"
            row.innerHTML=`
                <td data-label="Product">
                    <img src="${item.image}" alt="${item.title}" style="width: 100px;"><br>
                    ${item.title}
                </td>
                <td data-label="Price">${item.price/100}</td>
                <td data-label="Quantity" ><input type="number" value="${item.quantity}" min="1" max="10" class="quantity" data-Price="${item.price/100}" style="width: 30px;"></td>
                <td data-label="Sub-Total" class="sub-Totals">${((item.price/100)*item.quantity).toFixed(2)}</td>
                <td data-label="delete">
                    <img src="./images/deleteImage.png" id="${item.id}" class="trash"  style="width: 30px;">
                </td>
            
            `
            tbody.appendChild(row)          
            console.log('row added',row)

            const quantity=row.querySelector('.quantity')
            const subtotal=row.querySelector('.sub-Totals')

            quantity.addEventListener('input',(event)=>{
                updateSubtotal(event.target,subtotal)
            })  

            const trash=row.querySelector('.trash')
            trash.addEventListener('click',()=>{
                deleteData(userId,row)
            })  
            
            

        });

    }
    catch(err){
        console.log("Something wrong in displayData",err)
    }
}

async function updateSubtotal(input,subtotal){
    const count=parseInt(input.value)
    const price=parseFloat(input.dataset.price)
    const subTotal=(count*price).toFixed(2)
    subtotal.innerHTML=`₹${subTotal}`
    await cartTotals()
}

async function cartTotals() {
    let rows = document.querySelectorAll('.product-row');
    let subTotal = 0;

    rows.forEach(row => {
        let subTotalCell = row.querySelector('.sub-Totals').textContent;
        let subTotalValue = parseFloat(subTotalCell.replace('₹', ''));
        subTotal += subTotalValue;
    });

    document.getElementById('Sub-Totals').textContent = `Sub-Totals: ₹${subTotal.toFixed(2)}`;
    document.getElementById('Totals').textContent = `Totals: ₹${subTotal.toFixed(2)}`;
}


async function deleteData(userId,row){
    try{
        localStorage.removeItem(userId)
        row.remove()

    }
    catch(err){
        console.log("Something wrong in deleteData",err)
    }
}


async function loaded(){
    console.log("Dom loaded")
    await getData()
}