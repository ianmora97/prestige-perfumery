function init(){
    bringData();
}

async function bringData(){
    await readParameters();
    onFilterChange();
    onSearch();
}
function onSearch(){
    $("[data-input='barraBuscar']").on('keyup', (e) => {
        if(e.keyCode == 13){
            let search = $("[data-input='barraBuscar']").val();
            window.location.href = `/productos/result?search=${search}`;
        }
    });
    $("[data-input='barraBuscarmobile']").on('keyup', (e) => {
        if(e.keyCode == 13){
            let search = $("[data-input='barraBuscarmobile']").val();
            window.location.href = `/productos/result?search=${search}`;
        }
    });
}
function readParameters(){
    return new Promise((resolve, reject) => {
        let url = new URL(window.location.href);
        let params = url.searchParams;
        let category = params.get('category');
        let search = params.get('search');
        let offset = params.get('offset');
        let limit = params.get('limit') || 30;
        if(category){
            getProductsByCategory(category, offset, limit);
        }else if(search){
            getProductsBySearch(search, offset, limit);
        }
        // $("[data-input='barraBuscar']").val(search || category);
        $("#resultadosDeBusqueda").text(search || category);
        resolve();
    });
}
function getProductsByCategory(category, offset, limit){
    $.ajax({
        url: `/api/product/all?offset=${offset}&limit=${limit}&category=${category}`,
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        fillProducts(result.data);
    }, (error) => {
        console.log(error);
    });
}
function getProductsBySearch(search, offset, limit){
    $.ajax({
        url: `/api/product/all?offset=${offset}&limit=${limit}&search=${search}`,
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        fillProducts(result.data);
    }, (error) => {
        console.log(error);
    });
}

function fillProducts(data){
    if(data.length > 0){
        data.forEach((e,i) => {
            addProduct(e,i);
        });
    }else{
        $("#products").append(`
            <div class="col-12 text-center">
                <h3 class="fw-bold">No se encontraron resultados</h3>
            </div>
        `);
    }
}
function addProduct(e,i){
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
    $("#products").append(`
        <div class="card producto bg-gray animate__animated animate__fadeInUp mb-0" style="width: 250px; animation-delay:${(i * 50)}ms;" data-event="${e.id}">
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
}
function onFilterChange(){
    $("[data-filter-cat-change]").on('change', (event) => {
        let val = $(event.currentTarget).val();
        let url = new URL(window.location.href);
        let params = url.searchParams;
        params.set('category', val);
        url.search = params.toString();
    });
}


document.addEventListener('DOMContentLoaded', init);