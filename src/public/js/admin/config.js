function init(){
    
}

async function getDashboardConfiguration(){
    const config = await axios.get("/api/v1/dashboard/one/Productos");
    showDashboardConfiguration(config.data);
}

async function showDashboardConfiguration(data){
    data.buttons.forEach(button => {
        $(`#productos-${button.extend}`).show();
        $(`#productos-${button.extend}`).addClass("active");
    });
}

function salvarDashboardConfig(){
    
}
document.addEventListener("DOMContentLoaded", init);