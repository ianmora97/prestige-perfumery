var g_dataMap = new Map();
var g_data = [];

var g_productosData = new Map();


var modalAgregarPedido = document.getElementById('agregarPedidoModal');
const agregarPedidoModal = new bootstrap.Modal('#agregarPedidoModal');


function init(){
    brignData();
    brignClients();
    brignProducts();
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
                <td class="">
                    <a href="#" class="link-primary text-decoration-none">#${e.id}</a>
                </td>
                <td class="">
                    ${e.nombre}
                </td>
                <td class="">${items.total}</td>
                <td class="">
                    <span class="text-primary">${precio}</span>
                </td>
                <td class="" data-filter="${estado}">
                    <span class="badge b-pill badge-${color}">${estado}</span>
                </td>
                <td class="">
                    <div class="d-flex justify-content-center align-items-center">
                        <button type="button" class="btn btn-outline-primary me-2" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="openEditModal('${e.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
                        <button type="button" class="btn btn-danger" style="width: max-content; --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" onclick="eliminarProducto('${e.id}')"><i class="fa-solid fa-trash-can"></i></button>
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

        order: [[ 3, "asc" ]],
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
function brignClients(){
    $.ajax({
        url: '/api/cliente/all?type=selectize',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        selectizeItems(result);
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
            return {
                id: e.id,
                nombre: e.nombre + " - " + e.cedula
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
        // when a item is selected add it to the list
        onItemAdd: function(value, $item){
            let e = g_productosData.get(parseInt(value));
            addProdctItem(e);
        }
    });
}
function addProdctItem(e){
    let precios = JSON.parse(e.price); // array
    $("#products-list").append(`
        <li class="list-group-item d-flex justify-content-between align-items-center bg-gray border-blue">
            <div>
                <h5 class="mb-0 fw-bold">${e.name}</h5>
                <span class="text-muted">${e.brand}</span>
            </div>
            
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <input class="btn-check" type="radio" name="precio-item-${e.id}" id="precio-item-${e.id}-1" data-precio="${precios.price1}">
                    <label class="btn btn-outline-green me-2" style="width:100px;" for="precio-item-${e.id}-1">A ${precios.price1}</label>

                    <input class="btn-check" type="radio" name="precio-item-${e.id}" id="precio-item-${e.id}-2" data-precio="${precios.price2}">
                    <label class="btn btn-outline-orange me-2" style="width:100px;" for="precio-item-${e.id}-2">B ${precios.price2}</label>

                    <input class="btn-check" type="radio" name="precio-item-${e.id}" id="precio-item-${e.id}-3" data-precio="${precios.price3}">
                    <label class="btn btn-outline-blue me-2" style="width:100px;" for="precio-item-${e.id}-3">C ${precios.price3}</label>
                </div>
                <div class="margin-right:35px;">
                    <input type="number" class="form-control" id="cantidad-producto-${e.id}" style="width:60px;" value="1" placeholder="Cantidad" steps="1" min="1" min-lenght="1" value="1">
                </div>
            </div>
        </li>
    `);
}
// ** ================================== AGREGAR ================================== **
function agregarPedido(){
    let cliente = $("#add-client").val();
    let p = $("#add-productos").val();

    if(cliente == "" || p.length == 0){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe llenar todos los campos',
        });
        return;
    }
    let preciosSum = 0;
    let priceType = [];
    p.forEach(e=>{
        let cantidad = parseInt($(`#cantidad-producto-${e}`).val());
        let precio = parseInt($(`input[name="precio-item-${e}"]:checked`).data("precio"));
        preciosSum += precio * cantidad;
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
        productos: productos
    }
    $.ajax({
        url: '/api/purchase/add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data)
    }).then((result) => {
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
            title: 'Orden agregada!'
        })
        clearInputs();
        reloadData();
    }, (error) => {
        console.log(error);
    });
}
function clearInputs(){
    $("#add-client").val("");
    $("#add-productos").val("");
}



document.addEventListener('DOMContentLoaded', init);