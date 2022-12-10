var g_filter = new Map();

function init(){
    datatables();
    checkRatioFilter();
    animateSlides();
    changeSlides();
    dropzoneLoad();
}
function dropzoneLoad(){
    var myDropzone = new Dropzone("#dropArea", {
        autoProcessQueue: false,
        parallelUploads: 1,
        url: "/uploadImage",
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

        }
    });
    // $('#uploadfiles').click(function(){
    //     myDropzone.processQueue();
    // });
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