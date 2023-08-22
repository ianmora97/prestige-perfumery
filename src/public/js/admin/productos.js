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

function init(){
    formatInputs();
    runTooltips();
    checkRatioFilter();
    imagelinkload();
    brignData();
    brignDataBodegas();
    onTabsImageAdd();
    eventListeners();
}

function brignDataBodegas(){
    $.ajax({
        url: '/api/bodega/all',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        g_bodegas = result;
    }, (error) => {
        console.log(error);
    });
}
function eventListeners(){
    $("#btn-agregar").on('click', function(){
        agregarProducto();
    });
    $("#add-preciogeneral").on('keyup', function(e){
        var precioActual = parseInt($(this).val());
        let precios = prices(precioActual);
          
        $("#add-precio1").val(precios.p1);
        $("#add-precio2").val(precios.p2);
        $("#add-precio3").val(precios.p3);

    });
}
function prices(precioActual){
    precioActual = ((precioActual) + (precioActual * 0.3)) * TIPODECAMBIO;
    const [a, b, c] = [100, 98 ,96];
    function roundToNearestHundred(number) {
        return Math.round(number / 100) * 100;
    }
    function formatNumberWithCommas(number) {
        return number.toLocaleString('es-ES');
    }
    return {
        p1: formatNumberWithCommas(roundToNearestHundred(precioActual * a / 100)),
        p2: formatNumberWithCommas(roundToNearestHundred(precioActual * b / 100)),
        p3: formatNumberWithCommas(roundToNearestHundred(precioActual * c / 100))
    }
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
            readers: ['upc_reader', 'ean_reader'],
        },
        locate: false,
    }, function(err) {
        if (err) {
            console.log("ERROR",err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });
    Quagga.onDetected(function(data){
        console.log(data.codeResult)
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
        fillStats(result);
        fillProductos(result);
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

    $("#edit-name").val(prod.name);
    $("#edit-marca").val(prod.brand);
    $("#edit-type").val(prod.type);

    let precios = prices(prod.price);

    $("#edit-precio1").val(precios.p1);
    $("#edit-precio2").val(precios.p2);
    $("#edit-precio3").val(precios.p3);

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

    iterateonBodegas(g_bodegas, prod.id)

    $("#editModalLabel").html(`
        <h5 class="mb-0"><i class="fa-solid fa-box-open text-primary"></i> Editar Producto<br></h5>
        <small class="text-dark-100" id="update-modal-uuid">${prod.uuid}</small>
    `);
    editModal.show();
}
function iterateonBodegas(bodegas, productoid){
    let arr = bodegas;
    $("#bodegas-list-update").html("");
    g_bodegas.forEach((bodega,i) => {
        axios.get(`/api/bodega/producto/get?bodega=${bodega.id}&producto=${productoid}`)
        .then(result => {
            result = result.data;

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
                        <input type="number" class="form-control updateProductoBodega" placeholder="Cantidad de productos en ${bodegaName}" 
                        id="bodega-${bodegaId}" value="${result.cantidad}"
                        data-bodega="${bodega.id}" data-producto="${productoid}" onkeyup="verifyStockByBodega(this)">
                    </div>
                </div>
            `);
        });
    });
}
function verifyStockByBodega(input){
    let suma = 0;
    let stock = parseInt($("#edit-stock").val());
    $(".updateProductoBodega").each((item,elem)=>{
        let cant = parseInt($(elem).val());
        suma += cant;
    });
    let diferencia = stock - suma;
    if(diferencia == 0){
        $("#edit-product").prop("disabled", false);
        $("#alertInventarioBodega").html(`
            <div class="alert alert-success fade show" role="alert">
                Tiene pendiente 0 productos
            </div>
        `);
        setTimeout(() => {
            $("#alertInventarioBodega").html(``);
        }, 2000);
    }else if(diferencia > 0){
        $("#edit-product").prop("disabled", false);
        $("#alertInventarioBodega").html(`
            <div class="alert alert-warning fade show" role="alert">
                Tiene pendiente ${diferencia} producto${diferencia == 1 ? "" : "s"}
            </div>
        `);
    }else{
        $("#edit-product").prop("disabled", true);
        $("#alertInventarioBodega").html(`
            <div class="alert alert-danger fade show" role="alert">
                Tiene ${diferencia} producto${diferencia == 1 ? "" : "s"} mas
            </div>
        `);

    }
}
function updateProductoBodega(){
    let arr = [];
    $(".updateProductoBodega").each((item,elem)=>{
        const cant = $(elem).val();
        const producto = $(elem).data('producto');
        const bodega = $(elem).data('bodega');
        arr.push({
            producto: parseInt(producto),
            bodega: parseInt(bodega),
            cantidad: parseInt(cant)
        });
    });
    axios.put(`/api/bodega/producto/update`,{
        arr
    }).then(result => {
    });
}
function updateProduct(){
    // #update-modal-uuid

    updateProductoBodega();
    let uuid = $("#update-modal-uuid").html();
    let prod = g_dataMap.get(uuid);

    let price = $("#edit-preciogeneral").val();

    // get nombre, marca, categoria, stock, aviso, cantidad, q, promotion, imag
    
    let nombre = $("#edit-name").val();
    let marca = $("#edit-marca").val();
    let type = $("#edit-type").val();
    let category = $("#edit-categoria").val();
    let stock = parseInt($("#edit-stock").val());
    let aviso = parseInt($("#edit-aviso").val());
    let c = $("#edit-cantidad").val();
    let q = $("#edit-q").val();
    let promotion = $("#edit-promotion").val();
    let image = $("#edit-image-path").val();

    let barcode = $("#edit-barcode").val();

    let cantidad =  c +" "+ q;

    let data = {
        id: prod.id,
        name: nombre,
        brand: marca,
        type: type,
        category: category,
        stock: stock,
        notification: aviso,
        cantidad: cantidad,
        promotion: promotion,
        filename: image,
        price: price,
        barcode: barcode
    };
    verifyEditInputs().then(() => {
        $.ajax({
            url: '/api/product/update',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).then((result) => {
            reloadData();
            editModal.hide();
            Toastify({
                text: "Producto Actualizado",
                duration: 3000,
                className: "gray-light text-dark",
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
            }).showToast();
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
        let {p1, p2, p3} = prices(e.price);

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
                        <img src="${e.image}" width="50px" height="50px" alt="" class="hover-img img-round">
                    </div>
                </td>
                <td><span class="text-primary">${e.barcode}</span></td>
                <td class="">
                    <div class="d-flex flex-column align-items-start justify-content-start">
                        <span class="fw-bold lead">${e.name}</span>
                        <span class="text-muted">${e.brand}</span>
                    </div>
                </td>
                <td class="">${e.type}</td>
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
                <td class="" data-search="${p1} - ${p2} - ${p3}">
                    <div class="d-flex align-items-center justify-content-start gap-2">
                        <span class="badge b-pill badge-green">₡ ${p1}</span>
                        <span class="badge b-pill badge-orange">₡ ${p2}</span>
                        <span class="badge b-pill badge-blue">₡ ${p3}</span>
                    </div>
                    <small class="text-muted">${e.promotion == 0 ? "Sin Descuento":`<span class="text-dark">${e.promotion}% de descuento</span>`}</small>
                </td>
                
                <td class="">
                    <div class="d-flex justify-content-center align-items-center">
                        <button type="button" class="btn btn-dark-100 me-2" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="openEditModal('${e.uuid}')"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn btn-dark" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="eliminarProducto('${e.uuid}')"><i class="fa-solid fa-trash-can"></i></button>
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
        let item = g_dataMap.get(uuid);
        let notification = item.notification;

        if(isNaN(stock)){
            createSwalAlertToast("error", "El valor ingresado no es un número");
            return;
        }
        $.ajax({
            url: "/api/product/stock",
            type: "PUT",
            data: {
                uuid,
                stock,
                notification
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
    $("#add-precio1").on('keyup change', function(evt){
        let val = $(this).val();
        let n = val.replace(/\./g, '');
        n = parseInt(n);
        n = n.toLocaleString('es-ES');
        $(this).val(n);
    });
    $("#add-precio2").on('keyup change', function(evt){
        let val = $(this).val();
        let n = val.replace(/\./g, '');
        n = parseInt(n);
        n = n.toLocaleString('es-ES');
        $(this).val(n);
    });
    $("#add-precio3").on('keyup change', function(evt){
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

    let category = $("#add-categoria").val();
    let notification = parseInt($("#add-aviso").val());
    let brand = $("#add-marca").val();
    let type = $("#add-type").val();
    let q = $("#add-q").val();
    let c = $("#add-cantidad").val();
    let cantidad =  c +" "+ q;
    let image = $("#add-imagelink").val();
    let barcode = $("#barcodeResultText").text();

    if(barcode == ""){
        barcode = $("#add-codigobarrasManual").val();
    }
    
    verifyInputs().then(e =>{
        $.ajax({
            url: '/api/product/add',
            method: 'POST',
            data: JSON.stringify({
                name: name,
                stock: stock,
                price: price,
                type: type,
                category: category,
                notification: notification,
                filename: image,
                brand: brand,
                cantidad: cantidad,
                barcode: barcode
            }),
            contentType: 'application/json'
        }).then((result) => {
            if(result.status === 200){
                createBodegaProducto(result.data);
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
function createBodegaProducto(data){
    let arr = [];
    g_bodegas.forEach(e=>{
        arr.push({
            producto: data.id,
            bodega: e.id,
            cantidad: 0
        })
    });
    axios.post('/api/bodega/producto/add',{arr});
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
        let type = $("#add-type").val();
        let c = $("#add-cantidad").val();
        let image = $("#add-imagelink").val();
        let barcode = $("#barcodeResult").find("#barcodeResultText").text();
        if(barcode === '' || image === '' || name === '' || type === '' || stock === '' || price1 === '' || price2 === '' || price3 === '' || category === '' || notification === '' || brand === '' || c === ''){
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
    $("#add-marca").val('');
    $("#add-type").val('');
    $("#add-stock").val('');
    $("#add-precio1").val('');
    $("#add-precio2").val('');
    $("#add-precio3").val('');
    $("#add-categoria").val('unisex');
    $("#add-stock").val('');
    $("#add-aviso").val('');
    $("#add-cantidad").val('');
    $("#add-imagelink").val('');
    $("#add-codigobarrasManual").val('');
    $("#imagepreviewlink").empty();
    $("#barcodeResult").empty();
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
        select: false,
        keys: false,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdf',
                text: '<i class="fa-solid fa-print text-dark"></i> Exportar PDF',
                titleAttr: 'Exportar a PDF',
                className: 'btn btn-white me-3',
            },{
                extend: 'excel',
                text: '<i class="fa-solid fa-file-excel text-dark"></i> Exportar Excel',
                titleAttr: 'Exportar a Excel',
                className: 'btn btn-white',
            },
        ],
        order: [[ 2, "asc" ]],
        "scrollY": "700px",
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