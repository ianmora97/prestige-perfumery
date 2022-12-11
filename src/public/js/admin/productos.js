var g_filter = new Map();
var myDropzone;

//* Modals
const modalImagePreview = new bootstrap.Modal('#imagepreview')

function init(){
    formatInputs();
    runTooltips();
    checkRatioFilter();
    animateSlides();
    changeSlides();
    dropzoneLoad();
    
    brignData();
}
function brignData(){
    $.ajax({
        url: '/api/product/all',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        fillProductos(result);
    }, (error) => {
        console.log(error);
    });
}
function fillProductos(data){
    $("#tbody").html("");
    data.forEach((item) => {
        addRow(item);
    });
    datatables();
    zoomImages();
}
function addRow(e){
    $("#tbody").append(`
        <tr>
            <td class="align-middle">
                <div class="d-flex justify-content-center align-items-center" role="button">
                    <img src="/upload/productos/${e.image}" width="60px" alt="" class="img-fluid hover-img img-round">
                </div>
            </td>
            <td class="align-middle">${e.code}</td>
            <td class="align-middle">${e.name}</td>
            <td class="align-middle"><span class="badge b-pill badge-${e.category == "hombre" ? "green":"orange"}">${e.category}</span></td>
            <td class="align-middle">${e.price}</td>
            <td class="align-middle">${e.stock}</td>
        </tr>
    `);
}
function formatInputs(){
    $("#add-precio").on('keyup', function(evt){
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
    let price = $("#add-precio").val();
    let category = $("#add-categoria").val();
    let notification = parseInt($("#add-aviso").val());
    let image = filename;
    if(name === '' || stock === '' || price === '' || category === '' || notification === ''){
        alert('Todos los campos son obligatorios');
        return;
    }else{
        $.ajax({
            url: '/api/product/add',
            method: 'POST',
            data: JSON.stringify({
                name: name,
                stock: stock,
                price: price,
                category: category,
                notification: notification,
                filename: image
            }),
            contentType: 'application/json'
        }).then((result) => {
            if(result.status === 200){
                clearInputs();
            }
        }, (error) => {
            console.log(error);
        });
    }
}
function clearInputs(){
    $("#add-name").val('');
    $("#add-stock").val('');
    $("#add-precio").val('');
    $("#add-categoria").val('');
    $("#add-aviso").val('');
    myDropzone.removeAllFiles();
}
function runTooltips(){
    // tippy JS
    // aviso-tooltip
    tippy('#aviso-tooltip', {
        content: `Cuando el producto llegue a esta cantidad, se mostrará el mensaje de "Producto agotado" en el listado de productos y en la página del producto.<br>Se notificará al administrador por correo electrónico.`,
        allowHTML: true,
        placement: 'top-start',
        theme: 'light-custom',
        interactive: true,
        animation: 'shift-away-extreme',
        trigger: 'click',
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
    myDropzone = new Dropzone("#dropArea", {
        autoProcessQueue: false,
        parallelUploads: 1,
        url: "/api/product/addimage",
        method: "post",
        maxFiles: 1,
        maxFilesize: 5,
        thumbnailWidth: 180,
        thumbnailHeight: 180,
        init: function() {
            myDropzone = this;
            this.on("addedfile", function(file) {
                // this.processFile(file);
                $('#borrar-imagen-drop').show();
                $('#borrar-imagen-drop').addClass('d-block');

            });
            // on success
            this.on("success", function(file, response) {
                agregarProducto(response.data.filename);
            });
        }
    });
    $('#btn-agregar').on('click',function(){
        myDropzone.processQueue();
    });
    $('#borrar-imagen-drop').on('click',function(){
        myDropzone.removeAllFiles();
        $('#borrar-imagen-drop').hide();
        $('#borrar-imagen-drop').removeClass('d-block');
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
        select: false,
        keys: true,
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
        "scrollY": "600px",
        "scrollCollapse": true,
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay productos",
            "info":           "Mostrando _END_ de _TOTAL_ productos",
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
        // columnDefs: [
        //     { targets: [0, 6], orderable: false,},
        //     { targets: '_all', orderable: true }
        // ]
    });
    $('#table_info').appendTo('#info');
    $('#table_length').appendTo('#length');
    // $('#table_length').css('display', 'none');

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