// ?atributes
var g_carsMap = new Map();

// !functions
function loaded(event){
    bringDB(); 
    dispatch();
    update();
    openModal();
}

function openModal() {
    var update = document.getElementById('updateRow')
    update.addEventListener('show.bs.modal', function (event) {
        let button = event.relatedTarget
        let id = button.getAttribute('data-id')
        let car = g_carsMap.get(parseInt(id));
        let modalTitle = update.querySelector('.modal-title')
        modalTitle.textContent = 'Update car ' + car.marca;
        $('#idCar').val(car.id);
        $('#up_brand').val(car.marca);
        $('#up_model').val(car.modelo);
        $('#up_year').val(car.anio);
    })
}

function bringDB() {
    $.ajax({
        type: "GET",
        url: "/api/admin/carros",
        contentType: "application/json"
    }).then((data) => {
        showInfo(data)
    }, (error) => {

    });
}
function showInfo(data) {
    buildtable().then(res=>{
        buildHeaders(data.campos).then(res1 =>{
            clearMap(g_carsMap);
            data.filas.forEach(e =>{
                addtoMap(g_carsMap,e.id,e)
            })
            buildRows(data.filas).then(res2 =>{
                let columnsDefs = [
                    { targets: [0, 6], orderable: false,},
                    { targets: '_all', orderable: true }
                ]
                buildDataTable(columnsDefs);
            });
        });
    });
}
function update() {
    $("#updateConfirm").click(function () {
        let data = {
            id:$('#idCar').val(),
            brand:$('#up_brand').val(),
            model:$('#up_model').val(),
            year:$('#up_year').val()
        }
        $.ajax({
            type: "POST",
            url: "/admin/car/update",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json"
        }).then((data) => {
            console.log(data.responseText)
        }, (data) => {
            console.log(data.responseText)
            if(data.responseText == "updated"){
                resetTable()
                bringDB()
            }else{
                // an alert
            }
        });
    });
}
function dispatch() {
    $("#dispatchSelected").click(function () {
        let cont = true;
        let Options = $("[id*=checkbox-]");
        let OpSelected = [];
        for (let i = 0; i < Options.length; i++) {
            if (Options[i].checked) {
                let data = {id:Options[i].value}
                $.ajax({
                    type: "POST",
                    url: "/admin/clientes/delete",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    dataType: "json"
                }).then((data) => {
                    if(data.res != "deleted") cont = false;
                }, (err) => {
                });
            }
        }
        if(cont){
            resetTable()
            bringDB()
        }
    });
}

document.addEventListener("DOMContentLoaded", loaded);