const axios = require('axios');
require('dotenv').config();

function sendAlertMessage(message) {
    console.log("Sending Telegram message");
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=HTML`;
    axios.get(url, {headers: {'Content-Type': 'application/json'}})
    .then((response) => {
        if(response.status == 200){
            console.log("Telegram message sent successfully");
        }else{
            console.log("Telegram message sent failed");
        }
    });
}

module.exports = {
    sendAlertMessage
}