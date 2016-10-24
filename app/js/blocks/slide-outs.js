module.exports = function() {
	setTimeout(function() {
		$('#request').removeClass('message-sent');
	}, 1000);

	$('.slide-out-menu').removeClass('slide-out-menu_active');
	$('.scroll-item_slide-out').removeClass('scroll-item_slide-out_active');
}
