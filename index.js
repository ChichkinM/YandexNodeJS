var fioFormat = /[a-zа-я \-']+$/i;
var fioErrorUppercase = /[a-zа-я][A-ZА-Я]+|[A-ZА-Я]{2,}| [a-zа-я]+|^[a-zа-я]/;
var emailFormat = /[A-Za-z0-9\-\.]+@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/;
var emailErrorRepSym = /(\.){2,}|(\-){2,}/;
var emailErrorLateralSym = /(^[\.\-[0-9])|([\.\-]@)/;
var emailErrorSize = /((.){31,}@)/;
var phoneFormat = /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
var phoneSymForDel = /[^[0-9]/g;

var phoneSumLimit = 30;
var json = ["resources/json/success.json", "resources/json/progress.json", "resources/json/error.json"];

var ui = {
    inpFio: "fioInput",
    inpEmail: "emailInput",
    inpPhone: "phoneInput",
    btnSubmit: "submitButton",
    divResult: "resultContainer"
};

var uiProperty = {
    classError: "error",
    classSuccess: "success",
    classProgress: "progress",
    textSuccess: "Success"
};

var jsonFields = {
    fieldStatus: "status",
    fieldProgressTimeout: "timeout",
    fieldErrorReason: "reason",
    statusSuccess: "success",
    statusProgress: "progress",
    statusError: "error"
};


function validate(data) {
    var isValid = true;
    var error = new Array();

    console.log(ui.test1);

    if (data.fio.split(' ').length != 3 || data.fio.match(fioFormat) == null || data.fio.match(fioErrorUppercase) != null) {
        isValid = false;
        error[error.length] = ui.inpFio;
    }

    if (data.email.match(emailFormat) == null || data.email.match(emailErrorRepSym) != null || data.email.match(emailErrorLateralSym) != null) {
        isValid = false;
        error[error.length] = ui.inpEmail;
    }

    var phoneSum = 0;
    var phoneStr= data.phone.replace(phoneSymForDel, '');
    console.log(phoneStr);
    for(var i = phoneStr.length - 1; i >= 0; i--)
        phoneSum += parseInt(phoneStr[i]);

    if (data.phone.match(phoneFormat) == null || phoneSum > phoneSumLimit) {
        isValid = false;
        error[error.length] = ui.inpPhone;
    }


    console.log(data.fio.match(fioFormat) + " + " + data.fio.match(fioErrorUppercase) + " | " + data.fio);
    console.log(data.email.match(emailFormat) + " " + data.email.match(emailErrorRepSym) + " " + data.email.match(emailErrorLateralSym) + " " + data.email.match(emailErrorSize));
    console.log(data.phone.match(phoneFormat) + " " + phoneSum);


    return {
        isValid: isValid,
        errorFields: error
    };
}

function getData() {
    var data = new Object();
    data.fio = document.getElementById(ui.inpFio).value.trim();
    data.email = document.getElementById(ui.inpEmail).value.trim();
    data.phone = document.getElementById(ui.inpPhone).value.trim();

    return data;
}

function setData(data) {
    document.getElementById(ui.inpFio).value = data.fio;
    document.getElementById(ui.inpEmail).value = data.email;
    document.getElementById(ui.inpPhone).value = data.phone;
}

function submit() {
    var data = getData();
    var validateResult = validate(data);

    if (validateResult.errorFields.indexOf(ui.inpFio) == -1)
        document.getElementById(ui.inpFio).classList.remove(uiProperty.classError);
    if (validateResult.errorFields.indexOf(ui.inpEmail) == -1)
        document.getElementById(ui.inpEmail).classList.remove(uiProperty.classError);
    if (validateResult.errorFields.indexOf(ui.inpPhone) == -1)
        document.getElementById(ui.inpPhone).classList.remove(uiProperty.classError);

    if (!validateResult.isValid)
        validateResult.errorFields.forEach(function (field, errorFields) {
            var element = document.getElementById(field);
            if (!element.classList.contains(uiProperty.classError))
                element.className += " " + uiProperty.classError;
        });
    else {
        // document.getElementById(ui.btnSubmit).setAttribute("disabled", "disabled");
        sendRequest();

        function sendRequest() {
            var request = new XMLHttpRequest();
            request.open("GET", json[Math.floor(Math.random() * (json.length))], false);
            request.send();

            if (request.status == 200) {

                var jsonStatus = JSON.parse(request.responseText)[jsonFields.fieldStatus];
                var resultContainer = document.getElementById(ui.divResult);

                if (jsonStatus != jsonFields.statusProgress) {
                    switch (jsonStatus) {
                        case jsonFields.statusSuccess:
                            resultContainer.className = uiProperty.classSuccess;
                            resultContainer.innerHTML = uiProperty.textSuccess;
                            break;
                        case jsonFields.statusError:
                            resultContainer.className = uiProperty.classError;
                            resultContainer.innerHTML = JSON.parse(request.responseText)[jsonFields.fieldErrorReason];
                            break;
                    }
                }
                else {
                    resultContainer.innerHTML = "";
                    resultContainer.className = uiProperty.classProgress;
                    var timeout = JSON.parse(request.responseText)[jsonFields.fieldProgressTimeout];

                    setTimeout(sendRequest, timeout);
                }
            }
        }
    }
}