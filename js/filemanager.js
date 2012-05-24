(function () {
    "use strict";
    
    function initialize() {
          var openpicker = new Windows.Storage.Pickers.FileOpenPicker();
              openpicker.fileTypeFilter.replaceAll([".txt", ".rtf"]);
              openpicker.pickMultipleFilesAsync().then(function (files) {
                      var fileNames = '';
                   files.forEach(function (file) {
                          fileNames += file.displayName + '<br/>';
                          });
                     $('#body').html(fileNames);
                  });
    }


    document.addEventListener("DOMContentLoaded", initialize, false);

})();
