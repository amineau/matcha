
$(function() {


  /***********************Notif Settings************************/
  /*************************************************************/

  var successNotif = new Notif("Success Message", "success");
  var errorNotif = new Notif("Error Message", "error");
  var confirmedNotif = new Notif("Confirm Message", "confirmed");
  var defaultNotif = new Notif("Default Message", "default");
  document.addEventListener('DOMContentLoaded', function() {
    Notif.setWrapperOptions({
      duration: 2500
    });
  }, false);

  /*************************************************************/

  /***********************Picker Settings************************/
  /*************************************************************/


  /*************************************************************/

})
