var num = 0;

class Notify {
	
	new(content) {
		var $el = $('<div data-num="'+num+'">'+content+'</div>');
		$('.notify-wrapper').append($el);
		$el.transition({y: 100, opacity: 0}, 0, 'snap');
		$el.transition({y: 0, opacity: 1}, 500, 'snap');
		
		$el.delay(2000).transition({y: 100, opacity: 0}, 500, 'ease');
		setTimeout(function(){
			 $el.remove();
		},3000);
	}
}