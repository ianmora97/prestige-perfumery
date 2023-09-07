var g_filter = new Map();
var g_dataMap = new Map();
var g_data = [];

var modalAgregarProveedor = document.getElementById('agregarProveedorModal');
const agregarProveedorModal = new bootstrap.Modal('#agregarProveedorModal');

function init(){
    brignData();
}
function reloadData(){
    brignData();
}
function brignData(){
    let ajaxTime = new Date().getTime();
    $.ajax({
        url: '/api/v1/proveedor/all?type=onlyActive',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' seg' : a + ' segs';
        $("#lastUpdated").html(t);
        fillStats(result);
        
        fillProveedors(result);
    }, (error) => {
        console.log(error);
    });
}
function fillStats(data){
    $("#totalitems").html(data.length);
}
function fillProveedors(data){
    $("#proveedoresList").html("");
    g_data = data;
    if(data.length == 0){
        $("#proveedoresList").html(`
            <p class="text-center text-dark mt-5" style="width:100%;">No hay pedidos a proveedores</p>
        `);
    }else{
        data.forEach((item,i) => {
            g_dataMap.set(item.id, item);
            addRow(item,i);
        });
    }
}
function addRow(e,i){
    $("#proveedoresList").append(`
        <div class="bg-white rounded-15 shadow-custom p-3 animate__animated animate__zoomIn border-4 border-bottom border-primary overflow-hidden" style="min-width: 300px; animation-delay:${i * 50}ms;">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-start align-items-center">
                    <span class="fa-stack">
                        <i class="fa-solid fa-circle fa-stack-2x text-gray-light"></i>
                        <i class="fa-solid fa-truck-fast fa-stack-1x text-dark"></i>
                    </span>
                    <h4 class="mb-0 fw-bold px-2">#${e.id}</h4>
                </div>
                <div class="dropdown">
                <button class="btn btn-dark" type="button" data-bs-toggle="dropdown" 
                aria-expanded="false">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
                    <ul class="dropdown-menu">
                        <li>
                            <button class="dropdown-item" type="button" onclick="actualizarEstado('${e.id}', '0')">
                                <i class="fa-solid fa-check-circle text-success"></i> Completado
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item" type="button" onclick="eliminarProveedor('${e.id}')">
                                <i class="fa-solid fa-trash-alt text-danger"></i> Delete
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <small class="text-end text-muted">${moment(e.createdAt).format('D [de] MMMM')}</small>
            <p class="my-3 text-muted">${e.nombre}</p>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge badge-blue b-pill"><i class="fa-solid fa-box"></i> ${e.cantidad} productos</span>
            </div>
            <img src="/img/camion.png" class="img-fluid d-block mx-auto animate__animated animate__fadeInRight animate__slow" style="width:70%; object-fit: cover; object-position: center; animation-delay:${(i * 50) + 500}ms;"">
        </div>
    `);
}
function actualizarEstado(id, estado){
    Swal.fire({
        title: '¿El pedido ha sido completado?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#f26262',
        confirmButtonText: 'Si, Actualizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/api/v1/proveedor/updateestado',
                method: 'PUT',
                data: JSON.stringify({
                    id: parseInt(id),
                    estado: parseInt(estado)
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
                        title: 'Estado actualizado'
                    })
                    reloadData();
                }
            }, (error) => {
                console.log(error);
            });
        }
    });
}
function agregarPedido(){
    let nombre = $("#add-nombre").val();
    let cantidad = $("#add-cantidad").val();

    let data = {
        nombre: nombre,
        cantidad: cantidad
    };

    if(nombre == "" || cantidad == ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe llenar todos los campos',
        });
        return;
    }else{
        $.ajax({
            url: '/api/v1/proveedor/add',
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).then((result) => {
            if(result.status === 200){
                agregarProveedorModal.hide();
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
                    title: 'Pedido agregado'
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
// ! ====================  ELIMINAR Proveedor ==================== ! //
function eliminarProveedor(id){
    Swal.fire({
        title: '¿Desea eliminar el Proveedor?',
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
                url: '/api/v1/proveedor/delete',
                method: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: parseInt(id)
                })
            }).then((result) => {
                reloadData();
                Swal.fire({
                    title: 'Proveedor eliminado',
                    text: 'El Proveedor ha sido eliminado correctamente',
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