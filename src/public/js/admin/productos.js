var g_filter = new Map();
var g_dataMap = new Map();
var g_data = [];

var g_bodegas = [];
var g_bodegasMap = new Map();

var isSearch = false;

var g_imageTypeselected = "customimage";
var g_imageLoaded = false;

var g_selected = "";
//* Modals
const modalImagePreview = new bootstrap.Modal('#imagepreview')
const editModal = new bootstrap.Modal('#editModal');

var modalEscaner = document.getElementById('escanerModal');
const escanerModal = new bootstrap.Modal(modalEscaner);

// modal for bodega
var modalBodegaE = document.getElementById('modalBodegaEdit');
const modalBodegaEdit = new bootstrap.Modal('#modalBodegaEdit');

var modalBodegaA = document.getElementById('modalBodegaAdd');
const modalBodegaAdd = new bootstrap.Modal('#modalBodegaAdd');


function init(){
    formatInputs();
    runTooltips();
    checkRatioFilter();
    imagelinkload();
    brignData();
    onTabsImageAdd();
    eventListeners();
}
function eventListeners(){
    $("#btn-agregar").on('click', function(){
        agregarProducto();
    });
}
function openScaner(type){
    isSearch = type == "search" ? true : false;
    
    escanerModal.show();

    modalEscaner.addEventListener('shown.bs.modal', function (event) {
        scanBarcode();
    });
}

function scanBarcode(){
    Quagga.init({
        inputStream : {
          name : "Live",
          type : "LiveStream",
          target: document.querySelector('#barcodePreview'),
          singleChannel: false
        },
        decoder : {
          readers : ["upc_reader","upc_e_reader","ean_reader"],
        },
        locate: true,
    }, function(err) {
        if (err) {
            console.log("ERROR",err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });
    Quagga.onDetected(function(data){
        if(data.codeResult.code){
            if(isSearch){
                console.log(data.codeResult.code);
                searchScaner(data.codeResult.code);
            }else{
                $("#barcodeResult").html(`
                    <div class="alert alert-success mt-4 animate__animated animate__fadeInDown" role="alert">
                        <h4 class="alert-heading mb-1"><i class="fa-solid fa-barcode"></i> 
                            <span id="barcodeResultText">${data.codeResult.code}</span>
                        </h4>
                    </div>
                `);
            }
            $("#barcodePreview").html("");
            Quagga.stop();
            escanerModal.hide();
        }
    });
    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });
}
function onTabsImageAdd(){
    Array.from(document.querySelectorAll('button[data-toggle-add="tab"]'))
    .forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', event => {
            let prev = event.relatedTarget // previous active tab
            let curr = event.target // newly activated tab
            g_imageTypeselected = curr.getAttribute('data-bs-target').split('-')[1];
            console.log(g_imageTypeselected);
        });
    });
}
function imagelinkload(){
    $("#add-imagelink").on('keyup', function(){
        let link = $(this).val();
        var img = new Image();
        img.src = link;
        img.onload = function() {
            $("button[data-bs-target='#pills-customimage']").attr('disabled', true);
            $("button[data-bs-target='#pills-customimage']").addClass('disabled');

            $("#imagepreviewlink").html(
                `<img src="${link}" style="width: 200px;" class="mx-auto d-block" alt="Imagen">`
            );
            if(link.length > 0){
                $("#imagepreviewlink").show();
            }else{
                $("#imagepreviewlink").hide();
            }
        };
        if(link.length == 0){
            $("button[data-bs-target='#pills-customimage']").attr('disabled', false);
            $("button[data-bs-target='#pills-customimage']").removeClass('disabled');

            $("#imagepreviewlink").html("");
        }
    });
}
function reloadData(){
    var table = $('#table').DataTable();
    table.destroy();
    $('#tbody').empty();
    brignData();
}
function brignData(){
    let ajaxTime = new Date().getTime();
    $.ajax({
        url: '/api/product/all',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' seg' : a + ' segs';
        $("#lastUpdated").html(t);
        getDataBodega();
        fillStats(result);
        fillProductos(result);
    }, (error) => {
        console.log(error);
    });
}
function getDataBodega(){
    $.ajax({
        url: '/api/bodega/all',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        g_bodegas = result;
        fillBodegas(result).then(() => {
            urlListener();
        });
    }, (error) => {
        console.log(error);
    });
}

