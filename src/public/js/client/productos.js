function init(event){
    bringData();
}


function bringData(){
    getHombres();
    getMujeres();
}

function getHombres(){
    $.ajax({
        url: '/api/v1/product/all?offset=0&limit=8&category=hombre',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        fillHombres(result.data);
    }, (error) => {
        console.log(error);
    });
}

function getMujeres(){
    $.ajax({
        url: '/api/v1/product/all?offset=0&limit=8&category=mujer',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        fillMujeres(result.data);
    }, (error) => {
        console.log(error);
    });
}

function fillHombres(data){
    data.forEach((e,i)=>{
        let {price1, price2, price3} = JSON.parse(e.price);
        let precio;
        if(client_data.nivel == 1){
            precio = price3;
        }else if(client_data.nivel == 2){
            precio = price2;
        }else if(client_data.nivel == 3){
            precio = price1;
        }
        precio = parseInt(precio) * (100 - parseInt(e.promotion)) / 100;
        precio = "₡ "+precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        let desc = "";
        if(e.promotion > 0){
            desc = `<small class="text-muted small fw-light">${e.promotion}% off</small>`;
        }
        $("#horizontal-hombres").append(`
            <div class="card producto bg-gray animate__animated animate__fadeInLeft" style="width: 250px; animation-delay:${(i * 50)+400}ms;" data-event="${e.id}">
                <img src="${e.image}" class="card-img-top" alt="Perfume">
                <div class="card-body">
                    <h5 class="card-title">
                        <span class="fw-bold">${e.name}</span> 
                        <small class="d-block fw-light">by ${e.brand}</small>
                    </h5>
                    <div class="d-flex justify-content-start align-items-center gap-2">
                        <p class=" lead fw-bold m-0">${precio} </p> 
                        ${desc}
                    </div>
                </div>
            </div>
        `);
        $(`.producto[data-event="${e.id}"]`).on('click',(event)=>{
            let id = $(event.currentTarget).attr("data-event");
            openModalViewProductos(id, event);
        });
    });
}
function fillMujeres(data){
    data.forEach((e,i)=>{
        let {price1, price2, price3} = JSON.parse(e.price);
        let precio;
        if(client_data.nivel == 1){
            precio = price3;
        }else if(client_data.nivel == 2){
            precio = price2;
        }else if(client_data.nivel == 3){
            precio = price1;
        }
        precio = parseInt(precio) * (100 - parseInt(e.promotion)) / 100;
        precio = "₡ "+precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        let desc = "";
        if(e.promotion > 0){
            desc = `<small class="text-muted small fw-light">${e.promotion}% off</small>`;
        }
        $("#horizontal-mujeres").append(`
            <div class="card producto bg-gray animate__animated animate__fadeInLeft" style="width: 250px; animation-delay:${(i * 50)+700}ms;" data-event="${e.id}">
                <img src="${e.image}" class="card-img-top" alt="Perfume">
                <div class="card-body">
                    <h5 class="card-title">
                        <span class="fw-bold">${e.name}</span> 
                        <small class="d-block fw-light">by ${e.brand}</small>
                    </h5>
                    <div class="d-flex justify-content-start align-items-center gap-2">
                        <p class=" lead fw-bold m-0">${precio} </p> 
                        ${desc}
                    </div>
                </div>
            </div>
        `);
        $(`.producto[data-event="${e.id}"]`).on('click',(event)=>{
            let id = $(event.currentTarget).attr("data-event");
            openModalViewProductos(id, event);
        });
    });
}

document.addEventListener("DOMContentLoaded", init);