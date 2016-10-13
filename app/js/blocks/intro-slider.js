function hideIntro(scroll) {
	// $(selector).mCustomScrollbar('stop');
	if ($('.intro-slider').hasClass('intro-hidden')) {
		return false;
	}

	if (scroll) {
		$('body').mCustomScrollbar('scrollTo', '#about');
	}

	$('.intro-slider').addClass('intro-hidden');

	var container = $('#about .scroll-item__left-column');

	$('.intro-slider .intro-slider__image').css({
		'position': 'relative'
	})

	$('.intro-slider .intro-slider__sub-image').css({
		'opacity': '1'
	})

	setTimeout(function() {
		$('.intro-slider .intro-slider__image').css({
			'opacity': '0'
		})

		$('.intro-slider .intro-slider__image, .intro-slider .intro-slider__sub-image').css({
			'z-index': '0'
		})
	}, 10);

	setTimeout(function() {
		$('.intro-slider').css({
			'width': container.width(),
			'top': container.offset().top,
			'left': container.offset().left,
			'height': '90vh'
		});
	}, 800);

	setTimeout(function() {
		$('.intro-slider').css({
			'position': 'static'
		});

		var preview = $('.intro-slider').data('preview');

		if (preview) {
			$('.intro-slider').append('<div class="intro-slider__preview"></div>');
			$('.intro-slider__preview').css('background-image', 'url(' + preview + ')');
			setTimeout(function() {
				$('.intro-slider__preview').addClass('intro-slider__preview_show');
				setTimeout(function() {
					$('.intro-slider .intro-slider__item').css('opacity', '0');
				}, 650);
			}, 100);
		}

	}, 2000);
}

module.exports = hideIntro;
