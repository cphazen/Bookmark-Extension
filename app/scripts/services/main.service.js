app.factory('bookmarks', function () {
    var bookmarks = {};
    bookmarks.list = [];

    // get list of bookmarks from ls
    bookmarks.get = function () {
        bookmarks.list = localStorage.getItem('bookmarks') ? JSON.parse(localStorage.getItem('bookmarks')) : [];
    };

    // add to list of bookmarks
    bookmarks.add = function (item) {
        this.remove(item.id);
        bookmarks.list.push(item);
        this.save();
    };

    // find location of bookmark
    bookmarks.indexOf = function (url) {
        var idx = null;
        var ct = bookmarks.list.length;
        for (var i = 0; i < ct; i++) {
            if (bookmarks.list[i].url === url) {
                idx = i;
                break;
            }
        }
        if (idx !== null) {
            return idx;
        } else return -1;
    };

    // find location of bookmark
    bookmarks.indexOfID = function (id) {
        var idx = null;
        var ct = bookmarks.list.length;
        for (var i = 0; i < ct; i++) {
            if (bookmarks.list[i].id === id) {
                idx = i;
                break;
            }
        }
        if (idx !== null) {
            return idx;
        } else return -1;
    };

    //
    bookmarks.indexOfColor = function(hex){
        var idx = null;
        var ct = bookmarks.list.length;
        for (var i = 0; i < ct; i++) {
            if (bookmarks.list[i].color === hex) {
                idx = i;
                break;
            }
        }

        if (idx !== null) {
            return idx;
        } else return -1;
    };

    // remove bookmark
    bookmarks.remove = function (id) {
        idx = this.indexOfID(id);
        if (idx > -1) {
            bookmarks.list.splice(idx, 1);
            this.save();
        }
    };

    // save to ls
    bookmarks.save = function () {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks.list));
    };

    return bookmarks;
});

app.factory('activeBookmark', ['bookmarks', '$location', function (bookmarks, $location) {
    var bookmark = {};

    bookmark.item = {};

    //properties
    bookmark.item.is_folder = false;     // boolean value
    bookmark.item.id = '';               // unique identified (timestamp)
    bookmark.item.title = '';            // name
    bookmark.item.url = '';              // address (mark only)
    bookmark.item.description = '';      // description
    bookmark.item.tags = [];             // array of tags
    bookmark.item.color = '';            // color hex            
    bookmark.item.icon = '';             // link to icon      
    bookmark.item.thumbnail = '';        // uri of thumbnail
    bookmark.item.dateAdded = '';        // timestamp of date added
    bookmark.item.dateVisited = '';      // timestamp of date last visited
    bookmark.item.freq = '';             // visit count
    bookmark.item.parent = '';           // id of parent
    bookmark.item.children = [];         // array of ids of parents
    bookmark.item.order = 0;             // value of order within parent

    //functions
    //use before storing in localStorage
    bookmark.toCompressedJSON = function () {
        var compressedBookmark = bookmark.item;
        compressedBookmark.thumbnail = LZString.compress(bookmark.item.thumbnail);
        return compressedBookmark;
    }
    //use to save to localStorage
    bookmark.saveToLS = function () {
        localStorage.setItem('activeBookmark', JSON.stringify(toCompressedJSON()));
    }
    //use to retrieve from LS
    bookmark.getFromLS = function () {
        var compressedBookmark = localStorage.getItem('activeBookmark') ? JSON.parse(localStorage.getItem(lsName)) : {};
        bookmark.item = compressedBookmark;
        bookmark.item.thumbnail = LZString.decompress(compressedBookmark.thumbnail);
    }
    //use to prepopulate add with tab info
    bookmark.getTab = function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var tab = tabs[0];
            var idx = bookmarks.indexOf(tab.url);
            if (idx > -1) {
                bookmark.item = bookmarks.list[idx];
                return;
            }
            bookmark.item.is_folder = false;
            bookmark.item.id = '';
            bookmark.item.title = tab.title;
            bookmark.item.url = tab.url;
            bookmark.item.description = '';
            bookmark.item.tags = [];
            bookmark.item.color = '#ffffff';
            bookmark.item.icon = "http://www.google.com/s2/favicons?domain=" + tab.url;
            bookmark.item.dateVisited = new Date().getTime();
            bookmark.item.parent = '';
            bookmark.item.children = [];
            //bookmark.setThumbnailScreenshot();
            bookmark.item.dateAdded = '';
            bookmark.item.freq = 1;
            bookmark.item.order = 0;
             
        });
    }
    //populate with edit info
    bookmark.getMark = function (id) {
        var idx = bookmarks.indexOfID(id);
        if (idx > -1) {
            bookmark.item = bookmarks.list[idx];
        }
    }
    //for folders
    bookmark.getFolder = function (id) {
        var idx = bookmarks.indexOfID(id);
        if (idx > -1) {
            bookmark.item = bookmarks.list[idx];
        } else {
            bookmark.item.is_folder = true;
            bookmark.item.id = '';
            bookmark.item.title = 'New Folder';
            bookmark.item.url = '';
            bookmark.item.description = '';
            bookmark.item.tags = [];
            bookmark.item.color = '#ffffff';
            bookmark.item.icon = '';
            bookmark.item.dateVisited = new Date().getTime();
            bookmark.item.parent = '';
            bookmark.item.children = [];
            bookmark.item.dateAdded = '';
            bookmark.item.freq = 1;
            bookmark.item.order = 0;
        }
    }
    //use to get thumbnail
    bookmark.setThumbnailScreenshot = function () {
        var options = {};
        options.format = "png";
        options.quality = 1;
        var temp = chrome.tabs.captureVisibleTab(options, function (screenshotUrl) {
            bookmark.item.thumbnail = screenshotUrl;
        });
    }
    //save
    bookmark.save = function() {
        var temp = bookmark.item;
        if (bookmarks.indexOf(temp.url) > -1) {
            bookmarks.add(temp);
        } else {
            var d = new Date();
            temp.id = d.getTime();
            temp.dateAdded = d.getTime();
            bookmarks.add(temp);
        }
        $location.path("/");
    }
    //when accessed
    bookmark.click = function(){
        bookmark.item.dateVisited = new Date.getTime();
        bookmark.item.freq++;
        this.save();
    }
    


    return bookmark;
}]);

