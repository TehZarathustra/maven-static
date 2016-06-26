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

	// anchor scroll
	(function() {
		$('.nav-menu__link, .submenu__link, .thirdmenu__link').click(function(e) {
			e.preventDefault();
			var target = $(this).attr('href');
			$('body').mCustomScrollbar("scrollTo", target);
		});
	})();

	setTimeout(function() {
		if (window.location.href.split('#')[1] != 'about') {
			$('body').mCustomScrollbar("update");
			$('body').mCustomScrollbar("scrollTo", '#' + window.location.href.split('#')[1]);
		}
	}, 1000);

	// home image
	(function() {
		setTimeout(function() {
			$('body').mCustomScrollbar("disable");
		}, 500);
		

		$('.scroll-item__image-wrap_fullscreen, .intro-slider_fullscreen').click(function() {
			enableTransition();
			var width = $(this).parent().width(),
				height = $(this).parent().height(),
				self = $(this);

			if (!mobileCheck) {
				$(this).addClass('intro-slider_show-sub');

				setTimeout(function() {
					hideIntro(self, width, height);
				}, 1000);

				$(this).addClass('no-pseudo');
				
				$(this).bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
					function(){
						$(this).removeClass('scroll-item__image-wrap_fullscreen');
						$(this).removeClass('intro-slider_fullscreen');
						$(this).removeClass('no-pseudo');
					});
			}
		});

		function hideIntro(node, width, height) {
			node.css({
				'width': width,
				'height': height,
				'transform': 'translateX(0) translateY(0)',
				'-ms-transform': 'translateX(0) translateY(0)',
				'-webkit-transform': 'translateX(0) translateY(0)'
			});

			$('body').mCustomScrollbar("update");
		}

		setTimeout(function() {
			if (!mobileCheck) enableTransition();
		},1500);

		var intro;

		if (window.location.href.split('#')[1] == 'about' || !window.location.href.split('#')[1]) {
			intro = true;
		}

		if (!intro) {
			setTimeout(function() {
				var width = $('.intro-slider').parent().width(),
				height = $('.intro-slider').parent().height();

				hideIntro($('.intro-slider'), width, height);

				$('.intro-slider').removeClass('intro-slider_fullscreen');
			});
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

		$('.left-pane a').click(function() {
			if ($('.left-pane').hasClass('left-pane_unfolded')) {
				$('.left-pane').removeClass('left-pane_unfolded');
			}
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
				$('body').mCustomScrollbar("update");
			});

			var inClick = 0;

			function addModal(trigger, modal, close, gallery) {
				close = close || '';
				gallery = gallery || '';
				$(trigger).bind(mobileCheck ? 'touchend' : 'click', function(e) {
					var self = $(this);
					$('body').mCustomScrollbar("disable");
					e.preventDefault();

					if (mobileCheck && trigger != '.nav-menu__telephone') {
						inClick++;

						if (inClick == 1) {
							$('.scroll-item__image-wrap_gallery-trigger').addClass('tapped');
						}

						if (inClick < 2) {
							setTimeout(function() {
								$('.scroll-item__image-wrap_gallery-trigger').removeClass('tapped');
								inClick = 0;
							}, 1500);
							return;
						}
					}

					if (gallery) {
						$(modal).html(buildSlideshow(self));

						$('.gallery').owlCarousel({
							items: 1,
							autoplay: true,
							autoplayTimeout: 3000
						})
						.on('changed.owl.carousel', function(e) {
							$('.gallery__current').text(e.item.index + 1);
						});

						$('.gallery__next').click(function() {
							$('.gallery').trigger('next.owl.carousel');
						})

						$('.gallery__prev').click(function() {
							$('.gallery').trigger('prev.owl.carousel');
						})

						$('.close-modals').bind(mobileCheck ? 'touchend' : 'click', function(){
							$('.page-overlay, .modal').fadeOut(500);
							destroySlideShow();
						});
					}

					$('.page-overlay, '+modal+'').fadeIn(400);
					$(modal).center();
					$('.image-pop').center();

					inClick = 0;
				});
			};

			function destroySlideShow() {
				$('.gallery').trigger('destroy.owl.carousel');
				$('.gallery__next').remove();
				$('.gallery__prev').remove();
				$('.gallery__counter-wrap').remove();
			}

			function buildSlideshow(el) {
				var pics = el.data('slideshow').split(' ');
				var html = '<div class="owl-carousel gallery">'
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
						+ '<div class="gallery__close close-modals">close</div>'
					+ '</div>')

				return html;
			}

			addModal('.scroll-item__image-wrap_gallery-trigger', '.gallery-modal', false, true);
			addModal('.nav-menu__telephone', '.contact-modal');
			addModal('.request-more', '.contact-modal');
		});
	})(jQuery);

	// fullpage-image
	(function() {
		var click = 0;

		var activeClass = mobileCheck ? 'tapped' : '';

		$('.scroll-item__image-wrap:not(.scroll-item__image-wrap_fullscreen):not(.scroll-item__image-wrap_gallery-trigger)').click(function() {
			click++;
			var self = $(this);
			self.addClass(activeClass);

			if (click === 2 || !mobileCheck) {
				if (mobileCheck) {
					$('.page-overlay').fadeIn(500);
					$('.fullpage-image').css({
						'background-image': 'url(' + self.find('img').attr('src') + ')'
					}).fadeIn(1000);

					$('body').mCustomScrollbar("disable");

					click = 0;
					self.removeClass(activeClass);
				} else {
					$('body').mCustomScrollbar("disable");

					var coordinate = {
							top: self.offset().top,
							left: self.offset().left,
							width: self.width(),
							height: self.height(),
							style: self.attr('style')
						},
						clone = self.clone().prependTo(self);

					cloneExpandAndClose(clone, coordinate, self);
				}
			}

			resetClick(self);
		});

		$('.fullpage-image').click(function() {
			$('.page-overlay').fadeOut(500);
			$('body').mCustomScrollbar("update");
			$(this).fadeOut(500);
		});

		function cloneExpandAndClose(el, coordinate, origin) {
			el.removeClass('scroll-item__image-wrap_transition');

			origin.addClass('background-center');

			setInitPosition();

			setTimeout(function() {
				el.css('transition', 'all 1s ease-in-out');
				setTimeout(function() {
					el.css({
						width: '100%',
						left: 0,
						top: 0,
						height: '100%',
						'background-position': 'center'
					});
				}, 100);
			}, 150);

			el.click(function() {
				setInitPosition();

				setTimeout(function() {
					el.remove();
					$('body').mCustomScrollbar("update");
					setTimeout(function() {
						origin.removeClass('background-center');
					}, 1500);
				}, 1000);

				return false;
			});

			function setInitPosition() {
				return el.css({
					position: 'fixed',
					top: coordinate.top,
					left: coordinate.left,
					width: coordinate.width,
					height: coordinate.height,
					'z-index': '300'
				});
			}
		}

		function resetClick(node) {
			setTimeout(function() {
				click = 0;
				node.removeClass(activeClass);
			},1500);
		}
	})();

	// tab-slider
	(function() {
		$('.tab-slider__select-item').each(function(index) {
			$(this).data('item', index + 1);
		});

		$('.tab-slider__image-item').each(function(index) {
			$(this).addClass('tab-slider__image-item_' + (index + 1));
		});

		$('.tab-slider__select-item').hover(function() {
			var index = $(this).data('item');
			var mainImage = $('.tab-slider__images-list');
			$('.tab-slider__select-item').removeClass('active');
			$(this).addClass('active');
			$('.tab-slider__image-item').removeClass('active');
			$('.tab-slider__image-item_' + index).addClass('active');

			if (mobileCheck) {
				mainImage.attr('class', 'tab-slider__images-list');
				mainImage.addClass('tab-slider__images-list_pos-' + index);
			}
		});

		$('.tab-slider__images-list').click(function() {
			$('.tab-slider__select-item').removeClass('active');
			$('.tab-slider__image-item').removeClass('active');
		});
	})();

	// intro slider
	$('.intro-slider').owlCarousel({
		items: 1,
		autoplay: true,
		autoplayTimeout: 5000,
		loop: true,
		animateOut: 'fadeOut',
		center: true
	});

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