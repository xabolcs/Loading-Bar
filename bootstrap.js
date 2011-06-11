

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");

const NS_XUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

(function(global) global.include = function include(src) (
    Services.scriptloader.loadSubScript(src, global)))(this);

var addon = {
  getResourceURI: function(filePath) Services.io.newURI(
      __SCRIPT_URI_SPEC__ + "/../" + filePath, null, null)
};

function main(window) {
  var {document, gBrowser} = window;
  function $(id) document.getElementById(id);

  var LoadingBar = {
    listener: {
      onChangeTab: function(e) {
        loadingBar.value = 0;
      },
      onProgressChange: function(aBrowser,webProgress,request,curSelfProgress,maxSelfProgress,curTotalProgress,maxTotalProgress) {
        if (gBrowser.contentDocument === aBrowser.contentDocument) {
            var p = 100*(curTotalProgress-1)/(maxTotalProgress-1);

            if (p == 100) p = 0;

            loadingBar.value = p;
        }
      },
      onStateChange: function() {
        loadingBar.value = 0;
      }
    }
  };

  // Create XUL
  var hbox = document.createElementNS(NS_XUL, "hbox");
  hbox.setAttribute("id", "addon-loadingbar-hbox");
  var loadingBar = document.createElementNS(NS_XUL, "progressmeter");
  loadingBar.setAttribute("id", "addon-loadingbar-progressmeter");
  loadingBar.setAttribute("mode", "determined");
  loadingBar.setAttribute("style", "background:-moz-field;-moz-appearance:none;border:0;");
  hbox.appendChild(loadingBar);
  var urlBarContainer = $("urlbar-container");
  urlBarContainer.appendChild(hbox);

  // 
  gBrowser.tabContainer.addEventListener('TabSelect',LoadingBar.listener.onChangeTab,false);
  gBrowser.addTabsProgressListener(LoadingBar.listener);

  unload(function() {
    // Remove XUL
    urlBarContainer.removeChild(hbox);

    // Remove tab select listener
    gBrowser.tabContainer.removeEventListener('TabSelect',LoadingBar.listener.onChangeTab,false);

    // Remove tab progress listener
    gBrowser.removeTabsProgressListener(LoadingBar.listener);
  }, window);
}

function install(data) {}
function uninstall() {}
function startup(data, reason) {
  include(addon.getResourceURI("includes/utils.js").spec);

  watchWindows(main, "navigator:browser");

  var sss = Cc["@mozilla.org/content/style-sheet-service;1"]
      .getService(Ci.nsIStyleSheetService);
  sss.loadAndRegisterSheet(
      addon.getResourceURI("chrome/skin/ff-overlay.css"), sss.AGENT_SHEET);

  unload(function() {
    sss.unregisterSheet(
        addon.getResourceURI("chrome/skin/ff-overlay.css"), sss.AGENT_SHEET);
  });
};
function shutdown(data, reason) unload();
