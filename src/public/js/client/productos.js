// /api/product/all?offset=0&limit=4&category=hombre


function init(event){
    bringData();
}


function bringData(){
    getHombres();
    getMujeres();
}

function getHombres(){
    $.ajax({
        url: '/api/product/all?offset=0&limit=5&category=hombre',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        console.log(result);
        fillHombres(result.data);
    }, (error) => {
        console.log(error);
    });
}

function getMujeres(){
    $.ajax({
        url: '/api/product/all?offset=0&limit=5&category=mujer',
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
        $("#horizontal-hombres").append(`
            <div class="card producto animate__animated animate__fadeIn" style="width: 250px;">
                <img src="${e.image}" class="card-img-top" alt="Perfume">
                <div class="card-body">
                    <h5 class="card-title">
                        <span class="fw-bold">${e.name}</span> 
                        <small class="d-block fw-light">by ${e.brand}</small>
                    </h5>
                    <small class="text-muted d-block">${e.barcode}</small>
                    
                    <div class="d-flex justify-content-start align-items-center gap-2 my-2">
                        <small class="badge bg-gray text-muted">${e.cantidad}</small>
                        <small class="badge bg-gray text-muted">${capitalisedFL(e.category)}</small>
                    </div>
                    <small class="text-${e.stock > 0 ? "success" : "danger"} d-block">${e.stock > 0 ? "Disponible": "Out of Stock"}</small>
                    <p class="text-primary-client lead fw-bold m-0">9900</p>
                </div>
            </div>
        `);
    });
}
function fillMujeres(data){
    data.forEach((e,i)=>{
        $("#horizontal-mujeres").append(`
            <div class="card producto animate__animated animate__fadeIn" style="width: 250px;">
                <img src="${e.image}" class="card-img-top" alt="Perfume">
                <div class="card-body">
                    <h5 class="card-title">
                        <span class="fw-bold">${e.name}</span> 
                        <small class="d-block fw-light">by ${e.brand}</small>
                    </h5>
                    <small class="text-muted d-block">${e.barcode}</small>
                    
                    <div class="d-flex justify-content-start align-items-center gap-2 my-2">
                        <small class="badge bg-gray text-muted">${e.cantidad}</small>
                        <small class="badge bg-gray text-muted">${capitalisedFL(e.category)}</small>
                    </div>
                    <small class="text-${e.stock > 0 ? "success" : "danger"} d-block">${e.stock > 0 ? "Disponible": "Out of Stock"}</small>
                    <p class="text-primary-client lead fw-bold m-0">9900</p>
                </div>
            </div>
        `);
    });
}

document.addEventListener("DOMContentLoaded", init);