app.factory('color', ['bookmarks', function (bookmarks) {
    var colors = {};
    colors.list = [];

    // get colors from ls
    colors.get = function () {
        if (localStorage.getItem('colors')) {
            colors.list = JSON.parse(localStorage.getItem('colors'));
        }
        else {
            colors.list = [
                { 'name': 'None', 'value': '#ffffff'},
                { 'name': 'Red', 'value': '#f44336'},
                { 'name': 'Pink', 'value': '#e91e63'},
                { 'name': 'Purple', 'value': '#9c27b0' },
                { 'name': 'Blue', 'value': '#2979ff' },
                { 'name': 'Green', 'value': '#69f0ae' },
                { 'name': 'Yellow', 'value': '#ffff8d' },
                { 'name': 'Orange', 'value': '#ff9800' }
            ];
            this.save();
        }
    }

    colors.reset = function(){
        colors.list = [
                { 'name': 'None', 'value': '#ffffff' },
                { 'name': 'Red', 'value': '#f44336' },
                { 'name': 'Pink', 'value': '#e91e63' },
                { 'name': 'Purple', 'value': '#9c27b0' },
                { 'name': 'Blue', 'value': '#2979ff' },
                { 'name': 'Green', 'value': '#69f0ae' },
                { 'name': 'Yellow', 'value': '#ffff8d' },
                { 'name': 'Orange', 'value': '#ff9800' }
        ];
    }

    colors.add = function (name, value) {
        if (this.indexOf(value) > -1) {
            return "<strong>Oops! </strong>This color already exists!"
        } else {
            var temp = { 'name': name, 'value': value };
            colors.list.push(temp);
            this.save();
        }
    };

    colors.remove = function (hex) {
       var idx = this.indexOf(hex);
       if(idx > -1){
           colors.list.splice(idx, 1);
           idx = 0;
           while (idx > -1) {
               idx = bookmarks.indexOfColor(hex);
               if (idx > -1) bookmarks.list[idx].color = "#ffffff";
           }
       }
       this.save();
    }

    colors.indexOf = function (hex) {
        var idx = null;
        var ct = colors.list.length;
        for (var i = 0; i < ct; i++) {
            if (colors.list[i].color === hex) {
                idx = i;
                break;
            }
        }

        if (idx !== null) {
            return idx;
        } else return -1;
    };

    // save to ls
    colors.save = function () {
        localStorage.setItem('colors', JSON.stringify(colors.list));
    };

    return colors;
}]);

app.factory('state',  function () {
    return;
});

app.factory('settings', function () {
    return;
});

app.filter('folder', function () {
    return function(input, is_folder){
        var out = [];
        var i = 0;
        var l = input.length;
        for (i = 0; i < l; i++) {
            if (input[i].is_folder == is_folder) out.push(input[i]);
        }
        return out;
    }
});