function fillBodegas(data){
    return new Promise((resolve, reject) => {
        $("#card-bodegas-items").empty();
        data.forEach((item) => {
            addBodegaCard(item);
            g_bodegasMap.set(item.id, item);
        });
        $("#card-bodegas-items").append(`
            <div class="col-md-2">
                <div class="card-bodega" onclick="addNewBodega()">
                    <i class="fa-solid fa-plus fa-2x text-white"></i>
                </div>
            </div>
        `);
        resolve();
    });
}
function addBodegaCard(e){
    $("#card-bodegas-items").append(`
        <div class="col-md-2">
            <div class="card-bodega" onclick="openUpdateBodega('${e.id}')">
                <h5 class="fw-bold text-white">${e.nombre}</h5>
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
        getDataBodega();
        modalBodegaEdit.hide();
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
        getDataBodega();
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
        getDataBodega();
        modalBodegaEdit.hide();
    }, (error) => {
        console.log(error);
    });
}

function fillStats(data){
    $("#totalitems").html(data.length);
    $("#totalitems-1").html(data.length);

    let mujer = data.filter((item) => item.category == "mujer");
    mujer  = mujer.length > 99 ? "99+" : mujer.length;
    $("#totalitems-m").html(mujer);

    let hombre = data.filter((item) => item.category == "hombre");
    hombre  = hombre.length > 99 ? "99+" : hombre.length;
    $("#totalitems-h").html(hombre);

    let unisex = data.filter((item) => item.category == "unisex");
    unisex  = unisex.length > 99 ? "99+" : unisex.length;
    $("#totalitems-u").html(unisex);

}
function openEditModal(uuid){
    let prod = g_dataMap.get(uuid);

    let {price1, price2, price3} = JSON.parse(prod.price);

    $("#edit-name").val(prod.name);
    $("#edit-marca").val(prod.brand);
    $("#edit-precio1").val(price1);
    $("#edit-precio2").val(price2);
    $("#edit-precio3").val(price3);

    $("#edit-categoria").val(prod.category);
    $("#edit-stock").val(prod.stock);
    $("#edit-aviso").val(prod.notification);
    let cantidad = prod.cantidad.split(" ");
    $("#edit-cantidad").val(cantidad[0]);
    $("#edit-q").val(cantidad[1]);
    $("#edit-promotion").val(prod.promotion);
    $("#edit-image").attr("src", prod.image);
    $("#edit-image-path").val(prod.image);

    $("#edit-barcode").val(prod.barcode);

    iterateonBodegas(prod.bodega);

    $("#editModalLabel").html(`
        <h5 class="mb-0"><i class="fa-solid fa-box-open text-secondary"></i> Editar Producto<br></h5>
        <small class="text-muted" id="update-modal-uuid">${prod.uuid}</small>
    `);
    editModal.show();
}
function iterateonBodegas(bodegas){
    let arr = JSON.parse(bodegas); // type: array
    $("#bodegas-list-update").html("");
    g_bodegas.forEach((bodega,i) => {
        let bodegaName = bodega.nombre;
        let bodegaId = i;
        let bodegaStock = 0;
        arr.forEach((elem) => {
            if(elem.nombre == bodegaName){
                bodegaStock = elem.cantidad;
            }
        });
        $("#bodegas-list-update").append(`
            <div class="col-md">
                <div class="form-group">
                    <label class="form-label fw-bold" for="bodega-${bodegaId}">${bodegaName}</label>
                    <input type="number" class="form-control" placeholder="Cantidad de productos en ${bodegaName}" id="bodega-${bodegaId}" value="${bodegaStock}">
                </div>
            </div>
        `);
    });
}
function updateProduct(){
    // #update-modal-uuid
    let uuid = $("#update-modal-uuid").html();
    let prod = g_dataMap.get(uuid);

    let price1 = $("#edit-precio1").val().replace(/\./g,'');
    let price2 = $("#edit-precio2").val().replace(/\./g,'');
    let price3 = $("#edit-precio3").val().replace(/\./g,'');

    // get nombre, marca, categoria, stock, aviso, cantidad, q, promotion, imag
    
    let nombre = $("#edit-name").val();
    let marca = $("#edit-marca").val();
    let category = $("#edit-categoria").val();
    let stock = parseInt($("#edit-stock").val());
    let aviso = parseInt($("#edit-aviso").val());
    let c = $("#edit-cantidad").val();
    let q = $("#edit-q").val();
    let promotion = $("#edit-promotion").val();
    let image = $("#edit-image-path").val();

    let barcode = $("#edit-barcode").val();

    let cantidad =  c +" "+ q;

    let bodegas = [];
    g_bodegas.forEach((bodega,i) => {
        let cantidad = parseInt($("#bodega-"+i).val());
        bodegas.push({
            nombre: bodega.nombre,
            cantidad: cantidad
        });
    });

    let data = {
        id: prod.id,
        name: nombre,
        brand: marca,
        category: category,
        stock: stock,
        notification: aviso,
        cantidad: cantidad,
        promotion: promotion,
        filename: image,
        bodega: JSON.stringify(bodegas),
        price: JSON.stringify({
            price1: price1,
            price2: price2,
            price3: price3
        }),
        barcode: barcode
    };
    verifyEditInputs().then(() => {
        // ajax
        $.ajax({
            url: '/api/product/update',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).then((result) => {
            reloadData();
            editModal.hide();
            Swal.fire({
                title: 'Producto actualizado',
                text: 'El producto ha sido actualizado correctamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
        });
    });


}
function verifyEditInputs(){
    return new Promise((resolve, reject) => {
        let name = $("#edit-name").val();
        let stock = parseInt($("#edit-stock").val());
        let price1 = $("#edit-precio1").val();
        let price2 = $("#edit-precio2").val();
        let price3 = $("#edit-precio3").val();
        let price = JSON.stringify({
            price1: price1,
            price2: price2,
            price3: price3
        });
        let category = $("#edit-categoria").val();
        let notification = parseInt($("#edit-aviso").val());
        let brand = $("#edit-marca").val();
        let c = $("#edit-cantidad").val();
        let image = $("#edit-image-path").val();
        let barcode = $("#edit-barcode").val();
        if(barcode == '' || image == '' || name == '' || stock == '' || price1 == '' || price2 == '' || price3 == '' || category == '' || notification == '' || brand == '' || c == ''){
            reject();
        }else{
            resolve();
        }
    });
}
function eliminarProducto(uuid){
    let prod = g_dataMap.get(uuid);

    Swal.fire({
        title: '¿Desea eliminar el producto?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#96d7f4',
        cancelButtonColor: '#f26262',
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/api/product/delete',
                method: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: prod.id
                })
            }).then((result) => {
                reloadData();
                editModal.hide();
                Swal.fire({
                    title: 'Producto eliminado',
                    text: 'El producto ha sido eliminado correctamente',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            }, (error) => {
                console.log(error);
            });
        }
    })

    
}
function urlListener(){
    let url = new URL(window.location.href);
    let uuid = url.searchParams.get("uuid");
    if(uuid != null){
        openEditModal(uuid);
    }
    return;
}
function fillProductos(data){
    $("#tbody").html("");
    g_data = data;
    data.forEach((item) => {
        g_dataMap.set(item.uuid, item);
        addRow(item);
    });
    datatables();
    zoomImages();
}
function addRow(e){
    try {
        let {price1, price2, price3} = JSON.parse(e.price);
        let color = "success";
        if(e.stock <= e.notification + 5){
            color = "warning";
        }if(e.stock <= e.notification){
            color = "danger";
        }
        $("#tbody").append(`
            <tr>
                <td class="">
                    <div class="d-flex justify-content-center align-items-center" role="button">
                        <img src="${e.image}" height="70px" alt="" class="hover-img img-round">
                    </div>
                </td>
                <td><span class="text-primary">${e.barcode}</span></td>
                <td class="">
                    <div class="d-flex flex-column align-items-start justify-content-start">
                        <span class="fw-bold lead">${e.name}</span>
                        <span class="text-muted">${e.brand}</span>
                    </div>
                </td>
                <td class="">${e.cantidad}</td>
                <td class=""><span class="badge b-pill badge-blue">${e.category}</span></td>
                <td class="">
                    <div class="d-flex justify-content-start align-items-center ps-3">
                        <div contentEditable="true" class="p-1 h4 mb-0" role="button" id="contentEditable-stock_${e.uuid}" onkeydown="avoidEditablecontents(this)" onkeyup="changeStockValueTable(this)">
                            ${e.stock} 
                        </div>
                        <i class="fa-solid fa-circle fa-2xs text-${color} ps-2" id="color-stock-${e.uuid}"></i>
                    </div>
                </td>
                <td class="" data-search="${price1} - ${price2} - ${price3}">
                    <div class="d-flex flex-column align-items-start justify-content-center">
                        <span class=""> 
                            <span class="badge b-pill badge-green">₡ ${price1}</span>
                            <span class="badge b-pill badge-orange">₡ ${price2}</span>
                            <span class="badge b-pill badge-blue">₡ ${price3}</span>
                        </span>
                        <small class="text-muted">${e.promotion == 0 ? "Sin Descuento":`${e.promotion}%`}</small>
                    </div>
                </td>
                
                <td class="">
                    <div class="d-flex justify-content-center align-items-center">
                        <button type="button" class="btn btn-outline-primary me-2" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="openEditModal('${e.uuid}')"><i class="fa-solid fa-pen"></i> Editar</button>
                        <button type="button" class="btn btn-danger" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="eliminarProducto('${e.uuid}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `);
    } catch (error) {
        console.log(error);
    }
}
function avoidEditablecontents(element){
    if(event.keyCode == 13){
        event.preventDefault();
        let uuid = element.id.split("_")[1];
        let stock = element.innerText;

        if(isNaN(stock)){
            createSwalAlertToast("error", "El valor ingresado no es un número");
            return;
        }
        $.ajax({
            url: "/api/product/stock",
            type: "PUT",
            data: {
                uuid,
                stock
            },
        }).then((data) => {
            if(data.status == "200"){
                createSwalAlertToast("success", "Inventario Actualizado");
                $(element).closest("tr").next().find("div[contentEditable=true]").focus();
            }
        }, (error) => {
            console.log(error);
        });
        return;
    }else{
        // allow only arrow keys, backspace, delete and numbers
        if(event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && event.keyCode != 46 && event.keyCode != 8 && (event.keyCode < 48 || event.keyCode > 57)){
        // if(event.keyCode != 8 && (event.keyCode < 48 || event.keyCode > 57)){
            event.preventDefault();
        }
    }
}
function changeStockValueTable(element){
    let uuid = element.id.split("_")[1];
    let stock = element.innerText;
    let color = "success";
    let notification = g_dataMap.get(uuid).notification;
    if(stock <= notification + 5){
        color = "warning";
    }if(stock <= notification){
        color = "danger";
    }
    $("#color-stock-" + uuid).removeClass("text-success text-warning text-danger");
    $("#color-stock-" + uuid).addClass("text-" + color);
}

