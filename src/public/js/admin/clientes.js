var g_filter = new Map();
var g_dataMap = new Map();
var g_data = [];


var modalAgregarCliente = document.getElementById('agregarClienteModal');
const agregarClienteModal = new bootstrap.Modal('#agregarClienteModal');


function init(){
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
        url: '/api/cliente/all',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' seg' : a + ' segs';
        $("#lastUpdated").html(t);
        fillStats(result);
        
        fillClientes(result);
    }, (error) => {
        console.log(error);
    });
}
function fillStats(data){
    $("#totalitems").html(data.length);
}
function fillClientes(data){
    $("#tbody").html("");
    g_data = data;
    data.forEach((item) => {
        g_dataMap.set(item.id, item);
        addRow(item);
    });
    datatables();
}
function addRow(e){
    
    $("#tbody").append(`
        <tr>
            <td class="">
                <span class="text-primary">#${e.id}</span>
            </td>
            <td class="">${e.nombre}</td>
            <td class="">${e.cedula}</td>
            <td class="">
                <a href="tel:${e.phone}" class="text-decoration-none text-blue">${e.phone}</a>
            </td>
            <td class="">
                <div class="d-flex justify-content-center align-items-center">
                    <button type="button" class="btn btn-outline-primary me-2" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="openEditModal('${e.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
                    <button type="button" class="btn btn-danger" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="eliminarCliente('${e.id}')"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        </tr>
    `);
}
function datatables(){
    $("#table").DataTable({
        responsive: true,
        select: true,
        keys: false,
        order: [[ 1, "asc" ]],
        "scrollY": "600px",
        "scrollCollapse": true,
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay clientes",
            "info":           "Mostrando _END_ de _TOTAL_ clientes ",
            select: {
                rows: {
                    _: "",
                    0: "",
                    1: ""
                }
            },
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 clientes",
            "infoFiltered":   "(Filtrado de _MAX_ clientes totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Mostrando _MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron clientes similares",
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
    $('#barraBuscar').on('keyup', function(){
        let val = $(this).val();
        g_filter.set("search", val);
        searchonTable();
    });
    
}

function agregarCliente(){
    let nombre = $("#add-nombre").val();
    let cedula = $("#add-cedula").val();
    let phone = $("#add-numero").val();
    let direction = $("#add-direccion").val();
    let email = $("#add-email").val();

    let data = {
        nombre: nombre,
        cedula: cedula,
        phone: phone,
        direction: direction,
        email: email
    };
    if(nombre == "" || cedula == ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe llenar los campos obligatorios',
        });
        return;
    }else{
        $.ajax({
            url: '/api/cliente/add',
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).then((result) => {
            if(result.status === 200){
                agregarClienteModal.hide();
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
                    title: 'Cliente agregado'
                })
                clearInputs();
                reloadData();
            }
        }, (error) => {
            console.log(error);
        });
    }
}
function clearInputs(){
    $("#add-nombre").val("");
    $("#add-cedula").val("");
    $("#add-numero").val("");
    $("#add-direccion").val("");
    $("#add-email").val("");
}
// ! ====================  ELIMINAR CLIENTE ==================== ! //
function eliminarCliente(id){
    Swal.fire({
        title: '¿Desea eliminar el cliente?',
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
                url: '/api/cliente/delete',
                method: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: id
                })
            }).then((result) => {
                reloadData();
                Swal.fire({
                    title: 'Cliente eliminado',
                    text: 'El Cliente ha sido eliminado correctamente',
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
document.addEventListener('DOMContentLoaded', init);