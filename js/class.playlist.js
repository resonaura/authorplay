var tracks, startValue, endValue, trarray, num, title, author, currentTID, currentTNUM;

function explode(delimiter, string) {
	var emptyArray = { 0: '' };
	if ( arguments.length != 2
		|| typeof arguments[0] == 'undefined'
		|| typeof arguments[1] == 'undefined' )
	{
		return null;
	}
	if ( delimiter === ''
		|| delimiter === false
		|| delimiter === null )
	{
		return false;
	}
	if ( typeof delimiter == 'function'
		|| typeof delimiter == 'object'
		|| typeof string == 'function'
		|| typeof string == 'object' )
	{
		return emptyArray;
	}
	if ( delimiter === true ) {
		delimiter = '1';
	}
	return string.toString().split ( delimiter.toString() );
}

class Playlist {
	constructor(tracks, title, author) {
		this.tracks = tracks;
		this.title = title;
		this.author = author;
	}
	set(newTracks) {
		this.tracks = newTracks;
	}
	get() {
		return this.tracks;
	}
	getArray() {
		trarray = explode(", ", this.tracks);
		return trarray;
	}
	startValue() {
		trarray = explode(", ", this.tracks);
		startValue = trarray[0];
		return startValue;
	}
	endValue() {
		trarray = explode(", ", this.tracks);
		endValue = trarray[trarray.length - 1];
		return endValue;
	}
	count() {
		trarray = explode(", ", this.tracks);
		num = trarray.length;
		return num;
	}
	setTitle(newTitle) {
		this.title = newTitle;
	}
	setAuthor(newAuthor) {
		this.author = newAuthor;
	}
	getTitle(num) {
		trarray = explode(", ", this.title);
		return trarray[num - 1];
	}
	
	getAuthor(num) {
		trarray = explode(", ", this.author);
		return trarray[num - 1];
	}
	currentId(newCID) {
		if(newCID == undefined)
			return currentTID;
		else
			currentTID = newCID;
	}
	currentNum(newCNUM) {
		if(newCNUM == undefined)
			return currentTNUM;
		else
			currentTNUM = newCNUM;
	}
}