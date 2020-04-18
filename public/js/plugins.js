/* global $, alert, console*/
$(document).ready(function() {

    "use-strict";

    // Adjusting loading page //
    $(".loading").delay(1000).addClass("loaded");

    // Launching and adjusting NiceScroll plugin //
    $("html, body").niceScroll({
        scrollspeed: 40,
        mousescrollstep: 30,
        zindex: 9999,
        cursorwidth: 10,
        cursorborder: false,
        cursorborderradius: 0,
        cursorcolor: "#111"
    });

    // Moving to About me section on clicking mouse icon //
    $("#mouse").on("click", function() {
        $("html, body").animate({
            scrollTop: $("#about-me").offset().top
        }, 1000);
    });

    // Adjusting the top nav showing the top nav when scrolling >= 600 //
    $(window).scroll(function() {
        $("#top-nav, #menu").addClass("transition");
        if ($(this).scrollTop() >= 600) {
            $("#top-nav, #menu").addClass("shown");
        } else {
            $("#top-nav, #menu").removeClass("shown");
        }
    });

    // Adjusting menu showing and hiding menu on click //
    $("#menu").click(function() {
        $(this).toggleClass("active-menu");
        $("#side-menu").toggleClass("active-side-menu").children("a").removeClass("selected-item");
    });

    // some styles on menu item when clicked //
    $("#side-menu a").on("click", function() {
        $(this).addClass("selected-item").siblings().removeClass("selected-item");
        $("#menu").toggleClass("active-menu");
        $("#side-menu").toggleClass("active-side-menu");
    });

    // controlling side menu //
    // smooth scrolling when a link in the menu is clicked //
    $("a[href^='#']").on("click", function(event) {
        var target = $($(this).attr("href"));

        if (target.length) {
            event.preventDefault();
            $("html, body").animate({
                scrollTop: target.offset().top
            }, 1500);
        }
    });

    // Scroll Percentage //
    var scrollTimer = null;
    $(window).scroll(function() {
        var viewportHeight = $(this).height(),
            scrollbarHeight = viewportHeight / $(document).height() * viewportHeight,
            progress = $(this).scrollTop() / ($(document).height() - viewportHeight),
            distance = progress * (viewportHeight - scrollbarHeight) + scrollbarHeight / 2 - $("#scroll").height() / 2;
        $("#scroll")
            .css("top", distance)
            .text(" (" + Math.round(progress * 100) + "%)")
            .fadeIn(100);

        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(function() {
            $("#scroll").fadeOut();
        }, 800);
    });

    // Accordion in About-me Section //
    $(".acc-title").click(function() {
        $(".acc-title").not(this).removeClass("active");
        $(this).toggleClass("active");
        $(this).siblings(".acc-content").slideToggle(350);
        $(".acc-title").not(this).siblings(".acc-content").slideUp(300);
    });

    // Back to top button //
    // showing the button when scroll > 400  //
    var backToTop = $(".back-to-top");
    $(window).scroll(function() {
        if ($(this).scrollTop() >= 400) {
            backToTop.addClass("show-button");
        } else {
            backToTop.removeClass("show-button");
        }
    });

    // back to top on clicking the button //
    backToTop.click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 1200);
    });

    // Form Validation in contact section //
    $("#contact-form").validator().on("submit", function(e) {
        if (e.isDefaultPrevented()) {
            $(".form-response").text("Sorry, you didn't fill the form.").fadeIn(1000);
        } else {
            e.preventDefault();
            submitForm();
        }
    });

    function submitForm() {
        // Some Variables
        var name = $("#name").val(),
            mail = $("#mail").val(),
            message = $("#message").val();
        // Ajax
        $.ajax({
            type: "POST",
            url: "/send_email/",
            data: "name=" + name + "&mail=" + mail + "&message=" + message,
            beforeSend: function(text) {
                $(".submit-btn").html("Sending...");
                $(".form-response").fadeOut(500).text("");
            },
            success: function(text) {
                if (text == "success") {
                    $("#contact-form")[0].reset();
                    $(".form-response").text("Thanks! Your message sent correctly.").fadeIn(1000);
                    $(".submit-btn").html("Send Message");
                } else {
                    $(".form-response").text(text).fadeIn(1000);
                }
            }
        });
    }
    // Moving placeholder on focus in contact-me section //
    $(".contact .form-control").focusout(function() {
        var textValue = $(this).val();
        if (textValue === "") {
            $(this).removeClass("has-value");
        } else {
            $(this).addClass("has-value");
        }
    });

    // Start numbers animate at fun-facts section //
    $.get("https://api.github.com/users/ftuyama", function( github ) {
        $("#facts").appear(function() {
            $("#number_1").animateNumber({
                number: 68530
            }, 2200);
            $("#number_2").animateNumber({
                number: github.public_repos
            }, 2200);
            $("#number_3").animateNumber({
                number: 315
            }, 2200);
            $("#number_4").animateNumber({
                number: 10000
            }, 2200);
        }, {
            accX: 0,
            accY: -150
        });
    });

    // start easy pie chart plugin when skills section appear //
    $("#skills").appear(function() {
        $(".chart").easyPieChart({
            barColor: "#eaeaea",
            trackColor: false,
            scaleColor: false,
            lineWidth: 10,
            lineCap: "round",
            size: 150,
            animate: 1500
        });
        // start numbers animate at skills section //
        $("#chart_num_1").animateNumber({
            number: 88
        }, 1500);
        $("#chart_num_2").animateNumber({
            number: 63
        }, 1500);
        $("#chart_num_3").animateNumber({
            number: 73
        }, 1500);
        $("#chart_num_4").animateNumber({
            number: 45
        }, 1500);
    }, {
        accX: 0,
        accY: -150
    });

    // start mixitup plugin in portfolio section //
    $("#Container").mixItUp();

    // magnific popup in portfolio section //
    $(".open-popup-link").magnificPopup({
        type: "inline",
        fixedContentPos: !1,
        removalDelay: 100,
        closeBtnInside: !0,
        preloader: !1,
        mainClass: "mfp-fade"
    });

    // Owl Carousel for testimonials section //
    $(".test-owl").owlCarousel({
        loop: true,
        responsiveClass: true,
        margin: 10,
        nav: false,
        dots: false,
        dotsEach: false,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            }
        }
    });

    // Owl Carousel for Partners section //
    $(".partners-owl-carousel").owlCarousel({
        loop: true,
        responsiveClass: true,
        margin: 10,
        nav: false,
        dots: false,
        dotsEach: false,
        autoplay: true,
        autoplayTimeout: 1500,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });

});
/* Launching Google map */

// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, "load", init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 14,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(-23.20227, -45.90181),

        scrollwheel: false,

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#000000"
            }, {
                "lightness": 40
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 21
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById("map");

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Let"s also add a marker while we"re at it
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(30.609788, 32.268555),
        /* animation:google.maps.Animation.BOUNCE, Make the marker bounce */
        map: map,
        title: "Marqa Studio"
    });

    var infowindow = new google.maps.InfoWindow({
        content: "Marqa Studio"
    });

    google.maps.event.addListener(marker, "click", function() {
        infowindow.open(map, marker);
    });
}
