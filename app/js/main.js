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

	if (!mobileCheck) {
		enableTransition();
		setTimeout(function() {
			$('body').mCustomScrollbar("disable");
		}, 500);
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
		if (window.location.href.split('#')[1] && window.location.href.split('#')[1] !== 'about') {
			hideIntro();
			setTimeout(function() {
				$('body').mCustomScrollbar("update");
				$('body').mCustomScrollbar("scrollTo", '#' + window.location.href.split('#')[1]);
			}, 2000);
		}
	}, 100);

	// home image
	(function() {
		$('.intro-slider').click(function() {
			hideIntro();
		});
	})();

	function hideIntro() {
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
		}, 10);

		setTimeout(function() {
			$('.intro-slider').css({
				'width': container.width(),
				'top': container.offset().top,
				'left': container.offset().left,
				'height': '80vh'
			});
		}, 800);

		setTimeout(function() {
			$('.intro-slider').css({
				'position': 'static'
			});
			$('body').mCustomScrollbar("update");
		}, 2000);
	}

	setImagesAsBackground($('.scroll-item__image'));
	setImagesAsBackground($('.intro-slider__image img'));
	setImagesAsBackground($('.intro-slider__sub-image img'));

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
				$('.page-overlay').removeClass('closable-show');
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

					setTimeout(function() {
						$('.page-overlay').addClass('closable-show');
					}, 200);

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
					el.addClass('closable');
					setTimeout(function() {
						el.addClass('closable-show');
						caption.show(origin.data('title'), origin.data('text'));
					}, 1000);
				}, 100);
			}, 150);

			el.click(function() {
				setInitPosition();

				el.removeClass('closable-show');
				caption.hide();

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

	// caption
	var Caption = function(node, titleNode, captionNode) {
		this.node = node;
		this.nodeClass = node.attr('class');
		this.initMod = node.attr('class') + '_init';
		this.showMod = node.attr('class') + '_show';
		this.titleNode = node.find('h2');
		this.textNode = node.find('p');
	}

	Caption.prototype.show = function(title, text) {
		this.node.addClass(this.initMod);

		var self = this;
		self.titleNode.html(title || 'Main title');
		self.textNode.html(text || 'Lorem ipsum dolor sit amet.');

		setTimeout(function() {
			self.node.addClass(self.showMod);
		}, 100);
	}

	Caption.prototype.hide = function() {
		this.node.removeClass(this.showMod);
		var self = this;

		setTimeout(function() {
			self.node.removeClass(self.initMod);
		}, 500);
	}

	var caption = new Caption($('.dynamic-caption'), $('.dynamic-caption h2'), $('.dynamic-caption p'));


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
		autoplayTimeout: 4000,
		loop: true,
		animateOut: 'fadeOut',
		center: true
	});

	// global helpers
	function setImagesAsBackground(node) {
		var images = node;

		images.each(function() {
			var src = $(this).attr('src');
			$(this).parent().css('background-image', 'url(' + src + ')');
			$(this).hide();
		});
	}
})(jQuery);