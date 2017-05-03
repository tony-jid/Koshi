function manipulateProductDirectLink() {
	if ($(window).width() > 750) {
		$('#menuProduct').click(function(){ window.location.replace('products.html'); });
	}
	
	// Adjust direct link to "Product" page
    $(window).resize(function() {
    	$('#menuProduct').unbind('click');
		// if the actual width > 768
		if ($(window).width() > 750) {
			$('#menuProduct').click(function(){ window.location.replace('products.html'); });	
		}
	});
}

// Agency Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })
})(jQuery); // End of use strict
