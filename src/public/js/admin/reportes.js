var g_filter = new Map();
var g_dataMap = new Map();
var g_data = [];

var g_dataPedidos = [];


function init(){
    brignData('alltime');
}
function reloadData(){
    var table = $('#table').DataTable();
    table.destroy();
    $('#tbody').empty();
    brignData('alltime');
}
function brignData(time){
    let ajaxTime = new Date().getTime();
    $.ajax({
        url: '/api/report/allclient?time=' + time,
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' seg' : a + ' segs';
        $("#lastUpdated").html(t);
        fillTable(result);
        $("#totalitems").html(result.length);
    });
    $.ajax({
        url: '/api/report/getallsixmonths',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        fillStats(result);
        createCharts(result);
    });
    $.ajax({
        url: '/api/purchase/all/lastmonth',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        g_dataPedidos = result.lastMonth;
        statsPedidosMonth(result);
        createPedidosChart(result.lastMonth);
    }, (error) => {
        console.log(error);
    });
    // TODO: get all data from analytics
    $.ajax({
        url: '/api/analytics/all',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        iterateAnalytics(result);
    }, (error) => {
        console.log(error);
    });
}
function iterateAnalytics(data){
    let byDevice = [];
    let byOS = [];
    let byBrowser = [];
    let byPlace = [];

    data.forEach((item) => {
        let device = item.device;
        let os = item.os;
        let browser = item.browser;
        let ip = JSON.parse(item.ip);

        byDevice.push(device);
        byOS.push(os);
        byBrowser.push(browser);
        byPlace.push(ip.region);
    });
    buildAnalytics(byDevice, byOS, byBrowser, byPlace);
}
function buildAnalytics(devices, os, browsers, places){
    let mobile = 0;
    let desktop = 0;

    devices.forEach((item) => {
        if(item == 'Mobile'){
            mobile++;
        }else{
            desktop++;
        }
    });
    let mobilePercentage = (mobile / devices.length) * 100;
    let desktopPercentage = (desktop / devices.length) * 100;

    let mobileStr = mobilePercentage.toFixed(0);
    let desktopStr = desktopPercentage.toFixed(0);

    $("#stats-device-mobile-progress").css('width', mobileStr + '%');
    $("#stats-device-desktop-progress").css('width', desktopStr + '%');

    $("#stats-devide-mobile-data").html(mobileStr + '%');
    $("#stats-devide-desktop-data").html(desktopStr + '%');

    buildChartOSBrowser(os, browsers);
}
function buildChartOSBrowser(os, browsers){
    let osData = [];
    let browserData = [];
    // COUNT OS AND BROWSER items and push to array no repeat
    let osMap = new Map();
    let browserMap = new Map();

    os.forEach((item) => {
        if(osMap.has(item)){
            let value = osMap.get(item);
            value++;
            osMap.set(item, value);
        }else{
            osMap.set(item, 1);
        }
    });
    browsers.forEach((item) => {
        if(browserMap.has(item)){
            let value = browserMap.get(item);
            value++;
            browserMap.set(item, value);
        }else{
            browserMap.set(item, 1);
        }
    });
    // convert map to array
    osMap.forEach((value, key) => {
        osData.push({
            x: key,
            y: value
        });
    });
    browserMap.forEach((value, key) => {
        browserData.push({
            x: key,
            y: value
        });
    });

    var osChart = document.getElementById("osChart");
    var ctxOs = osChart.getContext("2d");
    var osChartJS = new Chart(osChart, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Dispositivos',
                    data: osData,
                    backgroundColor: 'rgba(79, 70, 229, 0.8)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    hoverBackgroundColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1,
                    borderRadius: {
                        topRight: 8,
                        topLeft: 8,
                        bottomRight: 0,
                        bottomLeft: 0
                    },
                    barThickness: 30
                }                
            ]
        },
        options: {
            plugins:{
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: true,
                    },
                    border:{
                        display: false
                    },
                    ticks:{
                        display: false
                    }
                }
            }
        }

    });
    var browserChart = document.getElementById("browserChart");
    var ctxBrowser = browserChart.getContext("2d");
    var browserChartJS = new Chart(browserChart, {
        type: 'bar',
        data: {
            datasets:[
                {
                    label: 'Dispositivos',
                    data: browserData,
                    backgroundColor: 'rgba(150, 215, 244, 0.8)',
                    borderColor: 'rgba(150, 215, 244, 1)',
                    hoverBackgroundColor: 'rgba(150, 215, 244, 1)',
                    borderWidth: 1,
                    borderRadius: {
                        topRight: 8,
                        topLeft: 8,
                        bottomRight: 0,
                        bottomLeft: 0
                    },
                    barThickness: 30
                }
            ]
        },
        options: {
            plugins:{
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: true
                    },
                    border:{
                        display: false
                    },
                    ticks:{
                        display: false
                    }
                }
            }
        }
    });
}

