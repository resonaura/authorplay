var $id;
function loadPoster($url, $target) {
	$("<img/>").attr("src", $url).bind('load', function() {
		$target.css('background' , 'url('+$url+')'); //Swap poster
		setTimeout(function() {
			$target.transition({ opacity: 1, scale: 1,  rotate: '0deg'}, 1000, 'snap');
			$target.parent().find(".track-button").removeClass("tload");
			$target.parent().removeClass("tload");
		}, 300);
	});
}
function loadPosterFor($Id, $target, $type) {
	$target.transition({ opacity: 0, scale: 1, rotate: '0deg'}, 0);
	//author-images/'.$a['id'].'.jpg
	switch($type) {
		case 0:
			window["$"+$type+"url"+$Id] = http_root + "/online/getPoster/" + $Id;
			$target.parent().find(".track-button").addClass("tload");
			loadPoster(window["$"+$type+"url"+$Id], $target);
			break;
		case 1:
			window["$"+$type+"url"+$Id] = http_root + "/data/author/" + $Id+"-h.jpg";
			$target.parent().addClass("tload");
			loadPoster(window["$"+$type+"url"+$Id], $target);
			break;
	}
}
function type($el) {
	$type = $el.attr("data-type");
	switch($type) {
		case "track":
			return 0;
			break;
		case "author":
			return 1;
			break;
		default:
			return -1;
			break;
	}
}
function loadPosterOnPage($el) {
	$el.each(function(i) {
		i++;
		switch(type($(this))) {
			case 0:
				$trackId = $(this).find(".track-button").attr("data-id");
				loadPosterFor($trackId, $(this).find(".background"), 0);
				break;
			case 1:
				var $Id = $(this).attr("data-id");
				loadPosterFor($Id, $(this).find(".background"), 1);
				break;
			default:
				break;
		}
	});
}
$(document).ready(function() {
	loadPosterOnPage($('article'));
});