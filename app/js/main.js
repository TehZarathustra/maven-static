(function() {
	// globals
	var mobileCheck;
	if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		mobileCheck = true;
	} else {
		mobileCheck = false;
	};


	function enableTransition() {
		$('.scroll-item__image-wrap').addClass('scroll-item__image-wrap_transition');
	}

	// debug: layouts
	(function() {

		var activeLayouts = [],
			affectedElements = [];

		updateLayouts();

		$('input:radio[name="layout"]').change(function() {
	    	changeLayout($(this).val());
	    });

		function updateLayouts () {
			var items = $('[data-layout]');

			items.each(function() {
				var block = $(this).attr('class').match(/^\w+-\w+(\-\w+)?/)[0],
					layout = $(this).data('layout');

				affectedElements.push(block);
				
				if (layout === 'fullscreen') {
					if (!mobileCheck) {
						var layoutClass = (block + '_' + layout);
					}
				} else {
					var layoutClass = (block + '_layout-' + layout);
				}
				
				activeLayouts.push(layoutClass);
				$(this).addClass(layoutClass);
			});
		}

		function changeLayout (layout) {
			cleanLayout();
			affectedElements.map(function(el) {
				var layoutClass = (el + '_layout-' + layout);

				activeLayouts.push(layoutClass);

				$('.' + el).addClass(el + '_layout-' + layout);
			});

		}

		function cleanLayout () {
			activeLayouts.map(function(el) {
				$('.' + el).removeClass(el);
				activeLayouts = [];
			});
		}
	})();

	// home image
	(function() {
		$('.scroll-item__image-wrap_fullscreen').click(function() {
			enableTransition();
			var width = $(this).parent().width(),
				height = $(this).parent().height();

			$(this).css({
				'width': width,
				'height': height,
				'transform': 'translateX(0) translateY(0)',
				'-ms-transform': 'translateX(0) translateY(0)',
				'-webkit-transform': 'translateX(0) translateY(0)'
			})

			$(this).addClass('no-pseudo');
			
			$(this).bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
				function(){
					$(this).removeClass('scroll-item__image-wrap_fullscreen');
					$(this).removeClass('no-pseudo');
				});
		});

		setTimeout(function() {
			if (!mobileCheck) enableTransition();
		},1500);

		var intro;

		if (window.location.href.split('#')[1] == 'about' || !window.location.href.split('#')[1]) {
			intro = true;
		}

		if (!intro) {
			// alert(window.location.href.split('#')[1]);
			var width = $('.scroll-item__image-wrap_fullscreen').parent().width(),
				height = $('.scroll-item__image-wrap_fullscreen').parent().height();

			$('.scroll-item__image-wrap_fullscreen').css({
				'width': width,
				'height': height,
				'transform': 'translateX(0) translateY(0)',
				'-ms-transform': 'translateX(0) translateY(0)',
				'-webkit-transform': 'translateX(0) translateY(0)'
			})
			$('.scroll-item__image-wrap').removeClass('scroll-item__image-wrap_fullscreen');
		}
	})();

	// menu toggle
	(function () {
		$('.nav-menu__toggle').click(function () {
			var pane = $('.left-pane');

			if (pane.hasClass('left-pane_unfolded')) {
				return $('.left-pane').removeClass('left-pane_unfolded');
			}

			$('.left-pane').addClass('left-pane_unfolded');
		});
	})();

	// ajax
	(function() {

		function _getData() {
			$.getJSON("../data.json")
				.done(function(data) {
					console.log("JSON Data: " + data);
				})
				.fail(function(jqxhr, textStatus, error) {
					var err = textStatus + ", " + error;
					console.log( "Request Failed: " + err );
			});
		}
	})();

	setImagesAsBackground();

	// modals
	(function($) {
		$(function() {
			$(window).on("resize", resizeForm);
			jQuery.fn.center = function(parent) {
				if (parent) {
					parent = this.parent();
				} else {
					parent = window;
				}
				this.css({
					"top": (($(window).height() - $(this).outerHeight()) / 2) + "px",
					"left": (((jQuery(parent).width() - this.outerWidth()) / 2) + jQuery(parent).scrollLeft() + "px")
				});
				return this;
			};

			function resizeForm() {
				jQuery('.pops').center();
			}

			$('.m-close, .page-overlay').bind(mobileCheck ? 'touchend' : 'click', function(){
				$('.page-overlay, .modal').fadeOut(500);
				destroySlideShow();
			});

			var inClick = 0;

			function add_modal(trigger, modal, close, gallery) {
				close = close || '';
				gallery = gallery || '';
				$(trigger).bind(mobileCheck ? 'touchend' : 'click', function(e) {
					var self = $(this);

					e.preventDefault();

					if (mobileCheck) {
						inClick++;

						if (inClick < 1) {
							setTimeout(function() {
								inClick = 0;
							}, 1500);
							return;
						}
					}

					if (gallery) {
						$(modal).html(buildSlideshow(self));

						$('.owl-carousel').owlCarousel({
							items: 1
						})
						.on('changed.owl.carousel', function(e) {
							$('.gallery__current').text(e.item.index + 1);
						});

						$('.gallery__next').click(function() {
							$('.owl-carousel').trigger('next.owl.carousel');
						})

						$('.gallery__prev').click(function() {
							$('.owl-carousel').trigger('prev.owl.carousel');
						})
					}

					$('.page-overlay, '+modal+'').fadeIn(400);
					$(modal).center();
					$('.image-pop').center();

					inClick = 0;
				});
			};

			function destroySlideShow() {
				$('.owl-carousel').trigger('destroy.owl.carousel');
				$('.gallery__next').remove();
				$('.gallery__prev').remove();
				$('.gallery__counter-wrap').remove();
			}

			function buildSlideshow(el) {
				var pics = el.data('slideshow').split(' ');
				var html = '<div class="owl-carousel">'
					+ pics.map(function(pic) {
						return '<div class="gallery__image-wrap">'
							+ '<img class="gallery__image" src="' + pic + '"/>' +
						'</div>'
					}).join('') +
				'</div>';

				$('.page-wrapper').append('<div class="gallery__prev"></div>'
					+ '<div class="gallery__next"></div>'
					+ '<div class="gallery__counter-wrap">'
					+ 	'<div class="gallery__counter">'
							+ '<span class="gallery__current">1</span>/<span class="gallery__total">' + pics.length + '</span>'
						+ '</div>'
					+ '</div>')

				return html;
			}

			add_modal('.scroll-item__image-wrap_gallery-trigger', '.gallery-modal', false, true);
		});
	})(jQuery);

	// fullpage-image
	(function() {
		if (mobileCheck) {
			var click = 0;

			$('.scroll-item__image-wrap:not(.scroll-item__image-wrap_fullscreen):not(.scroll-item__image-wrap_gallery-trigger)').click(function() {
				click++;
				var self = $(this);

				if (click === 2) {
					$('.page-overlay').fadeIn(500);
					$('.fullpage-image').css({
						'background-image': 'url(' + self.find('img').attr('src') + ')'
					}).fadeIn(1000);

					click = 0;
				}

				resetClick();
			});

			$('.fullpage-image').click(function() {
				$('.page-overlay').fadeOut(500);
				$(this).fadeOut(500);
			})

			function resetClick() {
				setTimeout(function() {
					click = 0;
				},1500);
			}
		}
	})();

	// global helpers
	function setImagesAsBackground() {
		var images = $('.scroll-item__image');

		images.each(function() {
			var src = $(this).attr('src');
			$(this).parent().css('background-image', 'url(' + src + ')');
			$(this).hide();
		});
	}
})(jQuery);