(function(eventington, $, undefined) {
  
    (function(ui, $, undefined) {
      
      /*
       * Slide down the div at the top of the screen.
       * After 30 seconds, slide it up out of the way again.
       */
      ui.showError = function(errorMessage) {
        $("#error").text(errorMessage);
        
        $("#error").slideDown(500, function() {
          
          
          setTimeout("$('#error').slideUp(500);", 5000);
          
        });
        
      };
      

    }(eventington.ui = eventington.ui || {}, $)); //self executing anonymous functon to create the namespace methods

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods
