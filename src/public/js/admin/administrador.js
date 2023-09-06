var g_filter = new Map();
var g_dataMap = new Map();
var g_data = [];

var modalAgregarAdmin = document.getElementById('agregarAdminModal');
const agregarAdminModal = new bootstrap.Modal('#agregarAdminModal');

var modaleditarAdmin = document.getElementById('editarAdminModal');
const editarAdminModal = new bootstrap.Modal('#editarAdminModal');


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
        url: '/api/user/all',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' seg' : a + ' segs';
        $("#lastUpdated").html(t);
        fillStats(result);
        
        fillAdmins(result);
    }, (error) => {
        console.log(error);
    });
}
function fillStats(data){
    $("#totalitems").html(data.length);
}
function fillAdmins(data){
    $("#tbody").html("");
    g_data = data;
    data.forEach((item) => {
        g_dataMap.set(item.id, item);
        addRow(item);
    });
    datatables();
}
function addRow(e){
    let rol = "Administrador";
    let color = "orange";
    if(e.rol == 4){
        rol = "Administrador con Derechos";
        color = "green";
    }else if(e.rol == 5){
        rol = "Super Administrador";
        color = "red";
    }
    $("#tbody").append(`
        <tr>
            <td class="text-center">
                <span class="text-primary">#${e.id}</span>
            </td>
            <td class="">
                <div class="d-flex justify-content-start align-items-center">
                    <img src="${e.photo}" class="rounded-circle me-3" width="30" height="30" alt="profile picture">
                    ${e.name}
                </div>
            </td>
            <td class="">${e.username}</td>
            <td class="">
                <a href="mailto:${e.email}" class="text-decoration-none text-blue">${e.email}</a>
            </td>
            <td class="">
                <span class="badge bg-${color}">${rol}</span>
            </td>
            <td class="">
                <div class="d-flex justify-content-center align-items-center">
                    <button type="button" class="btn btn-outline-primary me-2" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="openEditModal('${e.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
                    <button type="button" class="btn btn-danger" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="deleteAdmin('${e.id}')"><i class="fa-solid fa-trash-can"></i></button>
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
        order: [[ 2, "asc" ]],
        "scrollY": "600px",
        "scrollCollapse": true,
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay administradores",
            "info":           "Mostrando _END_ de _TOTAL_ administradores ",
            select: {
                rows: {
                    _: "",
                    0: "",
                    1: ""
                }
            },
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 administradores",
            "infoFiltered":   "(Filtrado de _MAX_ administradores totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Mostrando _MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron administradores similares",
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
    // $('#table_length').css('display', 'none');
    $('#table_filter').css('display', 'none');
    $('#table_paginate').appendTo('#pagination');
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
function agregarUsuario(){
    let name = $("#add-name").val();
    let username = $("#add-username").val();
    let email = $("#add-email").val();
    let rol = $("#add-rol").val();

    if(name == "" || username == "" || email == "" || rol == ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }else{
        let data = {
            name: name,
            username: username,
            email: email,
            rol: parseInt(rol)
        }
        $.ajax({
            url: '/api/user/add',
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).then((result) => {
            if(result.status === 200){
                agregarAdminModal.hide();
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
                    title: 'Administrador agregado'
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
    $("#add-name").val("");
    $("#add-username").val("");
    $("#add-email").val("");
    $("#add-rol").val("");
}

// ! ====================  ELIMINAR CLIENTE ==================== ! //
function deleteAdmin(id){
    Swal.fire({
        title: '¿Desea eliminar el administrador?',
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
                url: '/api/user/delete',
                method: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: id
                })
            }).then((result) => {
                reloadData();
                Swal.fire({
                    title: 'Administrador eliminado',
                    text: 'El administrador ha sido eliminado correctamente',
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
// TODO ====================  EDITAR CLIENTE ==================== ! //
function openEditModal(id){
    let user = g_dataMap.get(parseInt(id));
    $("#edit-name").val(user.name);
    $("#edit-username").val(user.username);
    $("#edit-email").val(user.email);
    $("#edit-rol").val(user.rol);

    $("#editarAdminModalLabel").html(`
        <h5 class="mb-0"><i class="fa-solid fa-user text-secondary"></i> Editar Usuario<br></h5>
        <small class="text-muted" id="update-modal-id">${id}</small>
    `);

    editarAdminModal.show();
}
function actualizarUsuario(){
    let id = $("#update-modal-id").html();
    let name = $("#edit-name").val();
    let username = $("#edit-username").val();
    let email = $("#edit-email").val();
    let rol = $("#edit-rol").val();

    if(name == "" || username == "" || email == "" || rol == ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }else{
        let data = {
            id: parseInt(id),
            name: name,
            username: username,
            email: email,
            rol: parseInt(rol)
        }
        $.ajax({
            url: '/api/user/update',
            method: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).then((result) => {
            if(result.status === 200){
                editarAdminModal.hide();
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
                    title: 'Administrador actualizado'
                })
                clearInputs();
                reloadData();
            }
        }, (error) => {
            console.log(error);
        }); 
    }
}

document.addEventListener("DOMContentLoaded", init);