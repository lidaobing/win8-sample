// default.js
(function () {
  "use strict";

  function loadRemoteXhr() {

    document.getElementById("xhrOutput").innerHTML = "";
    WinJS.xhr({ url: "http://jandan.net/rss" }).then(
            xhrParseXml, xhrError
            );

  }

  function xhrParseXml(result) {

    var outputArea = document.getElementById("xhrOutput");
    var xml = result.responseXML;

    if (xml) {
      var items = xml.selectNodes("rss/channel/item");
      if (items) {
        var length = Math.min(10, items.length);
        for (var i = 0; i < length; i++) {
          var link = document.createElement("a");
          var newLine = document.createElement("br")
          link.setAttribute("href", items[i].selectSingleNode("link").text);
          link.innerText = (i + 1) + ") " + items[i].selectSingleNode("title").text;
          outputArea.appendChild(link);
          outputArea.appendChild(newLine);
        }
      } else {
        outputArea.innerHTML = "There are no items available at this time";
      }
    } else {
      outputArea.innerHTML =
                "Unable to retrieve data at this time. Status code: " + statusCode;
    }
  }

  function xhrError(result) {

    var statusCode = result.status;
    var outputArea = document.getElementById("xhrOutput");
    outputArea.innerHTML = "Unable to retrieve data at this time. Status code: " + statusCode;
  }

  $(function () {
    loadRemoteXhr();
  });
})();
