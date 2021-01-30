/* global $, alert, console*/
$(document).ready(function() {

    "use-strict";

    // Adjusting loading page //
    $(".loading").delay(1000).addClass("loaded");

    var experience_time = Math.trunc(10 * (new Date() - new Date('2015-06-01')) / (86400 * 365 * 1000)) / 10;
    var age_time = Math.trunc((new Date() - new Date('1994-11-10')) / (86400 * 365 * 1000));
    $(".exp").text(experience_time);
    $(".age").text(age_time);

    waitUntil(() => {
        return isDefined(WOW);
    }, () => {
        new WOW().init();
    });

    waitUntil(() => {
        return jqueryFnDefined('niceScroll');
    }, () => {
        // Launching and adjusting NiceScroll plugin //
        $("body").niceScroll({
            scrollspeed: 40,
            mousescrollstep: 40,
            zindex: 9999,
            cursorwidth: 10,
            cursorborder: false,
            cursorborderradius: 0,
            cursorcolor: "#111"
        });
        $("body").getNiceScroll().resize();
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

    // Owl Carousel certificates
    waitUntil(() => {
        return jqueryFnDefined(['owlCarousel']);
    }, () => {
        const githubApiUrl = "https://api.github.com/repos/ftuyama/ftuyama.github.io/contents/public/certificates";
        const localhostUrl = "/public/cache/certificates.json";
        const url = location.hostname == 'localhost' ? localhostUrl : githubApiUrl;
        $.get(url, function(certificates) {
            for (i in certificates) {
                var certificate_url = `https://ftuyama.com/public/certificates/${certificates[i]['name']}`;
                $("#certificates").append(`
                    <div>
                        <embed src="${certificate_url}#toolbar=0&navpanes=0&scrollbar=0" width="480" height="360">
                        <div class='certificate-link-wrapper'>
                            <a target="_blank" class='certificate-link' href="${certificate_url}">
                                ${certificates[i]['name'].replace('.pdf', '')}
                            </a>
                        </div>
                    </div>
                `);
            };

            $("#certificates").owlCarousel({
                center: true,
                items: 2,
                loop: true,
                margin: 10,
                autoplay: true,
                autoplayTimeout: 2000
            });
        });
    });

    waitUntil(() => {
        return jqueryFnDefined(['animate']);
    }, () => {
        // Moving to About me section on clicking mouse icon //
        $("#mouse").on("click", function() {
            $("html, body").animate({
                scrollTop: $("#about-me").offset().top
            }, 1000);
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

        // Accordion in About-me Section //
        $(".acc-title").click(function() {
            $(".acc-title").not(this).removeClass("active");
            $(this).toggleClass("active");
            $(this).siblings(".acc-content").slideToggle(350);
            $(".acc-title").not(this).siblings(".acc-content").slideUp(300);
        });
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
    waitUntil(() => {
        return jqueryFnDefined(['animate']);
    }, () => {
        backToTop.click(function() {
            $("html, body").animate({
                scrollTop: 0
            }, 1200);
        });
    });

    // Start numbers animate at fun-facts section
    waitUntil(() => {
        return jqueryFnDefined(['appear', 'animateNumber']);
    }, () => {
        const githubApiUrl = "https://api.github.com/users/ftuyama";
        const localhostUrl = "/public/cache/ftuyama.json"
        const url = location.hostname == 'localhost' ? localhostUrl : githubApiUrl;
        $.get(url, function( github ) {
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
    });

    // start easy pie chart plugin when skills section appear //
    waitUntil(() => {
        return jqueryFnDefined(['easyPieChart', 'appear', 'animateNumber']);
    }, () => {
        $("#skills").appear(function() {
            $(".chart").easyPieChart({
                barColor: "#5ae",
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
    });

    // start mixitup plugin in portfolio section //
    waitUntil(() => {
        return jqueryFnDefined('mixItUp');
    }, () => {
        $("#Container").mixItUp();
    });

    // magnific popup in portfolio section //
    waitUntil(() => {
        return jqueryFnDefined('magnificPopup');
    }, () => {
        $(".open-popup-link").magnificPopup({
            type: "inline",
            fixedContentPos: !1,
            removalDelay: 100,
            closeBtnInside: !0,
            preloader: !1,
            mainClass: "mfp-fade"
        });
    });
});
