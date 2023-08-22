
var g_bodegas = [];
var g_bodegasMap = new Map();

var g_bodegasProducto = [];
var g_bodegasProductoMap = new Map();
// modal for bodega
var modalBodegaE = document.getElementById('modalBodegaEdit');
const modalBodegaEdit = new bootstrap.Modal('#modalBodegaEdit');

var modalBodegaA = document.getElementById('modalBodegaAdd');
const modalBodegaAdd = new bootstrap.Modal('#modalBodegaAdd');

function init(){
    brignData();
}

function brignData(){
    axios.get('/api/bodega/all')
    .then((result) => {
        result = result.data;
        g_bodegas = result;
        fillBodegas(result)
        .then(() => {
            axios.get('/api/bodega/producto/all')
            .then((bodegaproducto)=>{
                bodegaproducto = bodegaproducto.data;
                g_bodegasProducto = bodegaproducto;
                fillBodegaProducto(bodegaproducto);
            })
        });
    }, (error) => {
        console.log(error);
    });
}

function fillBodegaProducto(data){
    data.forEach(e =>{
        axios.get('/api/product/one/'+e.producto).then(result => {
            result = result.data;
            $(`#bodegaProductos-${e.bodega}`).append(`
            <div class="col-md-2">
                <div class="card animate__animated animate__fadeIn border-0">
                    <img src="${result.image}" class="card-img-top object-fit-cover" alt="Foto Perfume de ${result.name}" style="height: 150px;">
                    <div class="card-body">
                        <h6 class="card-title mb-0 fw-bold">${result.name} ${result.brand}</h6>
                        <small class="text-muted">${result.type} - ${result.category}</small>
                        
                        <p class="card-text">Cantidad: <span class="text-primary fw-bold">${e.cantidad}</span></p>
                    </div>
                </div>
            </div>
            `);
        })
    });
}

function fillBodegas(data){
    return new Promise((resolve, reject) => {
        $("#card-bodegas-items").empty();
        data.forEach((item,i) => {
            addBodegaCard(item,i);
            g_bodegasMap.set(item.id, item);
        });
        resolve();
    });
}
function addBodegaCard(e,i){
    // 
    $("#card-bodegas-items").append(`
        
        <div class="col-md-2">
            <div class="card bg-gray border-0 border-top border-primary border-5">
                <div class="p-3">
                    <h5 class="fw-bold"><i class="fa-solid fa-warehouse"></i> ${e.nombre}</h5>
                    <p class="text-muted"><i class="fa-solid fa-spray-can-sparkles"></i> 125 productos</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-link btn-sm" type="button" role="tab" aria-controls="nav-bodega-${i}" 
                        id="nav-bodega-${i}-tab" data-bs-toggle="tab" data-bs-target="#nav-bodega-${i}" aria-selected="false">Ver Bodega</button>
                    </div>
                </div>
            </div>
        </div>
    `);
    $("#nav-tabContent-bodegas").append(`
        <div class="tab-pane fade" id="nav-bodega-${i}" role="tabpanel" aria-labelledby="nav-bodega-${i}-tab" tabindex="0">
            <div class="bg-white rounded-15 shadow-custom p-3 mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="fw-bold mb-0">${e.nombre}</h4>
                    <button class="btn btn-dark-100 btn-sm" type="button" onclick="openUpdateBodega('${e.id}')"><i class="fa-solid fa-ellipsis"></i></button>
                </div>
                <hr>
                <div id="bodegaProductos-${e.id}" class="row mx-0 g-3"></div>
            </div>
        </div>
    `);
}
function openUpdateBodega(id){
    let bodega = g_bodegasMap.get(parseInt(id));
    $("#update-bodega-name").val(bodega.nombre);
    $("#update-bodega-id").html(bodega.id);
    
    modalBodegaEdit.show();
}
function actulizarBodega(){
    let id = $("#update-bodega-id").html();
    let nombre = $("#update-bodega-name").val();
    $.ajax({
        url: '/api/bodega/update',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            id: id,
            nombre: nombre
        })
    }).then((result) => {
        modalBodegaEdit.hide();
        location.reload();
    }, (error) => {
        console.log(error);
    });
}
function addNewBodega(){
    $("#add-bodega-name").val("");
    modalBodegaAdd.show();
}
function agregarBodega(){
    let nombre = $("#add-bodega-name").val();
    $.ajax({
        url: '/api/bodega/add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            nombre: nombre
        })
    }).then((result) => {
        modalBodegaAdd.hide();
    }, (error) => {
        console.log(error);
    });
}
function eliminarBodega(){
    let id = $("#update-bodega-id").html();
    $.ajax({
        url: '/api/bodega/delete',
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({
            id: id
        })
    }).then((result) => {
        modalBodegaEdit.hide();
    }, (error) => {
        console.log(error);
    });
}

document.addEventListener('DOMContentLoaded', init);