const Cart = {
    get: function(){
        return JSON.parse(localStorage.getItem("cart")) || [];
    },
    set: function(data){
        let existing = localStorage.getItem('cart');
        existing = existing ? JSON.parse(existing) : [];
        let itemExists = false;
        existing.forEach(e => {
            if(e.id == data.id){
                e.cantidad += data.cantidad;
                itemExists = true;
            }
        });
        if(!itemExists){
            existing.push(data);
        }
        localStorage.setItem('cart', JSON.stringify(existing));
        addLabelCarrito();
        return existing;
    },
    update: function(id, cantidad){
        let existing = localStorage.getItem('cart');
        existing = JSON.parse(existing);
        existing.forEach(e => {
            if(e.id == id){
                e.cantidad += cantidad;
            }
        });
        localStorage.setItem('cart', JSON.stringify(existing));
        addLabelCarrito();
        return existing;
    },
    setCant: function(id, cantidad){
        let existing = localStorage.getItem('cart');
        existing = JSON.parse(existing);
        existing.forEach(e => {
            if(e.id == id){
                e.cantidad = cantidad;
            }
        });
        localStorage.setItem('cart', JSON.stringify(existing));
        addLabelCarrito();
        return existing;
    },     
    empty: function(){
        localStorage.removeItem('cart');
        addLabelCarrito();
        return [];
    },
    delete: function(id){
        let existing = localStorage.getItem('cart');
        existing = JSON.parse(existing);
        existing.forEach((e, i) => {
            if(e.id == id){
                existing.splice(i, 1);
            }
        });
        localStorage.setItem('cart', JSON.stringify(existing));
        addLabelCarrito();
        return existing;
    }
}
function init(){
    addLabelCarrito();
}

var totalPedido = 0;


const verProductoModal = document.getElementById('verProductoModal');
const verProductoModalBS = new bootstrap.Modal('#verProductoModal');

const verCarritoModal = document.getElementById('verCarritoModal');
const verCarritoModalBS = new bootstrap.Modal('#verCarritoModal');

verProductoModal.addEventListener('hide.bs.modal', function (event) {
    verProductoModal.classList.add('animate__animated', 'animate__slideOutDown');
    setTimeout(() => {
        verProductoModal.classList.remove('animate__animated', 'animate__slideOutDown');
    }, 500);
});
function openModalViewProductos(id, e){
    var x = e.clientX;
    var y = e.clientY;
    verProductoModal.style.transformOrigin = `${x}px ${y}px`;
    verProductoModalBS.show();

    getProducto(id)
    .then((result) => {
        showProductoModal(result);
    }).catch((err) => {
        console.log(err);
    });
}
var getProducto = (id) => {
    return new Promise((resolve, reject)=>{
        $.ajax({
            url: `/api/product/one/${id}`,
            method: 'GET',
            contentType: 'application/json'
        }).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
};

function showProductoModal(data){
    $("#modalimageProduct").attr("src", data.image);
    $("#modalNombreProduct").html(data.name);
    $("#modalBrandProduct").html(data.brand);
    $("#modalTypeProduct").html(data.type);
    $("#modalCantidadProducto").html(`${data.cantidad}`);
    $("#modalCategoriaProducto").html(`${data.category}`);
    $("#modalCodigoProducto").html(`${data.barcode}`);
    $("#modalStockProducto").html(`${data.stock}`);
    $("#modalAgregarCarritoProduct").attr("onclick", `agregarCarrito('${data.id}')`);


    let amountStars = Math.ceil(data.rating);
    let stars = "";
    for (let i = 0; i < amountStars; i++) {
        stars += `<i class="fa-solid fa-star text-warning"></i> `;
    }
    $("#modalRatingProduct").html(`${stars} ${data.rating}`);

    let {price1, price2, price3} = JSON.parse(data.price);
    let precio;
    if(client_data.nivel == 1){
        precio = price3;
    }else if(client_data.nivel == 2){
        precio = price2;
    }else if(client_data.nivel == 3){
        precio = price1;
    }
    precio = parseInt(precio) * (100 - parseInt(data.promotion)) / 100;
    precio = "₡ "+precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    let desc = "";
    if(data.promotion > 0){
        desc = `<small class="text-muted small fw-light">${data.promotion}% off</small>`;
    }

    $("#modalPrecioProduct").html(`${precio} ${desc}`);

}
function clearvaluesModalverProducto(){
    $("#modalimageProduct").attr("src", "https://dev-to-uploads.s3.amazonaws.com/i/mrvsmk2pl3l8fwocbfhy.gif");
    $("#modalNombreProduct").html("");
    $("#modalBrandProduct").html("");
    $("#modalTypeProduct").html("");
    $("#modalCantidadProducto").html("");
    $("#modalCategoriaProducto").html("");
    $("#modalCodigoProducto").html("");
    $("#modalStockProducto").html("");
    $("#modalRatingProduct").html("");
    $("#modalPrecioProduct").html("");
}
function agregarCarrito(id){
    Cart.set({
        id: id,
        cantidad: 1
    });
    verProductoModalBS.hide();
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
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
        title: 'Agregado al carrito',
        iconColor: '#EA5C5F'
    });
}
function addLabelCarrito(){
    let cart = Cart.get();
    let sum = 0;
    cart.forEach(e => {
        sum += e.cantidad;
    });
    if(cart.length > 0){
        $(".labelCarrito").html(sum);
        $(".labelCarrito").removeClass("d-none");
    }else{
        $(".labelCarrito").html(0);
        $(".labelCarrito").addClass("d-none");
    }
}
document.addEventListener("DOMContentLoaded", init());


