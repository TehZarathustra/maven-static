module.exports = function() {
	setTimeout(function() {
		$('#request > div').removeClass('message-sent');
		$('#request input').val('');
		$('#request textarea').val('');
	}, 1000);

	$('.slide-out-menu').removeClass('slide-out-menu_active');
	$('.scroll-item_slide-out').removeClass('scroll-item_slide-out_active');
}
