

function init(){
    createCharts();
}

function createCharts(){
    let months = [];
    let min, max = 0;
    for(let i = 0; i < 6; i++){
        
        months.push(moment().subtract(i, 'months').format('MMM YYYY'));
        min = moment().subtract(i, 'months').format('1 MMM YYYY');
        max = moment().format('D MMM YYYY');
    }
    let labels = months.reverse();
    $("#dateIncomeRange").html(`
        ${min} - ${max}
    `)

    let y = [1200, 1009, 100, 500, 2000, 530, 1400];
    let data = [];
    for(let i = 0; i < 6; i++){
        data.push({
            x: labels[i],
            y: y[i]
        })
    }
    console.log(data);
    
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

    console.log(gradient);

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