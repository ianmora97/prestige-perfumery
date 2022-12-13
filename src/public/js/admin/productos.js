var g_filter = new Map();
var g_dataMap = new Map();
var g_data = [];

var dropzoneAgregar;
var dropzoneActualizar;

var g_selected = "";
//* Modals
const modalImagePreview = new bootstrap.Modal('#imagepreview')
const editModal = new bootstrap.Modal('#editModal')

function init(){
    formatInputs();
    runTooltips();
    checkRatioFilter();
    animateSlides();
    changeSlides();
    dropzoneLoad();
    
    brignData();
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
function openEditModal(){
    let prod = g_dataMap.get(g_selected);

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
    $("#edit-image").attr("src", "/upload/productos/" + prod.image);

    $("#editModalLabel").html(`
        <h5 class="mb-0"><i class="fa-solid fa-box-open text-secondary"></i> Editar Producto<br></h5>
        <small class="text-muted">${prod.uuid}</small>
    `);


    editModal.show();
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
    let {price1, price2, price3} = JSON.parse(e.price);
    let color = "success";
    if(e.stock <= e.notification + 5){
        color = "warning";
    }if(e.stock <= e.notification){
        color = "danger";
    }
    console.log(e.stock, e.notification)
    $("#tbody").append(`
        <tr>
            <td class="">
                <div class="d-flex justify-content-center align-items-center" role="button">
                    <img src="/upload/productos/${e.image}" width="60px" alt="" class="img-fluid hover-img img-round">
                </div>
            </td>
            <td class="">${e.code}</td>
            <td class="">
                <div class="d-flex flex-column align-items-start justify-content-start">
                    <span class="fw-bold lead">${e.name}</span>
                    <span class="text-muted">${e.brand}</span>
                </div>
            </td>
            <td class="">${e.cantidad}</td>
            <td class=""><span class="badge b-pill badge-blue">${_.capitalize(e.category)}</span></td>
            <td class="">
                ${e.stock} <i class="fa-solid fa-circle fa-2xs text-${color}"></i>
            </td>
            <td class="">
                <div class="d-flex flex-column align-items-start justify-content-center">
                    <span class=""> 
                        <span class="badge b-pill badge-green">A ₡ ${price1}</span>
                        <span class="badge b-pill badge-orange">B ₡ ${price2}</span>
                        <span class="badge b-pill badge-blue">C ₡ ${price3}</span>
                    </span>
                    <small class="text-muted">${e.promotion == 0 ? "Sin Descuento":`${e.promotion}%`}</small>
                </div>
            </td>
            
            <td class="">
                <button class="btn btn-sm btn-white" onclick="openContextMenu('${e.uuid}', this)">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
            </td>
        </tr>
    `);
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
function agregarProducto(filename){
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
    console.log(price);

    let category = $("#add-categoria").val();
    let notification = parseInt($("#add-aviso").val());
    let brand = $("#add-marca").val();
    let q = $("#add-q").val();
    let c = $("#add-cantidad").val();
    let cantidad =  c +" "+ q;
    let image = filename;
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
            cantidad: cantidad
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
}
function verifyInputs(){
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
    if(name === '' || stock === '' || price1 === '' || price2 === '' || price3 === '' || category === '' || notification === '', brand === '', c === ''){
        createAlert('danger', 'Error', 'Todos los campos son obligatorios.');
        return false;
    }
    return true;
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
    dropzoneAgregar.removeAllFiles();
}
function runTooltips(){
    tippy('.aviso-tooltip', {
        content: `Cuando el producto llegue a esta cantidad, se mostrará el mensaje de "Producto agotado" en el listado de productos y en la página del producto.<br>Se notificará al administrador por correo electrónico.`,
        allowHTML: true,
        placement: 'top-start',
        theme: 'light-custom',
        interactive: true,
        animation: 'shift-away-extreme',
    });
    tippy('.cat-1', {
        content: `Precio de venta para clientes normales.`,
        allowHTML: true,
        placement: 'top-start',
        theme: 'light-custom',
        interactive: true,
        animation: 'shift-away-extreme',
    });
    tippy('.cat-2', {
        content: `Precio de venta para clientes regulares.`,
        allowHTML: true,
        placement: 'top-start',
        theme: 'light-custom',
        interactive: true,
        animation: 'shift-away-extreme',
    });
    tippy('.cat-3', {
        content: `Precio de venta para clientes VIP.`,
        allowHTML: true,
        placement: 'top-start',
        theme: 'light-custom',
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
function dropzoneLoad(){
    dropzoneAgregar = new Dropzone("#dropArea", {
        autoProcessQueue: false,
        parallelUploads: 1,
        url: "/api/product/addimage",
        method: "post",
        maxFiles: 1,
        maxFilesize: 5,
        thumbnailWidth: 180,
        thumbnailHeight: 180,
        init: function() {
            dropzoneAgregar = this;
            this.on("addedfile", function(file) {
                $('#borrar-imagen-drop').show();
                $('#borrar-imagen-drop').addClass('d-block');

            });
            this.on("success", function(file, response) {
                agregarProducto(response.data.filename);
            });
        }
    });
    $('#btn-agregar').on('click',function(){
        if(verifyInputs()){
            dropzoneAgregar.processQueue();
        }
    });
    $('#borrar-imagen-drop').on('click',function(){
        dropzoneAgregar.removeAllFiles();
        $('#borrar-imagen-drop').hide();
        $('#borrar-imagen-drop').removeClass('d-block');
    });
    // TODO: Dropzone para actualizar la imagen del producto
    dropzoneActualizar = new Dropzone("#dropArea2", {
        autoProcessQueue: false,
        parallelUploads: 1,
        url: "/api/product/replaceImage",
        method: "post",
        maxFiles: 1,
        maxFilesize: 6,
        thumbnailMethod: 'crop',
        acceptedFiles: 'image/jpeg, image/png, image/jpg',
        thumbnailWidth: 250,
        thumbnailHeight: 250,
        // resize
        resizeWidth: 250,
        resizeHeight: 250,
        resizeMethod: 'crop',
        resizeQuality: 1,

        init: function() {
            dropzoneActualizar = this;
            this.on("addedfile", function(file) {
                $('#borrar-imagen-drop-actualizar').show();
                $('#borrar-imagen-drop-actualizar').addClass('d-block');
            });
            this.on("success", function(file, response) {
                actualizarProducto(response.data.filename);
            });
        }
    });
    $('#btn-actualizar').on('click',function(){
        dropzoneActualizar.processQueue();
    });
    $('#borrar-imagen-drop-actualizar').on('click',function(){
        dropzoneActualizar.removeAllFiles();
        $('#borrar-imagen-drop-actualizar').hide();
        $('#borrar-imagen-drop-actualizar').removeClass('d-block');
    });
}
function animateSlides(){
    animateCSS("#product-list", "fadeIn");
}
function changeSlides(){
    $("#agregar-producto").on('click', function(e){
        $("#product-add").addClass('active fadeInOpacity');
        $("#product-list").addClass('active fadeOutOpacity');

        $("#agregar-producto").attr('disabled', true);
        $("#agregar-producto").addClass('disabled');
    });
    $("#lista-productos").on('click', function(e){
        $("#product-add").removeClass('active fadeInOpacity').addClass('fadeOutOpacity');
        $("#product-list").removeClass('active fadeOutOpacity').addClass('fadeInOpacity');

        setTimeout(() => {
            $("#product-add").removeClass('fadeOutOpacity');
            $("#product-list").removeClass('fadeInOpacity');
        }, 1000);

        $("#agregar-producto").attr('disabled', false);
        $("#agregar-producto").removeClass('disabled');
    });
}
function checkRatioFilter(){
    $("[data-type='ratio-filter']").on('click', function(e){
        let val = $(this).attr('id').split("-")[1];
        $(this).addClass('active').siblings().removeClass('active');
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

function searchonTable(){
    var table = $("#table").DataTable();
    let search = "";
    g_filter.forEach((value, key) => {
        search += value + " ";
    });
    table.search(search).draw();
}

document.addEventListener("DOMContentLoaded", init);