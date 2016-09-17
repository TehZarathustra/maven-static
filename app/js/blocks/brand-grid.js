module.exports = function () {
	$('.brand-grid__item').hover(function () {
		$('.brand-grid__item').addClass('brand-grid__item_inactive');
		$(this).removeClass('brand-grid__item_inactive');
	}, function () {
		$('.brand-grid__item').removeClass('brand-grid__item_inactive');
	});
}
