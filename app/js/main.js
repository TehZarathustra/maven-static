(function() {
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
				
				var layoutClass = (block + '_layout-' + layout);
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