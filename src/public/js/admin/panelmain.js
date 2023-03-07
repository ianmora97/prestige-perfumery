
var g_dataPedidos = [];
function init(){
    getData();
}
function getData(){
    $.ajax({
        url: '/api/purchase/all/lastmonth',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        g_dataPedidos = result.lastMonth;
        fillPedidos(result.lastMonth);
        statsPedidosMonth(result);
    }, (error) => {
        console.log(error);
    });
    $.ajax({
        url: '/api/product/all/productslow',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        fillProductsLowStock(result);
    }, (error) => {
        console.log(error);
    });
    $.ajax({
        url: '/api/proveedor/all?type=onlyActive',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        fillProveedores(result);
    }, (error) => {
        console.log(error);
    });
    $.ajax({
        url: '/api/report/getallsixmonths',
        method: 'GET',
        contentType: 'application/json'
    }).then((result) => {
        console.log(result);
        fillStats(result);
        if(result.length > 0){
            createCharts(result);
        }
    });
}
function fillProveedores(data){
    data.forEach((e,i) => {
        $("#pedidosproveedor").append(`
        <div class="bg-gray rounded-15 shadow-custom p-3 animate__animated animate__zoomIn border-4 border-bottom border-primary" style="min-width: 100%; animation-delay:${i * 100}ms;">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-start align-items-center">
                    <span class="fa-stack">
                        <i class="fa-solid fa-circle fa-stack-2x text-gray-light"></i>
                        <i class="fa-solid fa-truck-fast fa-stack-1x text-primary"></i>
                    </span>
                    <p class="my-3 text-dark fw-bold">${e.nombre}</p>
                </div>
                <span class="badge badge-blue b-pill"><i class="fa-solid fa-box"></i> ${e.cantidad} productos</span>
            </div>
            
        </div>
        `);
    });
}
function fillStats(data){
    let total = 0;
    data.forEach(item => {
        total += parseFloat(item.total);
    });

    let mediaTotal = total / 6;

    $("#cantidad-ingresos").html(`₡ ${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
}
function fillProductsLowStock(data){
    $("#low-products-inventory").empty();
    data.forEach((e) => {
        let color = "success";
        if(e.stock <= e.notification + 5){
            color = "warning";
        }if(e.stock <= e.notification){
            color = "danger";
        }
        $("#low-products-inventory").append(`
            <a href="/admin/productos?uuid=${e.uuid}" class="list-group-item list-group-item-action" style="--bs-list-group-action-hover-bg:#f2f1ff;">
                <div class="d-flex justify-content-between">
                    <div class="d-flex justify-content-start align-items-start">
                        <img src="${e.image}" width="60px" height="60px" class="img-round">
                        <div class="ps-2 mt-1">
                            <p class="fw-bold mb-0 text-dark">${e.name} ${e.brand}</p>
                            <small class="d-block text-dark">${capitalisedFL(e.category)} - ${e.cantidad}</small>
                        </div>
                    </div>
                    <div class="d-flex justify-content-start align-items-center">
                        <h3 class="text-dark mb-0">${e.stock}</h3>
                        <i class="fa-solid fa-circle fa-2xs text-${color} ps-2"></i>
                    </div>
                </div>
            </a>
        `);
    });
}
function statsPedidosMonth(result){

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

function fillPedidos(data){
    $("#list-group-pedidos-recibido").html("");
    data
    .filter((item) => {
        return item.state == 1;
    })
    .forEach((item) => {
        addRowPedido(item);
    });
}
function addRowPedido(e){
    let items = JSON.parse(e.items);
    $("#list-group-pedidos-recibido").append(`
        <tr>
            <td class="text-center">
                <a href="/admin/pedidos?id=${e.id}" class="text-decoration-none text-primary">#${e.id}</a>
            </td>
            <td class="mb-0 text-dark">${e.nombre}</td>
            <td class="mb-0 text-dark">${items.total} ${items.total >= 2 ? "productos":"producto"}</td>
            <td class="mb-0 text-primary">₡ ${items.precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
            <td class="mb-0">
                <span class="badge b-pill badge-orange">Recibido</span>
            </td>
        </tr>
    `);
}

function createCharts(result){
    let months = [];
    let min, max = 0;
    result.forEach((item, i) => {
        months.push(moment().month(item.month-1).format('MMM YYYY'));
        if(i == 0){
            min = moment().month(item.month-1).format('D MMM YYYY');
        }
        if(i == result.length-1){
            max = moment().month(item.month-1).format('1 MMM YYYY');
        }
    });
    let labels = months;
    $("#dateIncomeRange").html(`${max} - ${min}`)
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
                duration: 1500
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

document.addEventListener("DOMContentLoaded", init);