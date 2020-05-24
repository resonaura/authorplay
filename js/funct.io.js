function setUrl($url) { //SetUrl function
	history.pushState({param: 'Value'}, '', $url);
}
function getUrl() { //getUrl function 
	return $(location).attr('href');
}
function setBackround($bg) {
	$(document).ready(function() {
		$bgIm = $("<span/>").css("background", $bg).css("background-image"); //Emulate swap and get image
		$bgColor = $("<span/>").css("background", $bg).css("background-color"); //Emulate swap and get color
		if($bg == undefined) $bg = "#000"; //If $bg undefined - set default
		$("body").css("background-color", $bgColor); //Set bg color
		$(".bg-wrapper").transition({ opacity: 0, y: 100}, 0);
		if($bgIm != "initial") {
			$bgIms = $bgIm.slice(4, -1).replace(/"/g, ""); //Slice 'url("' and '")'
			
			$("<img/>").attr("src", $bgIms).bind('load', function() {
				$(".bg-wrapper").css("background-image", $bgIm); //Set bg image
				setTimeout(function() {
					$(".bg-wrapper").transition({ opacity: 1, y: 0}, 1000, 'snap');
				}, 500);
			});
		} else {
			$(".bg-wrapper").css("background-image", ""); //Set bg image
			setTimeout(function() {
				$(".bg-wrapper").transition({ opacity: 1, y: 0}, 1000, 'snap');
			}, 500);
		}
	});
}
function authSucceffull(url) {
	var container = "#content";
	$('.loading').removeClass('hide');
	$('.loading').addClass('progress');
	$.get(url).done(function (data, textStatus, xhrreq) {
		setUrl(xhrreq.getResponseHeader('NewLocation'));
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
			$(container).html($content);
			$('body').animate({ scrollTop: 0 }, 500);
			formInit($(container).find('form[data-async=true]'));
			$anix = $(container).find(".anix"); //Find AniX elements
			$anix.css("opacity", "0"); //Set opacity as 0
			anix_do($anix); //Start AniX
			loadPosterOnPage($('article'));
			$(container).find(".parallax").fibx();
			$elms = $('[href="'+document.location.pathname+'"]'); //Get current page tab
			$("a[data-async=true]").removeClass("current"); //Remove current status from all tabs
			$elms.addClass("current"); //Add current status to current page tab
		}, 500);
	});
}
function formInit($el) {
	$(document).ready(function() {
		$el.ajaxForm({
			beforeSend: function() {
				$('.loading').removeClass('hide'); //Show loading progress bar
				var percentVal = '0%';
				$('.loading').css({
					width: percentVal //Convert percentComplete to %
				});
			},
			uploadProgress: function(event, position, total, percentComplete) {
				var percentVal = percentComplete + '%';
				$('.loading').css({
					width: percentVal //Convert percentComplete to %
				});
			},
			complete: function(xhr) {
				authSucceffull(xhr.responseText);
				$('.loading').addClass('hide');
			},
			success: function(responseText) {
				authSucceffull(responseText);
				$('.loading').addClass('hide');
			}
		});
	});
}
