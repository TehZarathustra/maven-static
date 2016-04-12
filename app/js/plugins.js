(function() {
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
			var items = document.querySelectorAll('article.scroll-item'),
				init;

			for (var i = 0, l = items.length; i < l; i++) {
				_makeScene(items[i]);
			}

			// loader
			// new ScrollMagic.Scene({
			// 		triggerElement: '.loader',
			// 		triggerHook: 'onEnter'
			// 	})
			// 	.addTo(controller)
			// 	.on('enter leave', function (e) {
			// 		if (e.type == 'enter') {
			// 			if (!dataFlag) {

			// 				$('.loader').removeClass('loader_hidden');

			// 				setTimeout(function() {
			// 					$('.scroll-items-wrapper').append(_fillTemplate());
			// 					var item = document.querySelectorAll('article.scroll-item');
			// 					_makeScene(item[item.length - 1]);
			// 					$('.loader').hide();
			// 				}, 1000);
							
			// 			}

			// 			dataFlag = true;
			// 		}
			// 	});
		}

		// make generic scene
		function _makeScene(item) {
			new ScrollMagic.Scene({
					triggerElement: item,
					duration: '100%'
				})
				.addTo(controller)
				.on('progress', function (e) {
					var el = _getScrollNodes(this.triggerElement().id);

					el.node.find('.scroll-item__image-wrap').each(function() {
						if ($(this).data('animationType') === 'onProgress') {
							var animation = $(this).data('animation');

							if (animation === 'vertical-parallax-1') {
								$(this).css({
									'background-position': '50% ' + e.progress.toFixed(2).replace(/\d\./, '') + '%'
								});
								if (e.progress.toFixed(2) >= 1) {
									$(this).css({
										'background-position': '50% 100%'
									});
								}
							}
							
							if (animation === 'vertical-parallax-2') {
								$(this).css({
									'transform': 'translateY(' + e.progress.toFixed(2).replace(/\d\./, '') + 'px)'
								});
								if (e.progress.toFixed(2) >= 1) {
									$(this).css({
										'transform': 'translateY(100px)'
									});
								}
							}
							
							if (animation === 'vertical-parallax-3') {
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

					if (el.isInSubMenu) {
						el.link.parent().find('.submenu__progress-bar').css({
							'height': e.progress.toFixed(2).replace(/\d\./, '')
						})
					} else {
						el.bar.css({
							'height': e.progress.toFixed(2).replace(/\d\./, '')
						})
					}

					if (el.image.data('animationType') === 'onProgress') {
						var animation = el.image.data('animation');

						
					}
					

					if (e.progress.toFixed(2) >= 0.48) {
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

						el.link.removeClass('nav-menu__link_black');

						if (el.subBarParent) el.subBarParent.show();

						if (history.pushState && firstEnter) {
			                history.pushState(null, null, "#" + el.id);
			            }

			            if (el.image.data('animationType') === 'onEnter') {
			            	var animationClass = 'scroll-item__image-wrap_' + el.image.data('animation');

			            	el.image.removeClass(animationClass);
			            }

			            if (el.isSubmenuHideTrigger) {
							$('.submenu').addClass('submenu_hidden');
						}

			            if (el.submenu) {
			            	el.submenu.removeClass('submenu_hidden');	
			            }

					} else {
						if (el.image.data('animationType') === 'onEnter') {
			            	var animationClass = 'scroll-item__image-wrap_' + el.image.data('animation');

			            	if (!el.image.hasClass(animationClass)) {
			            		el.image.addClass(animationClass);
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
						} else {
							if (e.state == 'AFTER') {
								$('.submenu').css({
									'transform': 'translateY(-' + el.link.parent().height() * (el.link.parent().index() + 1) + 'px' + ')'
								});
							} else {
								$('.submenu').css({
									'transform': 'translateY(-' + el.link.parent().height() * (el.link.parent().index()) + 'px' + ')'
								});
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
				isInSubMenu: isInSubMenu
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
	})();

})();