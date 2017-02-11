module.exports = initFollow;

function initFollow() {
	var el = $('.follow');
	var submitButton = el.find('button');
	var radioButton = el.find('input[type="radio"][name="type"]');
	var inputField = el.find('input[name="address"]');

	radioButton.change(function (e) {
		if (e.target.value === 'notifications') {
			inputField.hide();
			inputField.val('');
		} else {
			inputField.show();
		}
	});

	if (!el.length) {
		return;
	}

	submitButton.click(function (e) {
		e.preventDefault();
		el.addClass('sent');
	});
}
