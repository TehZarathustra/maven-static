module.exports = function() {
	// globals
	var mobileCheck;
	if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		mobileCheck = true;
	} else {
		mobileCheck = false;
		$('body').addClass('stop-scrolling');
	};

	var totalItems = this.totalItems ||
		(this.totalItems = document.querySelectorAll('article.scroll-item'));

	var socialIcons = this.social ||
		(this.social = $('.social'));

	var delaySlideOut = false;
	var hideSlideOuts = require('./blocks/slide-outs');

	function showHeader() {
		toggleHeader('show_header', 'hide_header');
	}


	function hideHeader() {
		if ($('.left-pane').hasClass('left-pane_unfolded')) return;
		toggleHeader('hide_header', 'show_header');
	}


	function toggleHeader(classToAdd, classToRemove) {
		var leftPanel = $('.left-pane');

		if (leftPanel.hasClass(classToAdd) && !leftPanel.hasClass(classToRemove)) {
			return ;
		} else {
			leftPanel.removeClass(classToRemove).addClass(classToAdd)
		}
	}

	function throttle(func, ms) {
        var isThrottled = false,
            savedArgs,
            savedThis;

        function wrapper() {

            if (isThrottled) {
                savedArgs = arguments;
                savedThis = this;
                return;
            }

            func.apply(this, arguments);

            isThrottled = true;

            setTimeout(function() {
                isThrottled = false;
                if (savedArgs) {
                    wrapper.apply(savedThis, savedArgs);
                    savedArgs = savedThis = null;
                }
            }, ms);
        }

        return wrapper;
    }

    var focusedItem;

    // form: focus in
	$('input, textarea').focus(function() {
		var el = $(this),
			currentForm = $(this).parent().parent(),
			wrapper = currentForm.parent().parent();

		delaySlideOut = true;

		$('.next-step').addClass('next-step_active');

		el.parent().find('.scroll-item__text').addClass('scroll-item__text_hidden');
		el.parent().addClass('scroll-item__group_active');

		focusedItem = el.parent();

		if (mobileCheck && $(window).width() < 700) {
			currentForm.addClass('mobile-focus');
			el.parent().addClass('focused');
		}

		// $('.scroll-item__subheading_form').hide();
	});

	// form: focus out
	$('input, textarea').focusout(function() {
		var el = $(this),
			currentForm = $(this).parent().parent(),
			wrapper = currentForm.parent().parent();

		$('.next-step').removeClass('next-step_active');

		if (mobileCheck && $(window).width() < 700) {
			currentForm.removeClass('mobile-focus');
			$(this).parent().removeClass('focused');
		}

		if (el.val().length < 1) {
			el.parent().find('.scroll-item__text').removeClass('scroll-item__text_hidden');
		}
		$(this).parent().removeClass('scroll-item__group_active');

		if (currentForm.hasClass('last-step')) {
			currentForm.find('button').click();
		}

		if (el.prop('required') && el.val().length < 2) {
			el.addClass('not-valid');
		}

		if (el.hasClass('not-valid') && el.val().length > 2) {
			el.removeClass('not-valid');
		}

		currentForm.removeClass('last-step');

		// $('.scroll-item__subheading_form').show();

		setTimeout(function() {
			delaySlideOut = false;
		}, 5000);
	});

	$('.m-close').click(function() {
		hideSlideOuts();
	});

	// next step
	(function() {
		$('.next-step').click(function() {
			var currentForm = $(this).parent(),
				wrapper = currentForm.parent().parent();

			if (focusedItem) {
				var nextItem = focusedItem.next();

				if (focusedItem.find('input').hasClass('not-valid')) {
					focusedItem.find('input').focus();
					return;
				}

				if (nextItem.hasClass('scroll-item__group')) {
					focusedItem.next().focus();
				}

				if (!nextItem.next().hasClass('scroll-item__group')) {
					currentForm.addClass('last-step');
					// $('.next-step').removeClass('next-step_active');
				}
			}
		});
	})();

	// scroll magic
	(function() {
		var CONTENT_BLOCK = $('.main-content'),
			FIXED_HEADING_WRAP = $('.fixed-heading-wrap'),
			FIXED_HEADING = $('.fixed-heading'),
			prevHeading,
			firstEnter,
			dataFlag;

		var controller = new ScrollMagic.Controller();

		_buildStages();
		_setHeadingWidth();

		function _buildStages() {
			var items = totalItems,
				init;

			for (var i = 0, l = items.length; i < l; i++) {
				_makeScene(items[i]);
			}
		}

		// make generic scene
		function _makeScene(item) {
			var isScrollInited = false;
			var _this = this;

			new ScrollMagic.Scene({
					triggerElement: item,
					duration: '100%'
				})
				.addTo(controller)
				.on('progress', function (e) {
					setTimeout(function() {
						isScrollInited = true;
					}, 1000);

					if (isScrollInited && !delaySlideOut) {
						hideSlideOuts();
					}

					var el = _getScrollNodes(this.triggerElement().id);

					el.node.find('.scroll-item__image-wrap').each(function() {
						if ($(this).data('animationType') === 'onProgress') {
							var animation = $(this).data('animation');

							if (animation === 'vertical-parallax-1' && !mobileCheck) {
								$(this).css({
									'background-position': '50% ' + e.progress.toFixed(2).replace(/\d\./, '') + '%'
								});
								if (e.progress.toFixed(2) >= 1) {
									$(this).css({
										'background-position': '50% 100%'
									});
								}
							}

							if (animation === 'vertical-parallax-2' && !mobileCheck) {
								// $(this).css({
								// 	'transform': 'translateY(' + e.progress.toFixed(2).replace(/\d\./, '') + 'px)'
								// });
								// if (e.progress.toFixed(2) >= 1) {
								// 	$(this).css({
								// 		'transform': 'translateY(100px)'
								// 	});
								// }
							}

							if (animation === 'vertical-parallax-3' && !mobileCheck) {
								$(this).css({
									'transform': 'translateY(-' + e.progress.toFixed(2).replace(/\d\./, '') + 'px)'
								});
								if (e.progress.toFixed(2) >= 1) {
									$(this).css({
										'transform': 'translateY(-100px)'
									});
								}
							}
						}
					});

					var currentProgress = e.progress.toFixed(2).replace(/\d\./, '');

					if (el.isInSubMenu) {
						el.link.parent().find('.submenu__progress-bar').css({
							'transform': 'translateY(' + currentProgress + 'px)'
						})
					} else if (el.isInThirdMenu) {
						el.link.parent().find('.thirdmenu__progress-bar').css({
							'transform': 'translateY(' + currentProgress + 'px)'
						})
					} else {
						el.bar.css({
							'transform': 'translateY(' + currentProgress + 'px)'
						})
					}

					if (el.image.data('animationType') === 'onProgress') {
						var animation = el.image.data('animation');
					}


					if (e.progress.toFixed(2) >= 0.42) {
						FIXED_HEADING.text(el.titleText);
						el.title.addClass('scroll-item__heading_hidden');
					} else {
						el.title.removeClass('scroll-item__heading_hidden');
					}
				})

				.on('enter leave', function (e) {
					var el = _getScrollNodes(this.triggerElement().id);

					if (e.type == 'enter') {
						el.barParent.show();

						if (totalItems[totalItems.length - 3].id === this.triggerElement().id) {
							socialIcons.addClass('active');
						}

						el.link.removeClass('nav-menu__link_black');

						if (el.subBarParent) el.subBarParent.show();

						if (history.pushState && firstEnter) {
			                history.pushState(null, null, "#" + el.id);
			            }

			            if (el.image.data('animationType') === 'onEnter') {
			            	var animationClass = 'scroll-item__image-wrap_' + el.image.data('animation');

			            	el.image.addClass('color');
			            	el.image.removeClass(animationClass);
			            }

			            if (el.isSubmenuHideTrigger) {
							$('.submenu').addClass('submenu_hidden');
						}

			            if (el.submenu) {
			            	el.submenu.removeClass('submenu_hidden');
			            }

					} else {
						var currentIndex;
						var triggerElement = this.triggerElement().id;
						totalItems.forEach(function (item, index) {
							if (item.id === triggerElement) {
								currentIndex = index;
							}
						})

						if (currentIndex < (totalItems.length - 3)) {
							socialIcons.removeClass('active');
						}

						if (el.image.data('animationType') === 'onEnter') {
			            	var animationClass = 'scroll-item__image-wrap_' + el.image.data('animation');

			            	if (!el.image.hasClass(animationClass)) {
			            		el.image.addClass(animationClass);
			            		el.image.removeClass('color');
			            	}
			            }

						firstEnter = true;
						el.barParent.hide();
					}
				})

				.on('start end', function (e) {
					var el = _getScrollNodes(this.triggerElement().id);

					if (e.type != 'start' && !el.link.hasClass('nav-menu__link_black')) {
						if (!el.isInSubMenu) {
							if (e.state == 'AFTER') el.link.addClass('nav-menu__link_black');
							if (e.state === 'DURING' && el.isInThirdMenu) {
								var heightPos = 78;

								el.link.parent().parent().parent().parent().parent().find('.submenu').css({
									'margin-top': '-' + heightPos * el.link.parent().parent().parent().index() + 'px'
								});
								setTimeout(function() {
									el.link.parent().parent().parent().find('.thirdmenu').removeClass('thirdmenu_hidden');
								}, 100);

								return;
							}
						} else {
							if (e.state == 'AFTER') {
								$('.thirdmenu').addClass('thirdmenu_hidden');
								el.link.parent().parent().parent().find('.submenu').css({
									'margin-top': '-' + el.link.parent().height() * (el.link.parent().index() + 1) + 'px'
								});
							} else {
								var heightPos = el.link.parent().height() * (el.link.parent().index());
								// from bottom to top
								if (el.link.next().hasClass('thirdmenu')) {
									el.link.next().addClass('thirdmenu_hidden');
									return;
								}
								el.link.parent().parent().parent().find('.submenu').css({
									'margin-top': '-' + heightPos + 'px'
								});
							}
						}


					} else {
						if (el.isInThirdMenu && e.state == 'BEFORE') {
							el.parent.parent().parent().find('.thirdmenu').removeClass('thirdmenu_hidden');
							$('.submenu').css({
								// 'margin-top': '-' + el.link.parent().parent().parent().height() * (el.link.parent().parent().parent().index()) + 'px'
							});
						}
						if (el.parent.hasClass('submenu__item_continue')) {
							$('.thirdmenu').addClass('thirdmenu_hidden');
							if (e.state == 'BEFORE') {
								return el.link.removeClass('nav-menu__link_black');
							} else {
								el.parent.find('.thirdmenu').removeClass('thirdmenu_hidden');
								return el.link.addClass('nav-menu__link_black');
							}

						}
					}
				});
		}

		// custom listeners
		$(window).on('resize', throttle(function() {
			_setHeadingWidth();
		}, 500));

		function _getScrollNodes(id) {
			var node = $('#' + id),
				id = id,
				link = $('a[href$="' + id + '"]'),
				parent = link.parent(),
				submenu = parent.find('.submenu') || '',
				subBar = submenu.find('.submenu__progress-bar') || '',
				subBarParent = subBar.parent() || '',
				bar = parent.find('.nav-menu__progress-bar'),
				barParent = bar.parent(),
				title = node.find('.scroll-item__heading'),
				titleText = node.find('.scroll-item__heading').text(),
				isSubmenuHideTrigger = parent.next().find('.submenu').length,
				isInSubMenu = parent.hasClass('submenu__item'),
				isInThirdMenu = parent.hasClass('thirdmenu__item'),
				image = node.find('.scroll-item__image-wrap');

			return {
				node: node,
				id: id,
				link: link,
				parent: parent,
				bar: bar,
				barParent: barParent,
				title: title,
				titleText: titleText,
				image: image,
				submenu: submenu || '',
				subBar: subBar || '',
				subBarParent: subBarParent,
				isSubmenuHideTrigger: isSubmenuHideTrigger,
				isInSubMenu: isInSubMenu,
				isInThirdMenu: isInThirdMenu
			}
		}

		function _initAnimations() {
			var items = $('[data-animation]');

			items.each(function() {
				var block = $(this).attr('class').match(/^\w+-\w+(\-\w+)?/)[0],
					animation = $(this).data('animation');

				var animationClass = (block + '_' + animation);

				$(this).addClass(animationClass);
			});
		}

		_initAnimations();

		function _getData() {
			$.getJSON("../data.json")
				.done(function(data) {
					return data[0];
				})
				.fail(function(jqxhr, textStatus, error) {
					var err = textStatus + ", " + error;
					console.log( "Request Failed: " + err );
			});
		}

		function _fillTemplate() {
			// var data = _getData();
			return '<article id="izzy" class="scroll-item"> <div class="scroll-item__heading-wrap"> <h2 class="scroll-item__heading">izzy</h2> </div><div class="scroll-item__columns-wrap scroll-item__columns-wrap_flex"> <div data-layout="1" class="scroll-item__left-column scroll-item__left-column_flex scroll-item__left-column_layout-1"> <div class="scroll-item__image-wrap" style="background-image: url(&quot;img/home.jpg&quot;);"><img src="img/home.jpg" alt="image" class="scroll-item__image" style="display: none;"></div></div><div data-layout="1" class="scroll-item__right-column scroll-item__text scroll-item__right-column_flex scroll-item__right-column_layout-1"> <h3 class="scroll-item__subheading">Izzy</h3> <p class="scroll-item__paragraph">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt ratione officiis consectetur fuga autem sit in exercitationem velit non eveniet nesciunt sunt eaque quas at ipsam quam, hic ullam maxime pariatur veniam. Nihil mollitia voluptatem dignissimos voluptatibus nesciunt beatae accusantium.</p></div></div></article>';
		}

		function _setHeadingWidth() {
			FIXED_HEADING_WRAP.css({
				width: _getContentWidth() + 'px'
			});
		}

		function _getContentWidth() {
			return CONTENT_BLOCK.width();
		}
	})();

	// slide out menu items
	(function() {
		var slideOutItems = $('.slide-out-menu'),
			slideOutPhone = $('.nav-menu__telephone');

		slideOutItems.click(function (e) {
			e.preventDefault();
			hideHeader();
			$(this).toggleClass('slide-out-menu_active');
			$('#' + $(this).data('anchor')).toggleClass('scroll-item_slide-out_active');
		});

		slideOutPhone.click(function (e) {
			e.preventDefault();
			hideHeader();
			$('#' + $(this).data('anchor')).toggleClass('scroll-item_slide-out_active');
		});
	})();

	// intro hide on click
	(function() {
		$('#intro').click(function() {
			hideSlideOuts();
		});
	})();

	// scrollbar
	(function() {
		var scrollPosition = 0;

		var imageListHeight = $('.tab-slider__images-list').height();

		if ($('body').width() < 400) {
			$('.tab-slider__images-wrapper').css('min-height', imageListHeight + 'px');
		}

		if (mobileCheck) return;

		setTimeout(function() {
			$('body').mCustomScrollbar({
			    theme: 'minimal-dark'
			});
		}, 1000);
	})();
};
