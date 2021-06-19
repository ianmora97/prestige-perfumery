// ?atributes
var g_clientsMap = new Map();

// !functions
function loaded(event){
    bringDB(); 
    dispatch();
    update();
    openModal();
}
function selectImage(photo) {
    $('#fotoSelect').val(photo);
    if(photo == "avatar1.png"){
        $('#selectedR').html('<span class="badge bg-secondary">Selected</span>')
        $('#selectedL').html('')
    }else{
        $('#selectedL').html('<span class="badge bg-secondary">Selected</span>')
        $('#selectedR').html('')
    }
}
function openModal() {
    var update = document.getElementById('updateClient')
    update.addEventListener('show.bs.modal', function (event) {
        let button = event.relatedTarget
        let id = button.getAttribute('data-id')
        let client = g_clientsMap.get(parseInt(id));
        let modalTitle = update.querySelector('.modal-title')
        modalTitle.textContent = 'Update Client ' + client.nombre;
        $('#idClient').val(client.id);
        $('#update_name').val(client.nombre);
        $('#update_email').val(client.correo);
    })
}

function bringDB() {
    $.ajax({
        type: "GET",
        url: "/api/admin/clientes",
        contentType: "application/json"
    }).then((data) => {
        console.log(data)
        showInfo(data)
    }, (error) => {

    });
}
function showInfo(data) {
    buildtable().then(res=>{
        buildHeaders(data.campos).then(res1 =>{
            clearMap(g_clientsMap);
            data.filas.forEach(e =>{
                addtoMap(g_clientsMap,e.id,e)
            })
            buildRows(data.filas).then(res2 =>{
                buildDataTable();
            });
        });
    });
}
function update() {
    $("#updateConfirm").click(function () {
        let data = {
            id:$('#idClient').val(),
            name:$('#update_name').val(),
            email:$('#update_email').val()
        }
        $.ajax({
            type: "POST",
            url: "/admin/clientes/update",
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