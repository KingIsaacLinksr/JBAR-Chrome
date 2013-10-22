    //              // source URL                                     // resulting url
    // amazonuk     // http://www.amazon.co.uk/?tag=tekno09-20
    // amazon       // http://www.amazon.com/?tag=tekno-21
    // amazon       // http://www.amazon.de/?tag=tekno03-21
    // amazonfr     // http://www.amazon.fr/?tag=tekno0b-21
    // NOTE:  Once this is finalized, you might want to STRINK/ofuscate this some how.  

var configurations = {
      amazon : {
        rx: /^http.*?\.amazon\.com.*?(\/dp\/|\/o\/asin\/|\/exec\/obidos\/tg\/detail\/|\/gp\/product\/)/i,
        params: [
          { param: "tag", paramValue: "tekno09-20" }
        ]
      },
      amazonuk : {
       rx: /^http.*?\.amazon\.co\.uk.*?(\/dp\/|\/o\/asin\/|\/exec\/obidos\/tg\/detail\/|\/gp\/product\/)/i,
       params: [
         { param: "tag", paramValue: "tekno-21" }
       ]
      },
      amazonde : { 
        rx: /^http.*?\.amazon\.de.*?(\/dp\/|\/o\/asin\/|\/exec\/obidos\/tg\/detail\/|\/gp\/product\/)/i,
        params: [
          { param: "tag", paramValue: "tekno03-21" }
        ]
      },
      amazonfr : { 
        rx: /^http.*?\.amazon\.fr.*?(\/dp\/|\/o\/asin\/|\/exec\/obidos\/tg\/detail\/|\/gp\/product\/)/i,
        params: [
          { param: "tag", paramValue: "tekno0b-21" }
        ]
      },
    };
    
    function addTag(info) {
        var tUrl = info.url;
        var r = { cancel: false };
        
        console.log("Inside addTag() "); 
        
        for ( var config in configurations) { 
          if( configurations.hasOwnProperty(config) ) {
            if (tUrl.match(configurations[config].rx) ) { 
              //gracefully acknowledge existing affiliate tags
              if (tUrl.indexOf(configurations[config].params[0].param) == -1 ) {    
                r = { redirectUrl: tUrl+(tUrl.indexOf("?") == -1 ? "?" : "&") + createTag(configurations[config].params) };
                // A supported site was found
                // get the current window
                chrome.windows.getCurrent(function (currentWindow) {
                  // get the selected tab inside the current window
                  chrome.tabs.query({active: true, windowId: currentWindow.id}, function(tabs) {
                    chrome.pageAction.show(tabs[0].id);
                  });
                });
                break;
              }
            } 
          }
        }
        return r;
    }

    function createTag(params) {
      var result = "";
      for( var i = 0; i < params.length; i++ ) {
        result = result + params[i].param + "=" + params[i].paramValue;
        if( i >= 0 && i < params.length - 1 ) {
            result = result + "&";
        }
      }
      return result;
    }

  
  if (!chrome.webRequest.onBeforeRequest.hasListener(addTag)) {   
//    var site_urls = []; 
//    for (x in sites) { 
//      site_urls.push("*://*."+sites[x].url+"/*");
//    }
    
   var site_urls = [ 
            "http://*.amazon.com/*/dp/*",
            "http://*.amazon.com/dp/*",
            "http://*.amazon.com/exec/obidos/tg/detail/*",
            "http://*.amazon.com/gp/product/*",
            "http://*.amazon.com/o/*",
            "http://*.amazon.co.uk/*/dp/*",
            "http://*.amazon.co.uk/dp/*",
            "http://*.amazon.co.uk/exec/obidos/tg/detail/*",
            "http://*.amazon.co.uk/gp/product/*",
            "http://*.amazon.co.uk/o/*",
            "http://*.amazon.de/*/dp/*",
            "http://*.amazon.de/dp/*",
            "http://*.amazon.de/exec/obidos/tg/detail/*",
            "http://*.amazon.de/gp/product/*",
            "http://*.amazon.de/o/*",
            "http://*.amazon.fr/*/dp/*",
            "http://*.amazon.fr/dp/*",
            "http://*.amazon.fr/exec/obidos/tg/detail/*",
            "http://*.amazon.fr/gp/product/*",
            "http://*.amazon.fr/o/*",
    ];
  
    chrome.webRequest.onBeforeRequest.addListener(addTag, { urls: site_urls }, [ "blocking" ]); 
  }
