/* global $, alert, console*/
$(document).ready(function() {

    "use-strict";

    // Adjusting loading page //
    $(".loading").delay(1000).addClass("loaded");

    // Launching and adjusting NiceScroll plugin //
    $("body").niceScroll({
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
            $("#top-nav, #menu").removeClass("hiden");
        } else {
            $("#top-nav, #menu").addClass("hiden");
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
                number: Math.round(+ new Date() / 100000000)
            }, 2200);
            $("#number_4").animateNumber({
                number: 10000
            }, 2200);
        }, {
            accX: 0,
            accY: -150
        });
    }).fail(function() {
        $("#facts").appear(function() {
            $("#number_1").animateNumber({
                number: 68530
            }, 2200);
            $("#number_2").animateNumber({
                number: 30
            }, 2200);
            $("#number_3").animateNumber({
                number: Math.round(+ new Date() / 100000000)
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
