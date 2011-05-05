var LoadingBar = {
    listener: {
        onChangeTab: function(e) {
            document.getElementById('loadingBar').value = 0;
        },
        
        onProgressChange: function(aBrowser,webProgress,request,curSelfProgress,maxSelfProgress,curTotalProgress,maxTotalProgress) {
            if (gBrowser.contentDocument === aBrowser.contentDocument) {
                var p = 100*(curTotalProgress-1)/(maxTotalProgress-1);
                
                if (p == 100)
                    p = 0;
                
                document.getElementById('loadingBar').value = p;
            }
        },
        
        onStateChange: function() {
            document.getElementById('loadingBar').value = 0;
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