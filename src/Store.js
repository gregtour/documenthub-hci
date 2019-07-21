/* */
import Teams from './teams';
import Content from './content';
import Events from './events';
import Rounds from './rounds';

Events.reverse();

var MakeXHR = function (URL, Params, successCallback, failureCallback) 
{
	  var xhr = new XMLHttpRequest();
	  xhr.onreadystatechange = function (xhrevent) {
		  if (xhr.readyState == 4) {
			  if (xhr.status == 200) {
				  successCallback(xhr.response);
			  } else {
				  failureCallback(xhr.status);
			  }
		  }
	  }
	  xhr.onerror = function () { failureCallback(-1); }
	  // xhr.onprogress = function () {}
	  xhr.open("POST", URL, /*async*/ true);
	  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  xhr.timeout = 25000; /* 25 seconds */
	  xhr.responseType = "text";
	  xhr.send(Params);
};

class DocumentHubStore
{
	_uploadData() 
	{
		let mydata = {
			"X": (this.filtersEnabled ? 1 : 0),
			"Y": this.stopwatches
		}
		const url = "http://brainplex.net/hci/data.php";
		var params = "&data=" + encodeURIComponent(JSON.stringify(mydata));
		let none = function(){};
		MakeXHR(url, params, none, none);
	}

	constructor() 
	{
		this.handlers = {};

		this.filters = {
			"created": true,
			"edited": true,
			"shared": true,
			"my group": true,
			"other groups": true
		};

		this.searchTerms = "";
		this.searchDirectory = {};
		this.acceptedTerms = false;

		this.filtersEnabled = (Math.random() > 0.5000);

		this.stopwatches = [];
		this.lastTime = null;

		this.round = 0;
	}

	//
	_lapTime() {
		let curTime = new Date();
		if (this.lastTime) {
			let time = curTime - this.lastTime;
			this.stopwatches.push(time);
			console.log("time: " + time);
		}
		this.lastTime = curTime;
	}

	getPrompts() {
		let messages = [];
		for (let i = 0; i <= this.round; i++) {
			messages.push(Rounds[i].message);
		}
		return messages;
	}

	getObjective() {
		return Rounds[this.round].file;
	}

	tryDocument(doc) 
	{
		if (doc === this.getObjective()) 
		{
			this._lapTime();
			this.round++;

			if (this.round < Rounds.length) 
			{
				this.fire("next");
			} 
			else 
			{
				/* upload results to server */
				this._uploadData();

				/* display thank you message */
				this.setCompleted();
			}

			return true;
		}
		return false;
	}

	isCompleted() 
	{
		return localStorage.getItem('done') || false;;
	}

	setCompleted() 
	{
		localStorage.setItem('done', true);
		this.fire('thanks');
	}

	isAccepted() 
	{
		return this.acceptedTerms;
	}

	setAccepted() 
	{
		this._lapTime();
		this.acceptedTerms = true;
		this.fire('accept');
	}

	// keyword search
	setSearchTerms(phrase) {
		if (this.searchTerms !== phrase) {
			this.searchTerms = phrase;
			this.searchDirectory = {};
			this.fire('change');
		}
	}

	checkSearchTerms() {
		return this.searchTerms;
	}

	// filter flags
	setFilter(filterID, condition) {
		this.filters[filterID] = !!condition;
		this.fire('change');
	}

	checkFilter(filterID) {
		return !!this.filters[filterID];
	}

	toggleFilter(filterID) {
		this.setFilter(filterID, ! this.checkFilter(filterID));
	}

	// keyword search
	_checkDocument(doc) {
		if (this.searchDirectory[doc] !== undefined)
		{
			return this.searchDirectory[doc];
		}

		let result = false;

		let keywords = this.searchTerms.toLowerCase();
		keywords = keywords.split(' ').filter(x => x.length);
		let content = doc + ' ' + Content[doc];
		content = content.toLowerCase();

		if (keywords.length === 0) {
			result = true;
		}
		else
		{
			for (let kw of keywords) {
				if (content.indexOf(kw) >= 0) {
					result = true;
					break;
				}
			}
		}

		this.searchDirectory[doc] = result;
		return result;
	}

	// return actual results
	getResults()
	{
		let validGroups = [];
		if (this.checkFilter('my group')) {
			validGroups.push("Products")
		}
		if (this.checkFilter('other groups')) {
			validGroups.push("Accounts");
			validGroups.push("Research");
			validGroups.push("Support");
		}
		return (
			Events.filter(evt => {
				return (this.checkFilter(evt.type)
					&& (validGroups.indexOf(evt.team) >= 0
						|| validGroups.indexOf(evt.with) >= 0)
					&& this._checkDocument(evt.doc));
			}).map(evt => { return {
				"title": evt.doc,
				"user": evt.user,
				"withTeam": evt.with,
				"group": evt.team,
				"date": new Date(evt.time),
				"text": Content[evt.doc].substring(0, 1000),
				"type": evt.type
		} }));
	}

	// events
    bind(eventName, handler) 
    {
        let key = 'e_' + eventName;
        let handlers = this.handlers[key] || [];
        if (handlers.indexOf(handler) < 0) {
            handlers.push(handler);
        }
        this.handlers[key] = handlers;
    }

    fire(eventName) 
    {
        let key = 'e_' + eventName;
        let handlers = this.handlers[key] || [];
        for (let handle of handlers) {
            handle();
        }
    }
}


var Store = new DocumentHubStore();

export default Store;