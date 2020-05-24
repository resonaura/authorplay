/*/////////////////////////////*/
/*      AuthorPlay Player      */
/*         v. 4.2.0            */
/*/////////////////////////////*/

var song = new Audio(); //Create audio object
var curr_song, curr_num, $id, $song_buffered, newCurrent, pl = ""; //Set default variables
var playlist = new Playlist(); //Init playlist class in variable

$(document).ready(function() { //On page ready
	//Get all tracks count
	var $allSongsNum = $("[data-num=1]").parent().parent().attr("data-all");
	onVol = function() { //Function for volume set event
		volume.style.width = (song.volume * 100) + "%"; //Set volumeBar element width
	};
	//Toggle play function
	function togglePlay() {
		if (song.paused) { //If track paused
			song.play(); //Play him
		}
		else { //Else
			song.pause(); //Pause him
		}
	}
	song.addEventListener('loadstart', function(){ //If audio loading set progressBar elements width as 0
		$("footer.player #progress").css("max-width", "0%");
		$("footer.player #progress").css("width", "0%");
		$("footer.player #buffered").css("max-width", "0%");
		$("footer.player #buffered").css("width", "0%");
	});
	song.addEventListener('loadeddata', function() { //If audio loaded
		$("footer.player #progress").css("max-width", "none");
		$("footer.player #buffered").css("max-width", "none");
	});
	function hidePlayer() { //Animated hide player function
		$("footer.player").transition({y: 80, opacity: 0}, 500, 'snap');
		$(".player-hor-bg").removeClass("sd");
	}
	function showPlayer() { //Animated show player function
		$("footer.player").transition({y: 0, opacity: 1}, 500, 'snap');
		$(".player-hor-bg").addClass("sd");
	}
	function loadSong($num, $autoplay) { //Track loading function
		$(".player .poster").css('background' , 'url(images/pufff.svg)'); //Indicate in poster
		if(parseInt($num) > playlist.count()) $num = 1; //Max condition
		if(parseInt($num) < 1) $num = playlist.count(); //Min condition
		$parray = playlist.getArray(); //Get tracks array
		$id = $parray[$num-1]; //Get current track id
		$(".player #moment").css("width", "0%"); //Reset width
		$(".track-button").removeClass("played"); //Remove played status from all tracks
		$newUrl = http_root + '/data/main/' + $id + '.music'; //New URL
		$(".player .title").fadeOut(200); //Hide title
		$(".player .author").fadeOut(200); //Hide author
		setTimeout(function() {
			$title = playlist.getTitle($num); //Get title
			$author = playlist.getAuthor($num); //Get author
			$(".player .author").text($author); //Set author
			$(".player .author").fadeIn(); //Show author
			$(".player .title").text($title); //Set title
			$(".player .title").fadeIn(); //Show title
		}, 200); //After 200ms
		//Get poster link via ajax
		loadPoster(http_root + '/online/getPoster/' + $id + '.jpg', $(".player .poster"));
		curr_song = $id; //Swap current song id
		curr_num = $num; //Swap current song num
		playlist.currentNum($num); //Set playlist current num
		playlist.currentId($id); //Set playlist current id
		$elm = $("[data-id="+curr_song+"]"); //Get current song element
		song.pause();
		song.src = $newUrl; //Swap audio source
		song.load(); //Load audio
		song.play(); //Play audio
		$(".track-button").removeClass("track-button-active"); //Remove active status from all track buttons
		$elm.addClass("track-button-active"); //Add active status for current track
		$elm.addClass("played"); //Add played status for current track
		$(".player .play").addClass("played"); //Add played status for player
	}
	$(".player .prev").click(function() { //Action on prev button click
		loadSong(curr_num-1, false); //Load prev track
		//$('.recent-wrapper').animate({ srollLeft: $('.recent-wrapper').scrollLeft() + $elm.position().left
    //- $('.recent-wrapper').width()/2 + $elm.width()/2}, 500); //Scroll to track
	});
	$(".player .next").click(function() { //Action on next button click
		loadSong(curr_num-(-1), false); //Load next track
		//$('body').animate({ scrollTop: $elm.offset().top - 100 }, 500); //Scroll to track
	});
	$(document.body).on('click', '[data-type="track"]' ,function(e) {
		if(!$(e.target).is("a")) {
			showPlayer();
			$num = $(this).find(".track-button").attr("data-num");
			$id = $(this).find(".track-button").attr("data-id");
			pl = "";
			tit = "";
			aut = "";
			
			$allSongsNum = $(this).parent().attr("data-all"); //Load tracks count
			for(i=$allSongsNum;i>0; i--) {
				pl += $('[data-num="'+($allSongsNum-i+1)+'"]').attr("data-id");
				tit += $('[data-num="'+($allSongsNum-i+1)+'"]').parent().find(".title").text();
				aut += $('[data-num="'+($allSongsNum-i+1)+'"]').parent().find(".author").text();
				if(i > 1) pl += ", ";
				if(i > 1) tit += ", ";
				if(i > 1) aut += ", ";
			}
			playlist.setTitle(tit);
			playlist.setAuthor(aut);
			if(playlist.get() != pl) playlist.set(pl);
			$newUrl = http_root + '/data/main/' + $id + '.music'; //New URL
			
			if(song.src.split("/").pop() != $newUrl.split("/").pop()) { //If track not playing
				loadSong($num); //Load it
			} else { //If playing
				togglePlay(); //Toggle play
			}
		}
	});
	$(".player .play").click(function() { //Action on click pause or play
		togglePlay(); //Toggle play
	});
	song.addEventListener('ended', function(){ //If track ended
		loadSong(curr_num-(-1), false); //Load next
	});
	function updateProgress() {
		var width = 0; //Buffer indicator width
		var startX = 0; //Start position of loaded moment
		var endX = 0; //End position of loaded moment
		var buffered = document.getElementById("buffered"); //Get buffer indicator
		var progress = document.getElementById("progress"); //Get playing indicator

		$song_progress = (100 / song.duration) * song.currentTime; //Get playing progress
		for (i = 0; i < song.buffered.length; i++) { //Create cycle for get all buffered moments
			startX = song.buffered.start(i); //Update start position loaded moment
			endX = song.buffered.end(i); //Update end position loaded moment
			width = ((width + endX) + startX); //Calculate buffer width
			if(i == (song.buffered.length - 1)) { //If the last moment
				$song_buffered = Math.floor((100 / song.duration) * width); //Convert to percents
			}
		}
		buffered.style.width = $song_buffered + "%"; //Update buffered width
		progress.style.width = $song_progress + "%"; //Update played width
	}
	var volume = document.getElementById("volume"); //Get volume indicator
	song.addEventListener("timeupdate", updateProgress, false); //Add event listener for update progress
	song.addEventListener("pause", function() {
		$("[data-id="+curr_song+"]").removeClass("played"); //Add paused status on track
		$(".player .play").removeClass("played"); //Add paused status on player
	}, false); //If track paused
	song.addEventListener("play", function() {
		$("[data-id="+curr_song+"]").addClass("played"); //Add played status on track
		$(".player .play").addClass("played"); //Add played status on player
	}, false); //If track played
	song.addEventListener("volumechange", onVol, false); //Event listener on volume change
	song.addEventListener("play", updateProgress, false); //Update progress
	var progressBar = document.getElementById("progressBar"); //Get progress bar
	var volumeBar = document.getElementById("volumeBar"); //Get volume bar
	function seek(e, touch) { //Seeking function
		if(!touch) {
			var percent = (e.pageX / $("#progressBar").width()); //Get percents from width and mouse
		} else {
			var percent = (e.changedTouches[0].pageX / $("#progressBar").width()); //Get percents from width and mouse
		}
		song.removeEventListener("timeupdate", updateProgress, false);
		newCurrent = percent * song.duration; //Calculate new position
		$song_progress = (100 / song.duration) * newCurrent; //Get playing progress
		progress.style.width = $song_progress + "%"; //Update playing progress width
	}
	function acceptSeek(e) { //Seek accept function
		song.addEventListener("timeupdate", updateProgress, false); //Update progress
		if(newCurrent != song.currentTime && !isNaN(newCurrent)) { //If time updated
			song.currentTime = parseFloat(newCurrent); //Update
			$song_progress = (100 / song.duration) * newCurrent; //Get playing progress
			progress.style.width = $song_progress + "%"; //Update playing progress width
		}
	}
	function singleSeek(e, touch) { //Single seek function
		seek(e, touch);
		acceptSeek(e);
	}
	const cookiesvol = Cookies.get('authorplay-volume');
	song.volume = parseFloat(cookiesvol != 'NaN' ? cookiesvol : 1);
	volume.style.width = song.volume * 100 + '%';
	function volumeSet(e, touch) {
		var offset = $("#volumeBar").offset();
		var mouseX = e.pageX;
		var volumeStart = offset.left;
		var volumeWidth = $("#volumeBar").width();
		var volumeEnd = (volumeStart + volumeWidth);
		if(mouseX >= volumeStart && mouseX <= volumeEnd) {
			var Vpercent = ((mouseX - offset.left) / $("#volumeBar").width());
		}
		newV = Vpercent * 100;
		if(newV > 100) newV = 100;
		newV = newV / 100;
		if(newV < 0 || newV > 1) newV = 0;
		
		if(!isNaN(newV)) {
			song.volume = parseFloat(newV);
			Cookies.set('authorplay-volume', newV);
		}
	}


	var dragged;
	
	progressBar.addEventListener("click", singleSeek);
	volumeBar.addEventListener("click", volumeSet);
	
	//For mouse
	progressBar.addEventListener("mousedown", function(e){ //If user clicked on the mouse within the progress
		document.body.addEventListener("mousemove", seek);  //Add an event to move the mouse relative to the document
		dragged = true; //Denote progress drags
	});
	volumeBar.addEventListener("mousedown", function(e){ //If user pressed the mouse within the volume
		document.body.addEventListener("mousemove", volumeSet); //Add an event to move the mouse relative to the document
	});
	document.body.addEventListener("mouseup", function(e){ //If user removed the click from the mouse
		document.body.removeEventListener("mousemove", seek); //Remove the event to move the mouse relative to the document
		document.body.removeEventListener("mousemove", volumeSet); //Remove the event to move the mouse relative to the document
		if(dragged) { //If progress is dragging
			acceptSeek(e); //Change the time point
			dragged = !dragged; //Change "drags" to "not drag"
		}

	});
	document.body.addEventListener("mouseleave", function(e){ //If the user's mouse has left the document
		document.body.removeEventListener("mousemove", seek); //Remove the event to move the mouse relative to the document
		//document.body.removeEventListener("mousemove", volumeSet); //Remove the event to move the mouse relative to the document
		if(dragged) {
			acceptSeek(e); //Change the time point
			dragged = !dragged; //Change "drags" to "not drag"
		}

	});
	//Для тача
	progressBar.addEventListener("touchstart", function(e){ //If user clicked on progress
		progressBar.addEventListener("touchmove", singleSeek(e, true)); //Add an event to move about the document
	});
	progressBar.addEventListener("touchend", function(e){ //If user stop clicks
		progressBar.removeEventListener("touchmove", singleSeek); //Remove the event to move about the document
	});
	progressBar.addEventListener("touchleave", function(e){ //If user's finger has left the document
		progressBar.removeEventListener("touchmove", singleSeek); //Remove the event to move about the document
	});
	progressBar.addEventListener("touchcancel", function(e){ //If user's finger has left the document
		progressBar.removeEventListener("touchmove", singleSeek); //Remove the event to move about the document
	});
});