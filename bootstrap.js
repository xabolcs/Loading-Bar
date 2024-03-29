

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");

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
        $("urlbar").style.backgroundSize = '0% 100%';
      },
      onProgressChange: function(aBrowser,webProgress,request,curSelfProgress,maxSelfProgress,curTotalProgress,maxTotalProgress) {
        if (gBrowser.contentDocument === aBrowser.contentDocument) {
            var val = (curTotalProgress-1)/(maxTotalProgress-1);
            $("urlbar").style.backgroundSize = (val==1?0:100*val) + '% 100%';
        }
      },
      onStateChange: function() {
        $("urlbar").style.backgroundSize = '0% 100%';
      }
    }
  };

  // 
  gBrowser.tabContainer.addEventListener('TabSelect',LoadingBar.listener.onChangeTab,false);
  gBrowser.addTabsProgressListener(LoadingBar.listener);

  unload(function() {
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
      addon.getResourceURI("chrome/skin/ff-overlay.css"), sss.USER_SHEET);

  unload(function() {
    sss.unregisterSheet(
        addon.getResourceURI("chrome/skin/ff-overlay.css"), sss.USER_SHEET);
  });
};
function shutdown(data, reason) unload();