function statsPedidosMonth(result){
    $("#stats-pedidos-cant").html(result.lastMonth.length);

    let direference = result.lastMonth.length - result.pastMonth.length;
    let percentage = (direference / result.pastMonth.length) * 100;
    let percentageStr = percentage.toFixed(0);

    if(direference > 0){
        $("#stats-pedidos-metrics").html(`
            <span class="badge b-pill badge-green">
                ${percentageStr}%
                <i class="fa-solid fa-arrow-trend-up"></i>
            </span>
        `);
    }else{
        $("#stats-pedidos-metrics").html(`
            <span class="badge b-pill badge-red">
                ${percentageStr}%
                <i class="fa-solid fa-arrow-trend-down"></i>
            </span>
        `);
    }

}
function createPedidosChart(data){
    let result = [0, 0, 0];
    data.forEach((item) => {
        result[item.state - 1] += 1;
    });
    
    showPedidosGraph(result);
}
function showPedidosGraph(data){
    var pedidosChart = document.getElementById("pedidosChart");
    var ctx = pedidosChart.getContext("2d");

    var pedidosChartJS = new Chart(pedidosChart, {
        type: 'doughnut',
        data: {
            labels: ['Recibidos', 'Empacados', 'Entregados'],
            datasets: [{
                label: 'Cantidad',
                data: data,
                borderColor: [
                    'rgba(79, 70, 229, 0.5)',
                    'rgba(143, 138, 239, 0.5)',
                    'rgba(205, 202, 255, 0.5)'
                ],
                backgroundColor: [
                    'rgba(79, 70, 229, 1)',
                    'rgba(143, 138, 239, 1)',
                    'rgba(205, 202, 255, 1)'
                ],
                borderWidth: 0,
                borderRadius: 3,
                spacing: 5,
                hoverOffset: 10

            }]
            
        },
        options: {
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 20,
                        boxHeight: 10,
                        padding: 30,
                        usePointStyle: true,
                        pointStyle:'rectRounded',
                        font: {
                            size: 14
                        }
                    },
                }
            },
            layout:{
                autoPadding: true,
                padding: {
                    left: 20
                }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor(((currentValue/total) * 100)+0.5);         
                        return data.labels[tooltipItem.index] + ": " + currentValue + " (" + percentage + "%)";
                    }
                }
            }
        }
    });
}
function fillStats(data){
    let total = 0;
    let cantidad = 0;
    data.forEach(item => {
        total += parseFloat(item.total);
        cantidad += parseInt(item.cantidad);
    });

    let mediaTotal = total / 6;
    mediaTotal = mediaTotal.toFixed(0);

    $("#stat-producto-vendido").html(cantidad);
    $("#stat-total-ingreso").html(`₡ ${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);

    $("#stat-producto-mensual").html(Math.round(cantidad / 6) + " productos vendidos en promedio por mes");
    $("#stat-ingreso-mensual").html(`₡ ${mediaTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
    
}
function fillTable(data){
    $("#tbody").html("");
    data.forEach((item,i) => {
        addRow(item,i);
    });
    datatables();
}
function addRow(e,i){
    let precio = e.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    let color = "red";
    let level = "Bajo"
    if(i < 5){
        color = "green";
        level = "Alto";
    }else if(i >= 5 && i < 8){
        color = "orange";
        level = "Medio";
    }
    $("#tbody").append(`
        <tr>
            <td class="text-center">${i+1}</td>
            <td class="ps-4">${e.nombre} ${i <= 5? "🔥":""}</td>
            <td class="">${e.cedula}</td>
            <td data-filter="${level}">
                <span class="badge bg-${color}">${level}</span>
            </td>
            <td class="">
                <span class="text-primary">${e.cantidad} productos</span>
            </td>
            <td class="">
                <span class="text-primary">₡ ${precio}</span>
            </td>
        </tr>
    `);
}
function datatables(){
    $("#table").DataTable({
        responsive: true,
        select: true,
        keys: true,
        order: [[ 4, "asc" ]],
        "scrollY": "600px",
        "scrollCollapse": true,
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay reportes",
            "info":           "Mostrando _END_ de _TOTAL_ reportes ",
            select: {
                rows: {
                    _: "",
                    0: "",
                    1: ""
                }
            },
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 reportes",
            "infoFiltered":   "(Filtrado de _MAX_ reportes totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Mostrando _MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron reportes similares",
        },
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

    $('#table_length').css('display', 'none');
    $('#table_filter').css('display', 'none');
    $('#table_paginate').css('display', 'none');

    $('#barraBuscar').on('keyup', function(){
        let val = $(this).val();
        g_filter.set("search", val);
        search(val);
    });
}
function cambiarFechaTabla(time){
    let type = {
        alltime: "Todo el tiempo",
        currentmonth: "Ultimo Mes",
        currentyear: "Ultimo Año",
    }
    $("#dropdown-filtro-fecha-table").html(`<i class="fa-solid fa-clock-rotate-left"></i> ${type[time]}`);
    var table = $('#table').DataTable();
    table.destroy();
    $('#tbody').empty();
    brignData(time);
}

// ***************+++++*************** CHARTS ***************+++++***************
// ***************+++++*************** CHARTS ***************+++++***************

function createCharts(result){
    let months = [];
    let min, max = 0;
    
    result.forEach((item, i) => {
        months.push(moment().month(item.month-1).format('MMM YYYY'));
        if(i == 0){
            min = moment().month(item.month-1).format('1 MMM YYYY');
        }
        if(i == result.length-1){
            max = moment().month(item.month-1).format('D MMM YYYY');
        }
    });

    let labels = months;
    $("#dateIncomeRange").html(`
        ${min} - ${max}
    `);

    let y = [1200, 1009, 100, 500, 2000, 530, 1400];
    let data = [];
    for(let i = 0; i < 6; i++){
        data.push({
            x: labels[i],
            y: parseInt(result[i].total)
        })
    }
    data.reverse();
    
    createIncomeChart(labels, data);
}
var incomeChartJS;
var incomeChart;
function createIncomeChart(labels, data){
    incomeChart = document.getElementById("incomeChart");
    var ctx = incomeChart.getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(79,70,229, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    incomeChartJS = new Chart(incomeChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: gradient,
                borderColor: 'rgba(79,70,229, 1)',
                borderWidth: 5,
                fill: true,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                pointBorderColor: 'rgba(79,70,229, 1)',
                pointBorderWidth: 3,
                pointRadius: 4,
                pointHoverBackgroundColor: 'rgba(79,70,229, 1)',
                pointHoverBorderColor: 'rgba(79,70,229, 1)',
                pointHoverBorderWidth: 3,
                tension: 0.4
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip:{
                    enabled: false,
                    position: 'average',
                    external: customChartTooltip
                },

            },
            scales: {
                y: {
                    display: false,
                    grid:{
                        display: false,
                        drawBorder: false,
                    },
                    ticks:{
                        display: false
                    },
                    beginAtZero: true
                },
                x:{
                    grid:{
                        display: false,
                        drawBorder: false,
                    },
                    ticks:{
                        display: true,
                    },
                }
            },
            animation: {
                easing: 'easeInSine',
                duration: 1000
            }
        }
    });
}
var customChartTooltip = (context) => {
    let tooltipEl = document.getElementById('chartjs-tooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<div class="chartjs-tooltip-body"></div>';
        document.body.appendChild(tooltipEl);
    }
    const tooltipModel = context.tooltip;
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }
    function getBody(bodyItem) {
        return bodyItem.lines;
    }
    if (tooltipModel.body) {
        const titleLines = tooltipModel.title || [];
        const bodyLines = tooltipModel.body.map(getBody);
        let innerHtml = '';
        titleLines.forEach(function(title) {
            innerHtml += '<span>' + title + '</span><br>';
        });
        bodyLines.forEach(function(body, i) {
            const colors = tooltipModel.labelColors[i];
            innerHtml += `<b>$${body}</b>`;
        });
        let tableRoot = tooltipEl.querySelector('div');
        tableRoot.innerHTML = innerHtml;
    }
    const position = context.chart.canvas.getBoundingClientRect();
    const bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - 40 + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 80 + 'px';
    tooltipEl.style.font = bodyFont.string;
    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
    tooltipEl.style.pointerEvents = 'none';
}
// TODO ===========+++++========= Animaciones ===========+++++=========

// call incEltNbr(id) to increment the number in the element with the given id
function incEltNbr(id) {
    elt = document.getElementById(id);
    endNbr = Number(document.getElementById(id).innerHTML);
    incNbrRec(0, endNbr, elt);
}

function incNbrRec(i, endNbr, elt) {
    if (i <= endNbr) {
        elt.innerHTML = i;
        setTimeout(function () {
            incNbrRec(i + 1, endNbr, elt);
        }, 1);
    }
}


document.addEventListener('DOMContentLoaded', init);