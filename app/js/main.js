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

			console.log(activeLayouts, affectedElements);
		}

		function cleanLayout () {
			activeLayouts.map(function(el) {
				$('.' + el).removeClass(el);
				activeLayouts = [];
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
	})();
})(jQuery);