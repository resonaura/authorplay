function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('.poster .image').css('background-image', 'url("'+e.target.result+'")');
    }

    reader.readAsDataURL(input.files[0]);
  } else if(input != "") {
	$('.poster .image').css('background-image', 'url("'+input+'")');
	
  }
}
function fileInit() {
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = "&#10150; File selected";
			else
				label.innerHTML = labelVal;
		});
	});
	$("input#album").change(function (){
		if($(this).val().length > 0 && $(this).val() != undefined) {
			readURL(this);
		}
	});
	$("input[name=album]").change(function (){
		$.ajax({
			url: "/play?album="+$(this).val()+"&author="+$("input[name=author]").val()+"&poster",
			type: "GET",
			success: function(responseText){
				//Set img as responseText
				$img = responseText;
				if($img == "Not Found!" || $img == "Empty") {
					$img = "";
					if($img.length > 0 && $img != undefined) {
						readURL($img);
					}
				} else {
					$.ajax({
						url: $img,
						type: "GET",
						success: function(responseText){
							if($img != "Empty") {
								if($img.length > 0 && $img != undefined) {
									readURL($img);
								}
							}
						}
					});
				}

				

			}
		});
	});
}


