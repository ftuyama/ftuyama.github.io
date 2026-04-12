/* global $, WOW */
"use strict";

$(document).ready(function () {
    $(".loading").delay(1000).addClass("loaded");

    const experienceTime = Math.trunc(10 * (new Date() - new Date('2016-01-01')) / (86400 * 365 * 1000)) / 10;
    const ageTime = Math.trunc((new Date() - new Date('1994-11-10')) / (86400 * 365 * 1000));
    const year = new Date().getFullYear();
    $(".exp").text(experienceTime);
    $(".age").text(ageTime);
    $(".year").text(year);

    new WOW().init();

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

    $("#menu").click(function () {
        $(this).toggleClass("active-menu");
        $("#side-menu").toggleClass("active-side-menu").children("a").removeClass("selected-item");
    });

    $("#side-menu a").on("click", function () {
        $(this).addClass("selected-item").siblings().removeClass("selected-item");
        $("#menu").toggleClass("active-menu");
        $("#side-menu").toggleClass("active-side-menu");
    });

    // Owl Carousel certificates
    const githubCertsUrl = "https://api.github.com/repos/ftuyama/ftuyama.github.io/contents/public/certificates";
    const localCertsUrl = "/public/cache/certificates.json";
    const certsUrl = location.hostname === 'localhost' ? localCertsUrl : githubCertsUrl;
    $.get(certsUrl, function (certificates) {
        for (const cert of certificates) {
            const certificateUrl = `https://ftuyama.github.io/public/certificates/${cert.name}`;
            $("#certificates").append(`
                <div>
                    <embed src="${certificateUrl}#toolbar=0&navpanes=0&scrollbar=0" width="480" height="360" loading="lazy">
                    <div class='certificate-link-wrapper'>
                        <a target="_blank" class='certificate-link' href="${certificateUrl}">
                            ${cert.name.replace('.pdf', '')}
                        </a>
                    </div>
                </div>
            `);
        }

        $("#certificates").owlCarousel({
            center: true,
            items: 2,
            loop: true,
            margin: 10,
            autoplay: true,
            autoplayTimeout: 2000
        });
    });

    $("#mouse").on("click", function () {
        $("html, body").animate({
            scrollTop: $("#about-me").offset().top
        }, 1000);
    });

    $("a[href^='#']").on("click", function (event) {
        const target = $($(this).attr("href"));

        if (target.length) {
            event.preventDefault();
            $("html, body").animate({
                scrollTop: target.offset().top
            }, 1500);
        }
    });

    $(".acc-title").click(function () {
        $(".acc-title").not(this).removeClass("active");
        $(this).toggleClass("active");
        $(this).siblings(".acc-content").slideToggle(350);
        $(".acc-title").not(this).siblings(".acc-content").slideUp(300);
    });

    // Consolidated scroll state
    const backToTop = $(".back-to-top");
    let lastScrollTop = 0;
    let ticking = false;
    const delta = 5;
    const navbarHeight = $('nav').outerHeight();

    backToTop.click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 1200);
    });

    function handleNavbarVisibility(scrollTop) {
        if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

        if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
            $('nav').animate({ top: '-69px' }, 'easeInOutCubic');
        } else if (scrollTop + $(window).height() < $(document).height()) {
            $('nav').animate({ top: '0px' }, 'easeInOutCubic');
        }

        lastScrollTop = scrollTop;
    }

    $(window).on('scroll', function () {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const scrollTop = $(window).scrollTop();

            $("#top-nav, #menu").addClass("transition");
            if (scrollTop >= 600) {
                $("#top-nav, #menu").addClass("shown").removeClass("hiden");
            } else {
                $("#top-nav, #menu").addClass("hiden").removeClass("shown");
            }

            if (scrollTop >= 400) {
                backToTop.addClass("show-button");
            } else {
                backToTop.removeClass("show-button");
            }

            handleNavbarVisibility(scrollTop);

            ticking = false;
        });
    });

    // Fun facts animated numbers
    function animateFunFacts(repoCount) {
        $("#facts").appear(function () {
            $("#number_1").animateNumber({ number: 68530 }, 2200);
            $("#number_2").animateNumber({ number: repoCount }, 2200);
            $("#number_3").animateNumber({ number: Math.round(+new Date() / 100000000) }, 2200);
            $("#number_4").animateNumber({ number: 10000 }, 2200);
        }, { accX: 0, accY: -150 });
    }

    const githubApiUrl = "https://api.github.com/users/ftuyama";
    const localApiUrl = "/public/cache/ftuyama.json";
    const apiUrl = location.hostname === 'localhost' ? localApiUrl : githubApiUrl;
    $.get(apiUrl, function (github) {
        animateFunFacts(github.public_repos);
    }).fail(function () {
        animateFunFacts(30);
    });

    // Skills pie charts
    $("#skills").appear(function () {
        $(".chart").easyPieChart({
            barColor: "#5ae",
            trackColor: false,
            scaleColor: false,
            lineWidth: 10,
            lineCap: "round",
            size: 150,
            animate: 1500
        });
        $("#chart_num_1").animateNumber({ number: 88 }, 1500);
        $("#chart_num_2").animateNumber({ number: 63 }, 1500);
        $("#chart_num_3").animateNumber({ number: 73 }, 1500);
        $("#chart_num_4").animateNumber({ number: 45 }, 1500);
    }, { accX: 0, accY: -150 });

    $("#Container").mixItUp();

    $(".open-popup-link").magnificPopup({
        type: "inline",
        fixedContentPos: false,
        removalDelay: 100,
        closeBtnInside: true,
        preloader: false,
        mainClass: "mfp-fade"
    });
});