verCarritoModal.addEventListener('show.bs.modal', function (event) {
    $("#verCarritoBodyModal").html("");
    let cart = Cart.get();
    if(cart.length > 0){
        cart.forEach((e, i) => {
            getProducto(e.id)
            .then((result) => {
                showProductoCarrito(result, e.cantidad, i);
            }).catch((err) => {
                console.log(err);
            });
        });
        
        $("#modalCarritoConfirmarPedido").attr("disabled", false);
    }else{
        $("#verCarritoBodyModal").html(`
            <div class="d-flex justify-content-center align-items-center flex-column">
                <i class="fa-solid fa-cart-shopping fa-2x text-muted"></i>
                <h5 class="text-muted mt-3">No hay productos en el carrito</h5>
            </div>
        `);
        $("#modalCarritoConfirmarPedido").attr("disabled", true);
    }
});
function showProductoCarrito(e, cant, i){
    let {price1, price2, price3} = JSON.parse(e.price);
    let precio;
    if(client_data.nivel == 1){
        precio = price3;
    }else if(client_data.nivel == 2){
        precio = price2;
    }else if(client_data.nivel == 3){
        precio = price1;
    }
    precio = parseInt(precio) * (100 - parseInt(e.promotion)) / 100;
    totalPedido += precio * cant;
    precio = "₡ "+precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    totalPedidoadd();

    $("#verCarritoBodyModal").append(`
        <div class="card carrito bg-gray mb-2 animate__animated animate__fadeInLeft" id="card-carrito-${e.id}">
            <div class="card-delete" onclick="eliminardelcarrito('${e.id}')">
                <i class="fa-solid fa-trash"></i>
            </div>
            <div class="d-flex justify-content-start">
                <img src="${e.image}" alt="Imagen del producto" 
                class="img-fluid bg-white rounded-15 p-2" style="mix-blend-mode: multiply; height:135px; width:100px; object-fit:contain;">
                <div class="d-flex justify-content-between align-items-center flex-grow-1 flex-wrap w-100">
                    <div class="d-flex justify-content-start align-items-start flex-column py-3">
                        <h3 class="fw-bold mb-0">${e.name}</h3>
                        <p class="mb-1 small">by ${e.brand} - ${e.category} ${e.cantidad}</p>
                        <small class="text-muted mb-1">${e.type}</small>
                        <div class="d-flex justify-content-between align-items-center align-content-center">
                            <h5 class="mb-0 text-primary-client me-5">${precio}</h5>
                            <div class="d-flex justify-content-end align-items-end align-content-center gap-1">
                                <button type="button" class="btn btn-transparent text-primary-client btn-sm" onclick="remove1itemcart('${e.id}')"><i class="fa-solid fa-minus"></i></button>
                                <input type="number" class="form-control form-control-sm text-center bg-gray border-0" value="${cant}" style="width: 45px;" onchange="updateitemcart('${e.id}',this)">
                                <button type="button" class="btn btn-transparent text-primary-client btn-sm" onclick="add1itemcart('${e.id}')"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    `);
}
function totalPedidoadd(){
    $("#modalCarritoTotal").html(`₡${totalPedido.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
}
function eliminardelcarrito(id){
    Cart.delete(id);
    $("#card-carrito-"+id).removeClass("animate__fadeInLeft");
    animateCSS(`#card-carrito-${id}`, 'fadeOutLeft').then((message) => {
        $(`#card-carrito-${id}`).remove();
    });
    checkTotalPedido();
}
function remove1itemcart(id){
    let cantBefore = Cart.get().find(e => e.id == id).cantidad;
    if(cantBefore == 1){
        Swal.fire({
            text: '¿Desea eliminar el producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminardelcarrito(id);
            }
        });
    }else{
        Cart.update(id, -1);
        let cant = Cart.get().find(e => e.id == id).cantidad;
        $(`#card-carrito-${id} input`).val(cant);
    }
    checkTotalPedido();
}
function add1itemcart(id){
    Cart.update(id, 1);
    let cant = Cart.get().find(e => e.id == id).cantidad;
    $(`#card-carrito-${id} input`).val(cant);
    checkTotalPedido();
}
function updateitemcart(id, e){
    let val = parseInt($(e).val());
    if(val > 0){
        Cart.setCant(id, val);
    }else{
        eliminardelcarrito(id);
    }
    checkTotalPedido();
}
function checkTotalPedido(){
    let cart = Cart.get();
    totalPedido = 0;
    if(cart.length > 0){
        cart.forEach((e, i) => {
            getProducto(e.id)
            .then((result) => {
                let {price1, price2, price3} = JSON.parse(result.price);
                let precio;
                if(client_data.nivel == 1){
                    precio = price3;
                }else if(client_data.nivel == 2){
                    precio = price2;
                }else if(client_data.nivel == 3){
                    precio = price1;
                }
                precio = parseInt(precio) * (100 - parseInt(result.promotion)) / 100;
                totalPedido += precio * e.cantidad;
                totalPedidoadd();
            }).catch((err) => {
                console.log(err);
            });
        });
    }else{
        totalPedidoadd();
    }
}