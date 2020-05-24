$(document).ready(function() {
	function sectionAddaptive() {
		var $bwidth = $("body").width();
		if($("section.tracks").attr("data-imp") != "list") {
			if($bwidth < 800) {
				$("section.tracks").addClass("list");
			} else {
				$("section.tracks").removeClass("list");
			}
		}
	}
	$(window).on('resize', function () {
		sectionAddaptive();
	});
	sectionAddaptive();
});