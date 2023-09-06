import {onKeyUp} from './commons.js';

function init(){
    onButtonSend();
    onkeyups();
}
/**
 * Adds the keyup event to the inputs
 */
function onkeyups(){
    onKeyUp("username", "feedback", 5, {name: true, fb: true}, sendForm);
    onKeyUp("password", "feedback", 1, {name: true, fb: true}, sendForm);

    $("#username, #password").on('keyup',function(e){
        if($("#username").val() !== "" && $("#password").val() !== ""){
            $("#login-btn").prop('disabled', false);
        }else{
            $("#login-btn").prop('disabled', true);
        }
    })
}
/**
 * Adds the click event to the button
 */
function onButtonSend(){
    $("#login-btn").on('click',function(e){
        sendForm();
    });
}
/**
 * Sends the form to the server
 */
function sendForm(){
    buttonLoader(1);
    var username = $("#username").val();
    var password = $("#password").val();
    if(!validateForm(username, password)){
        showError(username, password);
        buttonLoader(0);
        return;
    }
    $.ajax({
        type: "POST",
        url: "/login",
        data: JSON.stringify({
            username: username,
            password: password
        }),
        contentType: "application/json",
    }).then((res) =>{
        authenticate(res.token, res.username, res.photo).then((e)=>{
            setTimeout(() => {
                buttonLoader(2);
                window.location.href = "/admin/main";
            }, 1000);
        });
    }, (err) =>{
        console.log(err);
        buttonLoader(0);
        if(err.status === 401){
            $("#feedback").html("Invalid username or password.");
        }
    });
}
function buttonLoader(put){
    if(put == 1){
        $("#login-btn").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
    }else if(put == 0){
        $("#login-btn").html(`<i class="fa-solid fa-lock op"></i> Sign in`);
    }else{
        $("#login-btn").html(`<i class="fa-solid fa-lock-open op"></i> Validated`);
    }
}

function showError(u,p){
    if(u === "" || u.length < 5){
        $("#username").addClass("is-invalid");
        $("#feedback").append("Please enter a valid username.<br>");
    }
    else if(p === "" || p.length < 1){
        $("#password").addClass("is-invalid");
        $("#feedback").append("Please enter a valid password.");
    }
}
/**
 * Checks the form for errors
 * @param {String} u name of the user
 * @param {String} p password of the user 
 * @returns {Boolean} true if the form is valid, false if not
 */
function validateForm(u, p){
    if(u === "" || p === ""){
        return false;
    }
    return true;
}

function authenticate(token, username, photo){
    return new Promise((resolve, reject) => {
        localStorage.setItem('username',username);
        localStorage.setItem('token',token);
        localStorage.setItem('photo',photo);
        const d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        var cookie = ['token=', token,';',expires ,'; path=/;'].join('');
        var usernamecookie = ['username=', username,';',expires ,'; path=/;'].join('');
        var photocookie = ['photo=', photo,';',expires ,'; path=/;'].join('');
        document.cookie = cookie;
        document.cookie = usernamecookie;
        document.cookie = photocookie;
        resolve();
    });
}
document.addEventListener("DOMContentLoaded", init);