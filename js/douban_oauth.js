var consumer = {};

consumer.douban =
{
  consumerKey: "042bc009d7d4a04d0c83401d877de0e7"
, consumerSecret: "a9bb2d7f8cc00110"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL: "http://www.douban.com/service/auth/request_token"
  , userAuthorizationURL: "http://localhost/oauth-provider/authorize"
  , accessTokenURL      : "http://localhost/oauth-provider/access_token"
  , echoURL             : "http://localhost/oauth-provider/echo"
  }
};

consumer.madgex =
{ consumerKey   : "key"
, consumerSecret: "secret"
, accessToken: "requestkey"
, accessTokenSecret: "requestsecret"
, echo: "accesskey"
, echoSecret: "accesssecret"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "http://echo.lab.madgex.com/request-token.ashx"
  , accessTokenURL      : "http://echo.lab.madgex.com/access-token.ashx"
  , echoURL             : "http://echo.lab.madgex.com/echo.ashx"
  }
};

consumer.mediamatic =
{ consumerKey   : "e388e4f4d6f4cc10ff6dc0fd1637da370478e49e2"
, consumerSecret: "0b062293b6e29ec91a23b2002abf88e9"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "http://oauth-sandbox.mediamatic.nl/module/OAuth/request_token"
  , userAuthorizationURL: "http://oauth-sandbox.mediamatic.nl/module/OAuth/authorize"
  , accessTokenURL      : "http://oauth-sandbox.mediamatic.nl/module/OAuth/access_token"
  , echoURL             : "http://oauth-sandbox.mediamatic.nl/services/rest/?method=anymeta.test.echo"
  }
};

consumer.termie =
{ consumerKey   : "key"
, consumerSecret: "secret"
, accessToken: "requestkey"
, accessTokenSecret: "requestsecret"
, echo: "accesskey"
, echoSecret: "accesssecret"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "http://term.ie/oauth/example/request_token.php"
  , userAuthorizationURL: "accessToken.html" // a stub
  , accessTokenURL      : "http://term.ie/oauth/example/access_token.php"
  , echoURL             : "http://term.ie/oauth/example/echo_api.php"
  }
};

consumer.initializeForm =
function initializeForm(form, etc, usage) {
    var selector = etc.elements[0];
    var selection = selector.options[selector.selectedIndex].value;
    var selected = consumer[selection];
    if (selected != null) {
        consumer.setInputs(etc, { URL           : selected.serviceProvider[usage + "URL"]
                                , consumerSecret: selected.consumerSecret
                                , tokenSecret   : selected[usage + "Secret"]
                                });
        consumer.setInputs(form, { oauth_signature_method: selected.serviceProvider.signatureMethod
                                 , oauth_consumer_key    : selected.consumerKey
                                 , oauth_token           : selected[usage]
                                 });
    }
    return true;
};

consumer.setInputs =
function setInputs(form, props) {
    for (p in props) {
        if (form[p] != null && props[p] != null) {
            form[p].value = props[p];
        }
    }
}

consumer.signForm =
function signForm(form, etc) {
    form.action = etc.URL.value;
    var accessor = { consumerSecret: etc.consumerSecret.value
                   , tokenSecret   : etc.tokenSecret.value};
    var message = { action: form.action
                  , method: form.method
                  , parameters: []
                  };
    for (var e = 0; e < form.elements.length; ++e) {
        var input = form.elements[e];
        if (input.name != null && input.name != "" && input.value != null
            && (!(input.type == "checkbox" || input.type == "radio") || input.checked))
        {
            message.parameters.push([input.name, input.value]);
        }
    }
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    //alert(outline("message", message));
    var parameterMap = OAuth.getParameterMap(message.parameters);
    for (var p in parameterMap) {
        if (p.substring(0, 6) == "oauth_"
         && form[p] != null && form[p].name != null && form[p].name != "")
        {
            form[p].value = parameterMap[p];
        }
    }
    return true;
};

$(function () {
  $(".step").hide();
  
  $("#consumer_key").text(consumer.douban.consumerKey);
  $("#consumer_secret").text(consumer.douban.consumerSecret);
  $("#step1").show();

  var message = {
    method: "GET",
    action: "http://www.douban.com/service/auth/request_token"
  };
  var accessor = {
    consumerKey: consumer.douban.consumerKey,
    consumerSecret: consumer.douban.consumerSecret,
    token: '',
    tokenSecret: ''
  };
  OAuth.completeRequest(message, accessor);
  var url = OAuth.addToURL(message.action, message.parameters);
  $("#request_url").text(url);
  $("#step2").show();

  WinJS.xhr({ url: url }).then(
    function (result) {
      $("#alert").text("success");
      $("#request_token").text(result.responseText);
      $("#step3").show();
    },
    function (result) {
      $("#alert").text("fail");
      /* $("#alert").text(JSON.stringify(result)); */
    }
    );


  /*
  $.ajax(url)
    .done(function(data) {
      $("request_token").text(data);
      $("#step3").show();
    })
    .fail(function(jqXHR, textStatus) {
      $("#alert").text(textStatus);
    });
    */
});