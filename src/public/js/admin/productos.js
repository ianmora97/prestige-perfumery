function init(){
    datatables();
}

function datatables(){
    $("#table").DataTable({
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay productos",
            "info":           "Mostrando _END_ de _TOTAL_ productos",
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 productos",
            "infoFiltered":   "(Filtrado de _MAX_ productos totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "_MENU_",
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
	    "lengthMenu": [30, 50, 100, 500],
        // columnDefs: [
        //     { targets: [0, 6], orderable: false,},
        //     { targets: '_all', orderable: true }
        // ]
    });
    $('#table_info').appendTo('#info');
    $('#table_length').appendTo('#length');

    $('#table_filter').css('display', 'none');

    $('#table_paginate').appendTo('#pagination');

    $('#barraBuscar').on('keyup', function(){
        let table = $('#table').DataTable();
        let val = $(this).val();
        let result = table.search(val).draw();
    });
}

document.addEventListener("DOMContentLoaded", init);