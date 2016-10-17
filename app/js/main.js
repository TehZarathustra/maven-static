(function() {
	// requires
	var pluginsInit = require('./plugins')();
	var hideIntro = require('./blocks/intro-slider');
	var brandGrid = require('./blocks/brand-grid')();
	var hideAddressBar = require('./blocks/hide-bar');

	// globals
	var mobileCheck;
	var introIsHidden;

	if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		mobileCheck = true;
		setTimeout(function() {
			hideAddressBar(this);
		}, 1000);
	} else {
		mobileCheck = false;
	};

	function enableTransition() {
		$('.scroll-item__image-wrap').addClass('scroll-item__image-wrap_transition');
	}

	enableTransition();

	$().ready(function () {
		setTimeout(function() {
			$('.loading-screen').fadeOut(1000);
		}, 2000);
	});

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
				introIsHidden = true;
			}, 2000);
			var target = window.location.href.split('#')[1];
			setTimeout(function() {
				$('body').mCustomScrollbar('update');
				$('body').mCustomScrollbar("scrollTo", '#' + target);
			}, 2000);
		}
	}, 100);

	// home image
	(function() {
		$('.intro-slider').click(function() {
			hideIntro();
			setTimeout(function() {
				introIsHidden = true;
			}, 2000);
		});
	})();

	setImagesAsBackground($('.scroll-item__image'));
	setImagesAsBackground($('.scroll-item__slider img'));
	setImagesAsBackground($('.intro-slider__image img'), true);
	setImagesAsBackground($('.intro-slider__sub-image img'), true);

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
			$(window).on('resize', resizeForm);

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

				setImagesAsBackground($('.intro-slider__image img'), true);
				setImagesAsBackground($('.intro-slider__sub-image img'), true);
			}

			$('.m-close, .page-overlay, .modal.closable').bind(mobileCheck ? 'touchend' : 'click', function (e) {
				if ($(e.target).is('input') || $(e.target).is('textarea')) {
					return;
				}

				$('.page-overlay, .modal').fadeOut(500);
				$('.page-overlay').removeClass('closable-show');
				$('.modal').removeClass('closable-show');

				destroySlideShow();

				$('body').mCustomScrollbar('update');
			});

			var inClick = 0;

			function addModal(trigger, modal, close, gallery) {
				close = close || '';
				gallery = gallery || '';
				$(trigger).bind(mobileCheck ? 'touchend' : 'click', function(e) {
					var self = $(this);
					e.preventDefault();

					$('body').mCustomScrollbar('disable');

					if (mobileCheck && trigger != '.request-more') {
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

					$(modal).addClass('closable-show');
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

					$('body').mCustomScrollbar('disable');

					pin.fillMeta(self);
					pin.show();
					caption.show(self.data('title'), self.data('text'));
					$('.fullpage-image').addClass('closable');
					$('.fullpage-image').addClass('closable-show');

					click = 0;
					self.removeClass(activeClass);
				} else {
					$('body').mCustomScrollbar('disable');

					self.addClass('reset-filter');

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
			pin.hide();
			caption.hide();
			$('body').mCustomScrollbar('update');
			$(this).fadeOut(500);
		});

		// fullscreen slider
		$('.scroll-item__slider').click(function() {
			var self = $(this),
				activeClass = 'scroll-item__slider_active';

			if (!self.hasClass(activeClass)) {
				$('body').mCustomScrollbar('disable');
				var coordinate = {
					top: self.offset().top,
					left: self.offset().left,
					width: self.width(),
					height: self.height(),
					style: self.attr('style')
				};

				self.trigger('stop.owl.autoplay');

				cloneExpandAndClose(self, coordinate, self, true);
				self.addClass(activeClass);
				setTimeout(function() {
					self.trigger('next.owl.carousel');
					setTimeout(function() {
						self.trigger('refresh.owl.carousel');
						self.addClass('refreshed');
					}, 150);
				}, 1450);
			} else {
				setTimeout(function() {
					self.removeClass(activeClass);
					self.removeClass('refreshed');
					self.css('position', 'static');
					$('body').mCustomScrollbar('update');
					setTimeout(function () {
						self.trigger('refresh.owl.carousel');
					}, 600);
				}, 1000);
			}
		});

		function cloneExpandAndClose(el, coordinate, origin, keep) {
			el.removeClass('scroll-item__image-wrap_transition');

			if (origin) origin.addClass('background-center');

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
						if (origin) caption.show(origin.data('title'), origin.data('text'));
						pin.fillMeta(el);
						pin.show();
					}, 1000);
				}, 100);
			}, 150);

			el.click(function() {
				setInitPosition();

				el.removeClass('closable-show');
				caption.hide();
				pin.hide();

				setTimeout(function() {
					if (!keep) el.remove();
					$('body').mCustomScrollbar('update');
					if (origin) origin.removeClass('reset-filter');
					setTimeout(function() {
						if (origin) origin.removeClass('background-center');
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

	// pin button
	var PinButton = function(selector) {
		this.node = $(selector);
		this.selector = selector.replace(/\.|\#/, '');
		self = this;

		this.node.click(function() {
			self.pinIt(self.url, self.pic, self.description);
		});
	}

	PinButton.prototype.fillMeta = function(el) {
		var url = window.location.href;
		var src = el.find('img').attr('src');

		this.url = url;
		this.pic = window.location.origin + window.location.pathname + src;
		this.description = el.find('img').attr('alt');
	}

	PinButton.prototype.show = function() {
		this.node.addClass(this.selector + '_active');
	}

	PinButton.prototype.hide = function() {
		this.node.removeClass(this.selector + '_active');
	}

	PinButton.prototype.pinIt = function(url, media, description) {
		if ($('.scroll-item__slider_active').length) {
			media = window.location.origin + window.location.pathname + $('.scroll-item__slider_active .owl-item.active').find('img').attr('src');
		}

		PinUtils.pinOne({
			url: url,
        	media: media,
        	description: description
    	});
	}

	var pin = new PinButton('.pin-button');

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

			if (mobileCheck && $('body').width() < 450) {
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

	// scroll-item__slider
	setTimeout(function() {
		$('.scroll-item__slider').owlCarousel({
			items: 1,
			autoplay: !mobileCheck,
			autoplayTimeout: 4000,
			loop: true,
			touchDrag: true,
			nav: true,
			navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>',
					  '<i class="fa fa-chevron-right" aria-hidden="true"></i>']
		});

		$('.owl-prev, .owl-next').click(function(e) {
			return false;
		});
	}, 800);

	// form focuse
	$('input, textarea').focus(function() {
		$(this).parent().find('.scroll-item__text').addClass('scroll-item__text_hidden');
		$(this).parent().addClass('scroll-item__group_active');
	});

	// out
	$('input, textarea').focusout(function() {
		var el = $(this);
		if (el.val().length < 1) {
			el.parent().find('.scroll-item__text').removeClass('scroll-item__text_hidden');
		}
		$(this).parent().removeClass('scroll-item__group_active');
	});

	// scroll
	setTimeout(function() {
		var senseSpeed = 5;
		var previousScroll = 0;

		var image = $('.tab-slider__images-wrapper');
		var clonedImage = image.clone().addClass('cloned-image');
		var whoSectionOffset;
		var whoSectionHeight;
		var imageOffsetTop;
		var clientWidthIsPortrait = $('body').width() < 450;

		var checkForIntro = setInterval(function() {
			if (introIsHidden) {
				whoSectionOffset = parseInt($('article#who').offset().top.toFixed(0));
				whoSectionHeight = $('article#who').height();
				imageOffsetTop = parseInt($('.tab-slider').offset().top.toFixed(0));

				clearInterval(checkForIntro);
			}
		}, 2000);


		if (mobileCheck) {
			$('.tab-slider').append(clonedImage);
		}

		$(window).scroll(function(event) {
			var scroller = $(this).scrollTop();

			if (mobileCheck && scroller - senseSpeed > previousScroll) {
				$('.left-pane').filter(':not(:animated)').addClass('hide_header');
			} else if (scroller + senseSpeed < previousScroll) {
				$('.left-pane').filter(':not(:animated)').removeClass('hide_header');
			}

			if (mobileCheck && clientWidthIsPortrait && imageOffsetTop) {
				if (scroller >= imageOffsetTop && scroller <= (whoSectionOffset + whoSectionHeight)) {
					clonedImage.addClass('cloned-fixed');
					image.addClass('hide-original');
				} else {
					clonedImage.removeClass('cloned-fixed');
					image.removeClass('hide-original');
				}
			}

			previousScroll = scroller;

		});
	}, 1000);

	// global helpers
	function setImagesAsBackground(node, hasMobile) {
		var images = node;

		images.each(function() {
			var el = $(this),
				src;

			if (hasMobile) {
				src = mobileCheck && $('body').width() < 450 ? el.data('mobile') : el.data('desktop');
			} else {
				src = el.attr('src');
			}

			el.parent().css('background-image', 'url(' + src + ')');
			el.hide();
		});
	}
})(jQuery);
