var g_filter = new Map();
var g_dataMap = new Map();
var g_data = [];

var g_clientData = new Map();

var g_productosData = new Map();


var modalAgregarPedido = document.getElementById('agregarPedidoModal');
const agregarPedidoModal = new bootstrap.Modal('#agregarPedidoModal');

var modalverPedido = document.getElementById('verPedidoModal');
const verPedidoModal = new bootstrap.Modal('#verPedidoModal');


function init(){
    brignData();
    brignClients();
    brignProducts();
    checkRatioFilter();
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
function checkRatioFilter(){
    $("[data-type='ratio-filter']").on('click', function(e){
        let val = $(this).attr('id').split("-")[1];
        // $(this).addClass('active').siblings().removeClass('active');
        if(val == "all") val = "";
        g_filter.set("ratio", val);
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
function brignData(){
    let ajaxTime = new Date().getTime();
    $.ajax({
        url: '/api/purchase/all',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' seg' : a + ' segs';
        $("#lastUpdated").html(t);
        fillStats(result);
        
        fillPedidos(result);
    }, (error) => {
        console.log(error);
    });
}
function reloadData(){
    var table = $('#table').DataTable();
    table.destroy();
    $('#tbody').empty();
    brignData();
}
function fillStats(data){
    $("#totalitems").html(data.length);
}
function fillPedidos(data){
    $("#tbody").html("");
    g_data = data;
    data.forEach((item) => {
        g_dataMap.set(item.id, item);
        addRow(item);
    });
    datatables();
    urlParamEventListener();
}
function addRow(e){
    try {
        let items = JSON.parse(e.items);
        let precio = items.precio;
        // format precio
        precio = "₡ "+precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let color = "orange"; // recibido
        let estado = "Recibido";
        if(e.state == 2){
            color = "blue"; // empacado
            estado = "Empacado";
        } 
        else if(e.state == 3) {
            color = "green"; // entregado
            estado = "Entregado";
        }
        else if(e.state == 4) {
            color = "red"; // cancelado
            estado = "Cancelado";
        }
        $("#tbody").append(`
            <tr>
                <td class="text-center" data-filter="${e.id}">
                    <a href="#" onclick="openverPedidoModal('${e.id}')" class="link-primary text-decoration-none">#${e.id}</a>
                </td>
                <td class="">
                    ${e.nombre ? e.nombre : `<span class="text-muted">No Registrado</span>`}
                </td>
                <td class="">
                    <span>${items.total}
                        <span class="d-none">${JSON.stringify(items.productos)}</span>
                    </span>
                </td>
                <td class="">
                    <span class="text-primary">${precio}</span>
                </td>
                <td class="">
                    <span class="badge badge-${color} b-pill">${estado}</span>
                </td>
                <td class="">
                    <div class="d-flex justify-content-center align-items-center">
                        <button type="button" class="btn btn-danger" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="eliminarPedido('${e.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `);
    } catch (error) {
        console.log(error);
    }
}
function datatables(){
    $("#table").DataTable({
        responsive: true,
        select: true,
        keys: false,
        columns:[
            {data: "id"},
            {data: "nombre"},
            {data: "productos"},
            {data: "precio"},
            {data: "estado"},
            {data: "acciones"},
        ],
        order: [[ 4, "desc" ]],
        "scrollY": "600px",
        "scrollCollapse": true,
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay pedidos",
            "info":           "Mostrando _END_ de _TOTAL_ pedidos ",
            select: {
                rows: {
                    _: "",
                    0: "",
                    1: ""
                }
            },
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 pedidos",
            "infoFiltered":   "(Filtrado de _MAX_ pedidos totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Mostrando _MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron pedidos similares",
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
function cambiarStatus(id,status, selector){
    if(parseInt(status) == 1){
        $("#dropdown-status-"+id).html(`Recibido`);
        $("#dropdown-status-"+id).removeClass("btn-blue").removeClass("btn-orange").removeClass("btn-green")
        .addClass("btn-orange");
        $("#dropdown-status-modal-"+id).html(`Recibido`);
        $("#dropdown-status-modal-"+id).removeClass("btn-blue").removeClass("btn-orange").removeClass("btn-green")
        .addClass("btn-orange");
    }else if(parseInt(status) == 2){
        $("#dropdown-status-"+id).html(`Empacado`);
        $("#dropdown-status-"+id).removeClass("btn-blue").removeClass("btn-orange").removeClass("btn-green")
        .addClass("btn-blue");
        $("#dropdown-status-modal-"+id).html(`Empacado`);
        $("#dropdown-status-modal-"+id).removeClass("btn-blue").removeClass("btn-orange").removeClass("btn-green")
        .addClass("btn-blue");
    }else if(parseInt(status) == 3){
        $("#dropdown-status-"+id).html(`Entregado`);
        $("#dropdown-status-"+id).removeClass("btn-blue").removeClass("btn-orange").removeClass("btn-green")
        .addClass("btn-green");
        $("#dropdown-status-modal-"+id).html(`Entregado`);
        $("#dropdown-status-modal-"+id).removeClass("btn-blue").removeClass("btn-orange").removeClass("btn-green")
        .addClass("btn-green");
    }else if(parseInt(status) == 4){
        $("#dropdown-status-"+id).html(`Cancelado`);
        $("#dropdown-status-"+id).removeClass("btn-blue").removeClass("btn-orange").removeClass("btn-green")
        .addClass("btn-red");
        $("#dropdown-status-modal-"+id).html(`Cancelado`);
        $("#dropdown-status-modal-"+id).removeClass("btn-blue").removeClass("btn-orange").removeClass("btn-green")
        .addClass("btn-red");
    }
    $.ajax({
        url: '/api/purchase/status/update',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: parseInt(id),
            status: parseInt(status)
        })
    }).then((result) => {
        createSwalAlertToast("success", `Pedido #${id} actualizado`);
        setTimeout(() => {
            location.reload();
        }, 1000);
    }, (error) => {
        console.log(error);
    });

}
function brignClients(){
    $.ajax({
        url: '/api/cliente/all?type=selectize',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        selectizeItems(result);
        result.forEach(e=>{
            g_clientData.set(e.id, e);
        });
    }, (error) => {
        console.log(error);
    });
}
function brignProducts(){
    $.ajax({
        url: '/api/product/all/selectize',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        selectizeProducts(result);
        result.forEach(e=>{
            g_productosData.set(e.id, e);
        });
    }, (error) => {
        console.log(error);
    });
}
function selectizeItems(data){
    $("#add-client").selectize({
        persist: false,
        valueField: "id",
        labelField: "nombre",
        searchField: ["nombre", "id"],
        options: data.map(e=>{
            let level = "";
            if(e.level == 1){
                level = "A";
            }else if(e.level == 2){
                level = "B";
            }else if(e.level == 3){
                level = "C";
            }
            return {
                id: e.id,
                nombre: e.nombre + " - " + e.cedula + " | " + level
            }
        })
    });
}

function selectizeProducts(data){
    $("#add-productos").selectize({
        maxItems: null,
        valueField: "id",
        labelField: "name",
        searchField: ["name", "brand", "id"],
        optgroupField: 'category',
        options: data.map(e=>{
            return {
                id: e.id,
                name: e.name + " - " + e.brand,
                brand: e.brand,
                category: e.category
            }
        }),
        optionGroupRegister: function (optgroup) {
            var capitalised = optgroup.charAt(0).toUpperCase() + optgroup.substring(1);
            var group = {
              label: capitalised
            };
          
            group[this.settings.optgroupValueField] = optgroup;
          
            return group;
        },
        onItemAdd: function(value, $item){
            let e = g_productosData.get(parseInt(value));
            addProdctItem(e);
        },
        onItemRemove: function(value){
            let e = g_productosData.get(parseInt(value));
            $("#product-item-"+e.id).remove();
        }
    });
}
function addProdctItem(e){
    let clienteSelected = g_clientData.get(parseInt($("#add-client").val()));
    let level = clienteSelected.level;

    let precios = JSON.parse(e.price);
    $("#products-list").append(`
        <li class="list-group-item bg-gray border-blue" id="product-item-${e.id}">
            <div class="row mx-0 g-0">
                <div class="col-md-7 d-flex justify-content-start align-items-start flex-column">
                    <h5 class="mb-0 fw-bold text-dark">${e.name}</h5>
                    <span class="text-muted">${e.brand}</span>
                </div>
                <div style="width:360px;">
                    <input class="btn-check" type="radio" name="precio-item-${e.id}" id="precio-item-${e.id}-1" data-precio="${precios.price1}" ${level == 1 ? "checked":""}>
                    <label class="btn btn-outline-green me-2" style="width:100px;" for="precio-item-${e.id}-1">A ${precios.price1}</label>

                    <input class="btn-check" type="radio" name="precio-item-${e.id}" id="precio-item-${e.id}-2" data-precio="${precios.price2}" ${level == 2 ? "checked":""}>
                    <label class="btn btn-outline-orange me-2" style="width:100px;" for="precio-item-${e.id}-2">B ${precios.price2}</label>

                    <input class="btn-check" type="radio" name="precio-item-${e.id}" id="precio-item-${e.id}-3" data-precio="${precios.price3}" ${level == 3 ? "checked":""}>
                    <label class="btn btn-outline-blue" style="width:100px;" for="precio-item-${e.id}-3">C ${precios.price3}</label>
                </div>
                <div class="col-md d-flex justify-content-start align-items-start flex-column">
                    <div class="input-group">
                        <span class="input-group-text" id="iconoCantidad${e.id}"><i class="fa-solid fa-plus-minus"></i></span>
                        <input type="number" class="form-control" id="cantidad-producto-${e.id}" aria-describedby="iconoCantidad${e.id}" value="1" placeholder="Cantidad" steps="1" min="1" min-lenght="1" value="1" max="${e.stock}" maxlength="${e.stock}">
                    </div>
                </div>
            </div>
        </li>
    `);
}
// ** ================================== AGREGAR ================================== **
function agregarPedido(){
    let cliente = $("#add-client").val();
    let p = $("#add-productos").val();

    let notas = $("#add-notas").val();
    let metodoPago = $("#add-metodoPago").val();

    if(cliente == "" || p.length == 0 || metodoPago == ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe llenar todos los campos',
        });
        return;
    }
    let preciosSum = 0;
    let priceType = [];
    let cantidadP = 0;
    p.forEach(e=>{
        let cantidad = parseInt($(`#cantidad-producto-${e}`).val());
        let precio = parseInt($(`input[name="precio-item-${e}"]:checked`).data("precio"));
        preciosSum += (precio * cantidad);
        cantidadP += cantidad;
        priceType.push({
            product: parseInt(e),
            price: precio,
            cantidad: cantidad
        });
    });
    let productos = p.map(e=>{
        return {
            product: parseInt(e),
            cantidad: parseInt($(`#cantidad-producto-${e}`).val())
        }
    });
    let data = {
        client: cliente,
        items: JSON.stringify({
            total: p.length,
            productos: priceType,
            precio: preciosSum
        }),
        notas: notas,
        metodoPago: metodoPago,
        productos: productos,
        precio: preciosSum,
        cantidad: cantidadP
    }
    $.ajax({
        url: '/api/purchase/add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data)
    }).then((result) => {
        agregarPedidoModal.hide();
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
        Toast.fire({
            icon: 'success',
            title: 'Orden agregada!'
        })
        setTimeout(() => {
            window.location.href = "/admin/pedidos?id="+result.data.id;
        }, 1000);
        
    }, (error) => {
        console.log(error);
    });
}
function clearInputs(){
    $("#add-client").val("");
    $("#add-productos").val("");
}

// TODO: ============================== CHECK PEDIDO ==============================
function urlParamEventListener(){
    let url = new URL(window.location.href);
    let id = url.searchParams.get("id");
    if(id != null){
        openverPedidoModal(id);
    }
    return;
}
function brignOneProduct(id){
    return new Promise((resolve, reject)=>{
        $.ajax({
            url: '/api/product/one/'+id,
            method: 'GET',
            contentType: 'application/json'
        }).then((result) => {
            resolve(result);
        }, (error) => {
            console.log(error);
            reject(error);
        });
    });
}
function openverPedidoModal(id){
    let orden = g_dataMap.get(parseInt(id));
    let items = JSON.parse(orden.items);
    
    clearModalData();
    addClientData(orden);

    let subtotal = 0;
    let total = 0;
    items.productos.forEach(e=>{
        addProductotoModal(e);
        subtotal += e.price * e.cantidad;
    });
    total = subtotal + 500;
    $("#order-subtotal").html(`₡${subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
    $("#order-total").html(`₡${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);

    verPedidoModal.show();
}
function addProductotoModal(e){
    brignOneProduct(e.product)
    .then((result)=>{
        $("#product-list-group").append(`
            <li class="list-group-item">
                <div class="row mx-0">
                    <div class="col-md-8">
                        <div class="d-flex justify-content-start align-items-start">
                            <img src="${result.image}" width="90px" class="img-round">
                            <div class="ps-2 mt-1">
                                <p class="fw-bold mb-0 text-dark">${result.name} ${result.brand}</p>
                                <small class="d-block text-dark">${capitalisedFL(result.category)} - ${result.cantidad}</small>
                                <small class="d-block text-muted">${result.barcode}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 d-flex align-items-center">
                        <p class="mb-0">₡${e.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} x ${e.cantidad}</p>
                    </div>
                    <div class="col-md-2 d-flex align-items-center justify-content-end">
                        <p class="mb-0">₡${(e.price * e.cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>
                </div>
            </li>
        `);
    });
}
function addClientData(e){
    let color = "orange"; // recibido
    let estado = "Recibido";
    if(e.state == 2){
        color = "blue"; // empacado
        estado = "Empacado";
        $("#history-order-icon-empacada")
        .removeClass("fa-fill-gray").removeClass("fa-fill-blue")
        .addClass("fa-fill-blue");

        $("#history-order-empacada").show();
    } 
    else if(e.state == 3) {
        color = "green"; // entregado
        estado = "Entregado";

        $("#history-order-icon-empacada")
        .removeClass("fa-fill-gray").removeClass("fa-fill-blue")
        .addClass("fa-fill-blue");

        $("#history-order-icon-entregada")
        .removeClass("fa-fill-gray").removeClass("fa-fill-blue")
        .addClass("fa-fill-blue");

        $("#history-order-empacada").show();
        $("#history-order-entregada").show();
    }
    else if(e.state == 4) {
        color = "red"; // cancelado
        estado = "Cancelado";
    }

    $("#status-orden-modal").html(`
        <div class="dropdown">
            <button class="btn btn-${color} dropdown-toggle b-pill" id="dropdown-status-modal-${e.id}" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${estado}
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item text-orange"  role="button" onclick="cambiarStatus('${e.id}','1','dropdown-status-modal')">Recibido</a></li>
                <li><a class="dropdown-item text-blue"  role="button" onclick="cambiarStatus('${e.id}','2','dropdown-status-modal')">Empacado</a></li>
                <li><a class="dropdown-item text-green"  role="button" onclick="cambiarStatus('${e.id}','3','dropdown-status-modal')">Entregado</a></li>
                <li><a class="dropdown-item text-red"  role="button" onclick="cambiarStatus('${e.id}','4','dropdown-status-modal')">Cancelado</a></li>
            </ul>
        </div>
    `);
    $("#orden-id-modal").html(`#${e.id}`);

    $("#info-order-name").html(e.nombre ? e.nombre : "No Registrado");
    $("#info-order-phone").html(e.phone ? `<a href="tel:+506${e.phone}" class="text-decoration-none text-primary">${e.phone}</a>` : "No Registrado");
    $("#info-order-email").html(e.email ? `<a href="mailto:${e.email}" class="text-decoration-none text-primary">${e.email}</a>`: "No Registrado");
    $("#info-order-location").html(e.direction ? e.direction : "No Registrado");
    $("#info-order-metodopago").html(e.metodoPago);

    $("#order-notes").html(e.notas);

    // fecha de la orden
    $("#info-order-placed").html(`
        Fecha: ${moment(e.createdAt).format("DD/MM/YYYY")} a las ${moment(e.createdAt).format("hh:mm a")}
    `);
}
function clearModalData(){
    $("#product-list-group").empty();
    $("#status-orden-modal").empty();

    $("#history-order-icon-empacada").removeClass("fa-fill-blue").addClass("fa-fill-gray");
    $("#history-order-icon-entregada").removeClass("fa-fill-blue").addClass("fa-fill-gray");

    $("#history-order-empacada").hide();
    $("#history-order-entregada").hide();

    $("#info-order-name").empty();
    $("#info-order-phone").empty();
    $("#info-order-email").empty();
    $("#info-order-location").empty();
    $("#info-order-metodopago").empty();
    $("#info-order-placed").empty();
}
// ! ==================== DELETE ====================

function eliminarPedido(id){
    Swal.fire({
        title: '¿Desea eliminar el pedido?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#96d7f4',
        cancelButtonColor: '#f26262',
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let p = g_dataMap.get(parseInt(id));
            let productos = JSON.parse(p.items).productos;
            $.ajax({
                url: '/api/purchase/delete',
                method: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: id,
                    productos: productos
                })
            }).then((result) => {
                reloadData();
                Swal.fire({
                    title: 'Pedido eliminado',
                    text: 'El Pedido ha sido eliminado correctamente',
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