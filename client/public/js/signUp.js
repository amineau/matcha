var regLog 	= /^[a-zA-Z0-9'àâéèêôùûçÀÂÉÈÔÙÛÇ\s_-]{1,50}$/
var regMail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
var regName	= /^[a-zA-Z'àâéèêôùûçÀÂÉÈÔÙÛÇ\s-]{1,50}$/

function displayError(champ, err, mes = null) {
    if ($("#" + champ.id + "Err"))
        $("#" + champ.id + "Err").remove()	
    if (err) {
        $("#" + champ.id).addClass("error")
    if (mes)
        $("#" + champ.id).after("<div id='" + champ.id + "Err'>" + mes + "</div>")
    } else {
     $("#" + champ.id).removeClass("error")
    }
}

function testLength(str, max) {
    if (str.length == 0)
       return null
    if (str.length > max)
       return "Trop long"
    return "Caractère(s) non conforme(s)"
}

function verifLogin(champ) {
    if (champ.value && !champ.value.match(regLog)) {
        displayError(champ, true, testLength(champ.value, 50))
        return false
    } else {
        displayError(champ, false)
        return true
    }
}

function verifEmail(champ) {
    if (champ.value && !champ.value.match(regMail)) {
        displayError(champ, true)
        return false
     } else {
        displayError(champ, false)
        return true
     }
}

function verifName(champ) {
    if (champ.value && !champ.value.match(regName)) {
        displayError(champ, true, testLength(champ.value, 50))
        return false
    } else {
        displayError(champ, false)
        return true
    }
}

function verifPass(champ) {
    if (champ.value && champ.value.length < 6) {
        displayError(champ, true, "Mot de passe trop court")
        return false
    } else if (champ.value && (!champ.value.match(/[a-zA-Z]/) || !champ.value.match(/[0-9]/))) {
        displayError(champ, true, "Le mot de passe doit contenir au moins un lettre et un chiffre")
    } else {
        displayError(champ, false)
        return true
    }
}

function verifForm(f) {
    var loginOk = verifLogin(f.login),
        emailOk = verifEmail(f.email),
        fisrtOk = verifName(f.firstName),
        lastOk	= verifName(f.lastName),
        passOK	= verifPass(f.password)

    if (loginOk && emailOk && fisrtOk && lastOk && passOK)
        return true
    alert("Veuillez remplir correctement tous les champs")
    return false
}