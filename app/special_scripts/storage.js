'use strict';

var bookmarkStorageService = function() {
  var lsName = 'bookmarks';
  var data = localStorage.getItem(lsName) ? JSON.parse(localStorage.getItem(lsName)) : [];
 
  return {
   	 
		get: function() {
			return data;
		},

		add: function(item) {
			this.remove(item.id);
			data.push(item);
			this.save();
		},

		remove: function(id) {
			var idx = null;
			for(var i = 0; i < data.length; i++) {
				if(data[i].id === id) {
					idx = i;
					break;
				}
			}

			if(idx !== null) {
				data.splice(idx, 1);
				this.save();
			}
		},
		save: function() {
			localStorage.setItem(lsName, JSON.stringify(data));
		}
		
  };
};