
document.querySelector("#welcome-box-buttons-getstarted").addEventListener("click", function() {
    window.location.href = server_ip + "/authentication";
});

document.querySelector("#welcome-box-buttons-sourcecode").addEventListener("click", function() {
    window.location.href = "https://github.com/nfoert/cardie";
});