function openContextMenu(uuid, element){
    //select the tr element
    let tr = $(element).closest("tr");
    tr.addClass("selected");
    let buttonClick = $(element);
    let position = buttonClick.offset();
    let top = position.top + buttonClick.height() - 10;
    let left = position.left - 150;

    $("#editclick").css({
        top: top,
        left: left
    });
    g_selected = uuid;
    $("#editclick").show();
    // onmouseleave
    $("#editclick").on("mouseleave",() => {
        $("#editclick").hide();
    });
}
function formatInputs(){
    $("#add-precio1").on('keyup', function(evt){
        let val = $(this).val();
        let n = val.replace(/\./g, '');
        n = parseInt(n);
        n = n.toLocaleString('es-ES');
        $(this).val(n);
    });
    $("#add-precio2").on('keyup', function(evt){
        let val = $(this).val();
        let n = val.replace(/\./g, '');
        n = parseInt(n);
        n = n.toLocaleString('es-ES');
        $(this).val(n);
    });
    $("#add-precio3").on('keyup', function(evt){
        let val = $(this).val();
        let n = val.replace(/\./g, '');
        n = parseInt(n);
        n = n.toLocaleString('es-ES');
        $(this).val(n);
    });

}
function agregarProducto(){
    let name = $("#add-name").val();
    let stock = parseInt($("#add-stock").val());
    let price1 = $("#add-precio1").val().replace(/\./g,'');
    let price2 = $("#add-precio2").val().replace(/\./g,'');
    let price3 = $("#add-precio3").val().replace(/\./g,'');

    let price = JSON.stringify({
        price1: price1,
        price2: price2,
        price3: price3
    });
    let bodegas = []
    g_bodegas.forEach(e => {
        bodegas.push({
            nombre: e.nombre,
            cantidad: 0
        })
    })
    let bodega = JSON.stringify(bodegas);

    let category = $("#add-categoria").val();
    let notification = parseInt($("#add-aviso").val());
    let brand = $("#add-marca").val();
    let q = $("#add-q").val();
    let c = $("#add-cantidad").val();
    let cantidad =  c +" "+ q;
    let image = $("#add-imagelink").val();
    let barcode = $("#barcodeResultText").text();
    
    verifyInputs().then(e =>{
        $.ajax({
            url: '/api/product/add',
            method: 'POST',
            data: JSON.stringify({
                name: name,
                stock: stock,
                price: price,
                category: category,
                notification: notification,
                filename: image,
                brand: brand,
                cantidad: cantidad,
                barcode: barcode,
                bodega: bodega
            }),
            contentType: 'application/json'
        }).then((result) => {
            if(result.status === 200){
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer)
                      toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Producto agregado'
                })
                clearInputs();
                moveToList();
                reloadData();
            }
        }, (error) => {
            console.log(error);
        });
    }).catch(e=>{
        createAlert('danger', 'Error', 'Todos los campos son obligatorios.');
    });
}
function verifyInputs(){
    return new Promise((resolve, reject) => {
        let name = $("#add-name").val();
        let stock = parseInt($("#add-stock").val());
        let price1 = $("#add-precio1").val();
        let price2 = $("#add-precio2").val();
        let price3 = $("#add-precio3").val();
        let price = JSON.stringify({
            price1: price1,
            price2: price2,
            price3: price3
        });
        let category = $("#add-categoria").val();
        let notification = parseInt($("#add-aviso").val());
        let brand = $("#add-marca").val();
        let c = $("#add-cantidad").val();
        let image = $("#add-imagelink").val();
        let barcode = $("#barcodeResult").find("#barcodeResultText").text();
        if(barcode === '' || image === '' || name === '' || stock === '' || price1 === '' || price2 === '' || price3 === '' || category === '' || notification === '' || brand === '' || c === ''){
            reject();
        }else{
            resolve();
        }
    });
}
function createAlert(type, title, text){
    $("#alert").html(`
        <div class="alert alert-${type} alert-dismissible fade show animate__animated animate__fadeIn" role="alert">
            <i class="fa-solid fa-triangle-exclamation"></i> <b>${title}</b> ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `);
    setTimeout(() => {
        $("#alert .alert").removeClass("animate__fadeIn");
    },1000);
    setTimeout(() => {
        animateCSS('#alert', 'fadeOut', () => {
            $("#alert").html('');
        });
    }, 5000);
}
function moveToList(){
    $("#lista-productos").trigger('click');
}
function clearInputs(){
    $("#add-name").val('');
    $("#add-stock").val('');
    $("#add-precio").val('');
    $("#add-categoria").val('');
    $("#add-aviso").val('');
    $("#add-marca").val('');
    $("#add-q").val('');
}
function runTooltips(){
    tippy('.aviso-tooltip', {
        content: `Cuando el producto llegue a esta cantidad, se mostrará el mensaje de "Producto agotado" en el listado de productos y en la página del producto.<br>Se notificará al administrador por correo electrónico.`,
        allowHTML: true,
        placement: 'top-start',
        theme: 'dark-custom',
        interactive: true,
        animation: 'shift-away-extreme',
    });
    tippy('.cat-1', {
        content: `Precio de venta para clientes normales.`,
        allowHTML: true,
        placement: 'top-start',
        theme: 'dark-custom',
        interactive: true,
        animation: 'shift-away-extreme',
    });
    tippy('.cat-2', {
        content: `Precio de venta para clientes regulares.`,
        allowHTML: true,
        placement: 'top-start',
        theme: 'dark-custom',
        interactive: true,
        animation: 'shift-away-extreme',
    });
    tippy('.cat-3', {
        content: `Precio de venta para clientes VIP.`,
        allowHTML: true,
        placement: 'top-start',
        theme: 'dark-custom',
        interactive: true,
        animation: 'shift-away-extreme',
    });
}
function zoomImages(){
    $('.hover-img').on('click', function(){
        // open imagepreview modal -> bootstrap 5
        $('#image-preview-src').attr('src', $(this).attr('src'));
        modalImagePreview.show();
        
    });
}
function checkRatioFilter(){
    $("[data-type='ratio-filter']").on('click', function(e){
        let val = $(this).attr('id').split("-")[1];
        // $(this).addClass('active').siblings().removeClass('active');
        if(val == "all") val = "";
        g_filter.set("ratio", val);
        searchonTable();
    });
}
function datatables(){
    $("#table").DataTable({
        responsive: true,
        select: true,
        keys: false,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdf',
                text: '<i class="fa-solid fa-print text-secondary"></i> Exportar PDF',
                titleAttr: 'Exportar a PDF',
                className: 'btn btn-white me-3',
            },{
                extend: 'excel',
                text: '<i class="fa-solid fa-file-excel text-secondary"></i> Exportar Excel',
                titleAttr: 'Exportar a Excel',
                className: 'btn btn-white',
            },
        ],
        order: [[ 2, "asc" ]],
        "scrollY": "600px",
        "scrollCollapse": true,
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay productos",
            "info":           "Mostrando _END_ de _TOTAL_ productos ",
            select: {
                rows: {
                    _: "",
                    0: "",
                    1: ""
                }
            },
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 productos",
            "infoFiltered":   "(Filtrado de _MAX_ productos totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Mostrando _MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron productos similares",
            "paginate": {
                "first": '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next": '<i class="fas fa-angle-right"></i>',
                "last": '<i class="fas fa-angle-double-right"></i>'
            },
            "aria": {
                "paginate": {
                    "first": '<i class="fas fa-angle-double-left"></i>',
                    "previous": '<i class="fas fa-angle-left"></i>',
                    "next": '<i class="fas fa-angle-right"></i>',
                    "last": '<i class="fas fa-angle-double-right"></i>'
                }
            }
        },
        lengthMenu: [
            [ 10, 50, 100, -1 ],
            [ '10', '50', '100', 'Todos' ]
        ],
        responsive: {
            details: {
                type: 'column',
                target: 'tr',
                renderer: function ( api, rowIdx, columns ) {
                    var data = $.map( columns, function ( col, i ) {
                        return col.hidden ?`
                                <tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}" style="min-width:200px;">
                                    <td class="fw-bold">${col.title}:</td>
                                    <td>${col.data}</td>
                                </tr>
                                `:'';
                    } ).join('');
                    return data ?
                        $('<table/>').append( data ) :
                        false;
                }
            },
        }
    });
    $('#info').html('');
    $('#length').html('');
    $('#pagination').html('');

    $('#table_info').appendTo('#info');
    $('#table_length').appendTo('#length');
    $('#table_filter').css('display', 'none');
    $('#table_paginate').appendTo('#pagination');
    $('.buttons-pdf').appendTo('#button-group');
    $('.buttons-excel').appendTo('#button-group');
    $('#barraBuscar').on('keyup', function(){
        let val = $(this).val();
        g_filter.set("search", val);
        searchonTable();
    });
    
}

function createSwalAlert(type, title, text){
    Swal.fire({
        icon: type,
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 1500
    });
}
function createSwalAlertToast(type, text){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
    Toast.fire({
        icon: type,
        text: text,
        showClass: {
            popup: 'animate__animated animate__fadeInRight'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutRight'
        }
    })
}

function searchonTable(){
    var table = $("#table").DataTable();
    let search = "";
    g_filter.forEach((value, key) => {
        search += value + " ";
    });
    table.search(search).draw();
}

function searchScaner(name){
    var table = $("#table").DataTable();
    table.search(name).draw();
}

document.addEventListener("DOMContentLoaded", init);