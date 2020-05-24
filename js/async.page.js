/*/////////////////////////////*/
/*    AuthorPlay async surf    */
/*            v. 6             */
/*/////////////////////////////*/

$(document).ready(function() {
	//Variables
	var container = "#content";
	var notify = new Notify();

	//Init
	setBackround($(container).attr("data-bg"));
	formInit($('form[data-async=true]'));
	
	var endpath = document.location.pathname.replace(http_root, '');
	var controller = endpath.split('/')[1];
	var target_link = http_root + '/' + controller;

	$elms = $('[href="'+target_link+'"]'); //Get current page tab
	$("a[data-async=true]").removeClass("current"); //Remove current status from all tabs
	$elms.addClass("current"); //Add current status to current page tab
	
    var load = function (url) {
		$('.loading').removeClass('hide');
		$('.loading').addClass('progress');

		var xhr = new XMLHttpRequest();

		$.ajax({
			url: url,
			xhr: function() {
				return xhr;
			},
			success: function(data) {
				cur_url = document.location.pathname;
				if(window.location.search.substr(1) != "")
					cur_url +=  "?" + window.location.search.substr(1);
				if(xhr.responseURL != cur_url) {
					history.pushState({
						url: xhr.responseURL,
					}, null, xhr.responseURL);
				}
				$(container).transition({x: -1000, opacity: 0}, 500, 'snap');
				$content = $("<span/>").html(data).find(container);
				setBackround($content.attr("data-bg"));
				document.title = $("<span/>").html(data).find("title").text();
				setTimeout(function() {
					$('.loading').removeClass('progress');
					setTimeout(function() {
						$('.loading').addClass('hide');
					}, 400);
					$(container).transition({x: 0, opacity: 1}, 500, 'snap'); //Show content
					$(container).html($content.html());
					$('body').animate({ scrollTop: 0 }, 500);
					formInit($(container).find('form[data-async=true]'));
					$anix = $(container).find(".anix"); //Find AniX elements
					$anix.css("opacity", "0"); //Set opacity as 0
					anix_do($anix); //Start AniX
					loadPosterOnPage($('article'));
					$(container).find(".parallax").fibx();

					var endpath = document.location.pathname.replace(http_root, '');
					var controller = endpath.split('/')[1];
					var target_link = http_root + '/' + controller;

					$elms = $('[href="'+target_link+'"]'); //Get current page tab
					$("a[data-async=true]").removeClass("current"); //Remove current status from all tabs
					$elms.addClass("current"); //Add current status to current page tab
					if(playlist.currentId() != undefined) {
						$(container).find("[data-id="+playlist.currentId()+"]").addClass("track-button-active");
						if(!song.paused)
							$(container).find("[data-id="+playlist.currentId()+"]").addClass("played");
					}
					$("iframe.pre").attr("src", "");
					if ($(window).width() <= 800) {
						$('html').find('.tracks').addClass('list');
					}
				}, 500);
			},
			error: function() {
				$('.loading').removeClass('progress');
				setTimeout(function() {
					$('.loading').addClass('hide');
				}, 400);
				
				notify.new("Unable to load page...");
			}
		});
	};

    $(document).on('click', 'a[data-async=true]', function (e) {
        e.preventDefault();
        var $this = $(this),
		url = $this.attr("href");
		cur_url = document.location.pathname;
		if(window.location.search.substr(1) != "")
			cur_url +=  "?" + window.location.search.substr(1);
		if(url != cur_url) {
			load(url);
		}
		
    });

    $(window).on('popstate', function (e) {
        var state = e.originalEvent.state;
        if (state !== null) {
			$("iframe.pre").attr("src", "php-main/sleep.php");
			load(state.url);
        } else {
			$("iframe.pre").attr("src", "php-main/sleep.php");
			load("/");
        }
    });
});