function validate(data) {
    var isValid = true;
    var error = ["emailInput", "error"];

    return {
        isValid: isValid,
        errorFields: error
    };
}

function getData() {
    var data = new Object();
    data.fio = document.getElementById("fioInput").value;
    data.email = document.getElementById("emailInput").value;
    data.phone = document.getElementById("phoneInput").value;

    return data;
}

function setData(data) {
    document.getElementById("fioInput").value = data.fio;
    document.getElementById("emailInput").value = data.email;
    document.getElementById("phoneInput").value = data.phone;
}

function submit() {
    var data = getData();
    var validateResult = validate(data);

    var field;
    if (!validateResult.isValid)
        validateResult.errorFields.forEach(function (field, errorFields) {
            //FIXME будет не корректное поведение при повторных ошибочных попытках
            document.getElementById(field).className += "error";
        });
    else {


        var json = ["resources/success.json", "resources/progress.json", "resources/error.json"];


        // if (request.status == 200) {

        sendRequest();

        function sendRequest() {
            var request = new XMLHttpRequest();
            request.open("GET", json[Math.floor(Math.random() * (json.length))], false);
            request.send();

            if (request.status == 200) {

                var jsonStatus = JSON.parse(request.responseText)["status"];
                var resultContainer = document.getElementById("resultContainer");

                if (jsonStatus != "progress") {
                    switch (jsonStatus) {
                        case "success":
                            resultContainer.className = "success";
                            resultContainer.innerHTML = "Success";
                            break;
                        case "error":
                            resultContainer.className = "error";
                            resultContainer.innerHTML = JSON.parse(request.responseText)["reason"];
                            break;
                    }
                }
                else {
                    resultContainer.innerHTML = "";
                    resultContainer.className = "progress";
                    var timeout = JSON.parse(request.responseText)["timeout"];

                    setTimeout(sendRequest, timeout);
                }
            }
        }
    }
}