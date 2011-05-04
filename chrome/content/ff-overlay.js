var LoadingBar = {
    listener: {
        onChangeTab: function(e) {
            document.getElementById('urlbar').completed = 0;
        },
        
        onProgressChange: function(aBrowser,webProgress,request,curSelfProgress,maxSelfProgress,curTotalProgress,maxTotalProgress) {
            if (gBrowser.contentDocument === aBrowser.contentDocument)
                document.getElementById('urlbar').completed = (curTotalProgress-1)/(maxTotalProgress-1);
        },
        
        onStateChange: function() {
            document.getElementById('urlbar').completed = 0;
        },
        
        onLocationChange: function() {},
        onSecurityChange: function() {},
        onStatusChange: function() {}
    }
};

// Hook events when the addon finishes loading
window.addEventListener('load',function() {
    gBrowser.tabContainer.addEventListener('TabSelect',LoadingBar.listener.onChangeTab,false);
    gBrowser.addTabsProgressListener(LoadingBar.listener);
},false);