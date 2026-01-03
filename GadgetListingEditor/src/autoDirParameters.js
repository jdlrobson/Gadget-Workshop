var isRTLString = require( './isRTLString' );

var autoDir = function(selector) {
	if (selector.val() && !isRTLString(selector.val())) {
		selector.prop('dir', 'ltr');
	}
	selector.keyup(function() {
		if ( isRTLString(selector.val()) ) {
			selector.prop('dir', 'rtl');
		}
		else {
			selector.prop('dir', 'ltr');
		}
	});
};


var autoDirParameters = function(form) {
	autoDir($('#input-alt', form));
};

module.exports = autoDirParameters;
