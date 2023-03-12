const Cart = {
    get: function(){
        return JSON.parse(localStorage.getItem("cart"));
    },
    set: function(data){
        let existing = localStorage.getItem('cart');
        existing = existing ? JSON.parse(existing) : [];
        // check if item already exists in cart
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
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
    Toast.fire({
        icon: 'success',
        title: 'Agregado al carrito'
    });
}
function addLabelCarrito(){
    let cart = Cart.get();
    if(cart){
        $(".labelCarrito").html(cart.length);
        $(".labelCarrito").removeClass("d-none");
    }else{
        $(".labelCarrito").html(0);
        $(".labelCarrito").addClass("d-none");
    }
}
document.addEventListener("DOMContentLoaded", init());
function init(){
    addLabelCarrito();
}

verCarritoModal.addEventListener('show.bs.modal', function (event) {
    $("#verCarritoBodyModal").html("");

    let cart = Cart.get();
    if(cart){
        cart.forEach((e, i) => {
            getProducto(e.id)
            .then((result) => {
                showProductoCarrito(result, e.cantidad, i);
            }).catch((err) => {
                console.log(err);
            });
        });
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
    precio = "₡ "+precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    $("#verCarritoBodyModal").append(`
        <div class="card carrito mb-2">
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
                            <div class="d-flex justify-content-end align-items-end align-content-center gap-3">
                                <button type="button" class="btn btn-transparent text-primary-client btn-sm"><i class="fa-solid fa-minus"></i></button>
                                <h4 class="mb-0">${cant}</h4>
                                <button type="button" class="btn btn-transparent text-primary-client btn-sm"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    `);
}