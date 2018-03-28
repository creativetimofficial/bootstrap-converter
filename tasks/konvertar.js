module.exports = function (gulp, $) {
    'use strict';


    gulp.task('converter-html', function () {
      return gulp
        .src(['html/**/*.html'])
        .pipe($.cheerio({
          run: function ($, file) {
              smartConverter($, file);
          }
        }))
        .pipe(gulp.dest('build/'));
    });
    gulp.task('move-assets', function () {
      return gulp
        .src(['html/assets/**/*'])
        .pipe(gulp.dest('build/assets'));

    });

    gulp.task('converter', ['converter-html', 'move-assets'])
};


function smartConverter($, file) {
    // priority 3
    inputConverter($,file);
    hideConverter($, file);
    imageConverter($,file);
    buttonsConverter($, file);
    listLiConverter($,file);

    // priority 2
    paginationConverter($,file);
    carouselConverter($,file);
    pullConverter($,file);
    wellConverter($,file);
    blockquoteConverter($,file);
    dropdownConverter($, file);

    // priority 1
    inConverter($,file);
    tableConverter($, file);

    //navbar
    navbarConverter($, file);



    // $('head').append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"> \n <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous"> \n');
    // $('body').after('<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>');


    $('.card').each(function () {
        $this = $(this);
        if ($this.hasClass('card-background')) {
            convertCardBackground($this, $);
        } else if ($this.hasClass('card-horizontal')) {
            convertCardHorizontal($this, $);
        } else if ($this.hasClass('card-image')) {
            convertCardDefault($this, $);
        } else {
            convertCardDefault($this, $);
        }
    });
}

function convertCardDefault($old_card, $) {
    classes = $old_card.attr('class');
    var $new_card = $('<div class="'+classes+'"></div>');
    $old_card.children().each (function() {
        // console.log($(this).find(".header"));
        if ($(this).hasClass("header")) {

            $(this).removeClass('header');
            $new_card.append('<div class="card-header ' + $(this).attr('class') + '"></div>');
            $new_card.children(".card-header").append($(this).html());

        } else if ($(this).hasClass('image')) {
            if ($(this).children().length != 0){
                $new_card.append('<div class="card-header ' + $(this).attr('class') + '"></div>');
                $new_card.children(".card-header").append($(this).html());
                img_url = $(this).children('img').attr('src');
                $new_card.children(".card-header").attr('style', 'background-image: url("'+ img_url+'"); background-position: center center; background-size: cover;');
                $new_card.children(".card-header").find('img').remove();
            }

        } else if ($(this).hasClass("content")) {

            $(this).removeClass('content');
            $new_card.append('<div class="card-body ' + $(this).attr('class') + '"></div>');
            $new_card.children(".card-body").append($(this).html());

            if ($new_card.children(".card-body").children(".card-footer, .footer").length != 0) {

                footer = $new_card.children(".card-body").children(".card-footer, .footer").first();

                $new_card.children(".card-body").children(".footer").remove();
                $new_card.children(".card-body").children(".card-footer").remove();


                $new_card.children(".card-body").children(".card-footer").remove();
                $new_card.append('<div class="card-footer ' + $(this).attr('class') + '"></div>');
                $new_card.children(".card-footer").append(footer.html());
            }

        } else if ($(this).hasClass("card-footer") || $(this).hasClass("footer") || $(this).hasClass("text-center")) {

            $(this).removeClass('card-footer');
            $(this).removeClass('footer');
            $new_card.append('<div class="card-footer ' + $(this).attr('class') + '"></div>');
            $new_card.children(".card-footer").append($(this).html());
        }
    });

    // console.log($new_card.children());

    $new_card = applyFilterBS4($new_card, $);

    $old_card.after($new_card);
    $old_card.remove();
}

function convertCardBackground($old_card, $) {
    classes = $old_card.attr('class');
    var $new_card = $('<div class="'+classes+'"></div>');
    $old_card.children().each (function() {
        // console.log($(this).find(".header"));
        if ($(this).hasClass('image')) {
            $(this).addClass('card-header');
            img_url = $(this).children('img').attr('src');
            $(this).attr('style', 'background-image: url("'+ img_url+'"); background-position: center center; background-size: cover;');
            $(this).find('img').remove();
            $new_card.append($(this));

        } else if ($(this).hasClass("content")) {

            $(this).removeClass('content');
            $new_card.append('<div class="card-img-overlay ' + $(this).attr('class') + '"></div>');
            $new_card.children(".card-img-overlay").append($(this).html());

        } else if ($(this).hasClass("card-footer") || $(this).hasClass("footer")) {

            $(this).removeClass('card-footer');
            $(this).removeClass('footer');
            $new_card.append('<div class="card-footer ' + $(this).attr('class') + '"></div>');
            $new_card.children(".card-footer").append($(this).html());
        }
    });

    // console.log($new_card.children());

    $new_card = applyFilterBS4($new_card, $);

    $this.after($new_card);
    $this.remove()
}

function convertCardHorizontal($old_card, $) {
    classes = $old_card.attr('class');
    var $new_card = $('<div class="'+classes+'"></div>');
    $row = $('<div class="row"></div>');
    $old_card.find("[class*='col-']").each(function (){
        $div_image = $(this).children('.image');
        $div_content = $(this).children('.content');

        if ($div_image.length != 0) {

            $new_col = $('<div class="'+ $(this).attr('class') +'"></div>');
            $div_image.addClass('card-header');
            img_url = $div_image.children('img').attr('src');
            $div_image.attr('style', 'background-image: url("'+ img_url+'"); background-position: center center; background-size: cover;');
            $div_image.find('img').remove();
            $new_col.append($div_image);
            $row.append($new_col);

        } else if ($div_content.length != 0) {
            $div_content.removeClass('content');
            $card_body = $('<div class="card-body ' + $div_content.attr('class') + '"></div>');
            $card_body.append($div_content.html());

            if ($card_body.children(".card-footer, .footer").length != 0) {

                footer = $card_body.children(".card-footer, .footer").first();

                $footer = $('<div class="card-footer ' + footer.attr('class') + '"></div>');
                $footer.append(footer.html());

                $footer.removeClass('footer');

                $card_body.children(".footer").remove();
                $card_body.children(".card-footer").remove();
            }
            $new_col = $('<div class="'+ $(this).attr('class') +'"></div>');
            $new_col.append($card_body);
            $new_col.append($footer);
            $row.append($new_col);

        }
    });



    $new_card.append($row);
    $new_card = applyFilterBS4($new_card, $);
    // console.log($new_card);

    $old_card.after($new_card);
    $old_card.remove();

}


function applyFilterBS4($element, $) {
    $element = replaceClass($element, 'title', 'card-title', $);
    $element = replaceClass($element, 'description', 'card-description', $);
    $element = replaceClass($element, 'category', 'card-category', $);

    // bs3 to bs4
    $element = replaceClass($element, 'panel-danger', 'card bg-danger text-white', $);
    $element = replaceClass($element, 'panel-warning', 'card bg-warning', $);
    $element = replaceClass($element, 'panel-info', 'card bg-info text-white', $);
    $element = replaceClass($element, 'panel-success', 'card bg-success text-white', $);
    $element = replaceClass($element, 'panel-primary', 'card bg-primary text-white', $);
    $element = replaceClass($element, 'panel-footer', 'card-footer', $);
    $element = replaceClass($element, 'panel-body', 'card-body', $);
    $element = replaceClass($element, 'panel-title', 'card-title', $);
    $element = replaceClass($element, 'panel-heading', 'card-header', $);
    $element = replaceClass($element, 'panel', 'card', $);

    return $element;

}


function replaceClass($element, old_class, new_class, $) {
    $element.find('.' + old_class).each(function () {
        classes = $(this).attr('class');
        classes = classes.replace(old_class, new_class);

        $(this).attr('class', classes);
    });


    return $element;
}

function inputConverter($,file){
    $('.form-group .control-label').each(function() {
        $(this).addClass('form-control-label').removeClass('control-label');
    });

    $('.form-group .text-help').each(function() {
        $(this).addClass('form-control-feedback').removeClass('text-help');
    });

    $('.control-group .help-block').each(function() {
        $(this).addClass('form-text').removeClass('help-block');
    });

    $('.form-group-sm').each(function () {
        $(this).addClass('form-control-sm').removeClass('form-group-sm');
    });

    $('.form-group-lg').each(function () {
        $(this).addClass('form-control-lg').removeClass('form-group-lg');
    });

    $('.form-control').each(function () {
        if ($(this).hasClass('input-lg')) {
            $(this).addClass('form-control-lg').removeClass('input-lg');
        }
        if ($(this).hasClass('input-sm')) {
            $(this).addClass('form-control-sm').removeClass('input-sm');
        }
    });
}

function imageConverter($,file){
    $('.img-rounded').each(function() {
        $(this).addClass('rounded').removeClass('img-rounded');
    });

    $('.img-circle').each(function() {
        $(this).addClass('rounded-circle').removeClass('img-circle');
    });

    $('.img-responsive').each(function() {
        $(this).addClass('img-fluid').removeClass('img-responsive');
    });
}


function buttonsConverter($, file){
    $('.btn-default').each(function() {
        $(this).addClass('btn-secondary').removeClass('btn-default');
    });

    $('.btn-xs').each(function() {
        $(this).addClass('btn-sm').removeClass('btn-xs');
    });

    $('.btn-group.btn-group-xs').each(function() {
        $(this).addClass('btn-group-sm').removeClass('btn-group-xs');
    });

    $('.dropdown .divider').each(function() {
        $(this).addClass('dropdown-divider').removeClass('divider');
    });

    $('.badge').each(function() {
        $(this).addClass('badge').addClass('badge-pill');
    });

    $('.label').each(function() {
        $(this).addClass('badge').removeClass('label');
    });

    $('.label-default').each(function() {
        $(this).addClass('badge-secondary').removeClass('label-default');
    });
    $('.label-primary').each(function() {
        $(this).addClass('badge-primary').removeClass('label-primary');
    });
    $('.label-success').each(function() {
        $(this).addClass('badge-success').removeClass('label-success');
    });
    $('.label-info').each(function() {
        $(this).addClass('badge-info').removeClass('label-info');
    });
    $('.label-warning').each(function() {
        $(this).addClass('badge-warning').removeClass('label-warning');
    });
    $('.label-danger').each(function() {
        $(this).addClass('badge-danger').removeClass('label-danger');
    });

    $('.breadcrumb > li').each(function() {
        $(this).addClass('breadcrumb-item').removeClass('breadcrumb');
    });
}
function listLiConverter($,file) {
    $('.list-inline > li').each(function() {
        $(this).addClass('list-inline-item');
    });
}


function paginationConverter($,file) {
    $('.pagination > li').each(function() {
        $(this).addClass('page-item');
    });

    $('.pagination > li > a').each(function() {
        $(this).addClass('page-link');
    });
}

function hideConverter($,file){
    $('.hidden-xs').each(function() {
        $(this).addClass('d-none').removeClass('hidden-xs');
    });

    $('.hidden-sm').each(function() {
        $(this).addClass('d-sm-none').removeClass('hidden-sm');
    });

    $('.hidden-md').each(function() {
        $(this).addClass('d-md-none').removeClass('hidden-md');
    });

    $('.hidden-lg').each(function() {
        $(this).addClass('d-lg-none').removeClass('hidden-lg');
    });

    $('.visible-xs').each(function() {
        $(this).addClass('d-block').addClass('d-sm-none').removeClass('visible-xs');
    });

    $('.visible-sm').each(function() {
        $(this).addClass('d-block').addClass('d-md-none').removeClass('visible-sm');
    });

    $('.visible-md').each(function() {
        $(this).addClass('d-block').addClass('d-lg-none').removeClass('visible-md');
    });

    $('.visible-lg').each(function() {
        $(this).addClass('d-block').addClass('d-xl-none').removeClass('visible-lg');
    });
}

function carouselConverter($,file) {
    $('.carousel .carousel-inner > .item').each(function() {
        $(this).addClass('carousel-item').removeClass('item');
    });
}
function pullConverter($,file) {
    $('.pull-right').each(function() {
        $(this).addClass('float-right').removeClass('pull-right');
    });

    $('.pull-left').each(function() {
        $(this).addClass('float-left').removeClass('pull-left');
    });

    $('.center-block').each(function() {
        $(this).addClass('mx-auto').removeClass('center-block');
    });
}

function wellConverter($, file) {
    $('.well').each(function() {
        var card = $("<div class='card'></div>");
        card.append("<div class='card-body'></div>");
        card.children('.card-body').append($(this).html());
        $(this).after(card);
        $(this).remove();
    });
    $('.thumbnail').each(function() {
        var card = $("<div class='card'></div>");
        card.append("<div class='card-body'></div>");
        card.children('.card-body').append($(this).html());
        $(this).after(card);
        $(this).remove();
    });
}


function blockquoteConverter($,file) {
    $('blockquote').each(function () {
        var classes = $(this).attr("class");
        var div = $("<div class='blockquote "+classes+"'></div>");
        div.append($(this).html());
        $(this).after(div);
        $(this).remove();
    });

    $('.blockquote.blockquote-reverse').each(function() {
        $(this).addClass('text-right').removeClass('blockquote-reverse');
    });

}

function inConverter($, file) {
    $('.in').each(function () {
        $(this).addClass('show').removeClass('in')
    });
}
function tableConverter($, file){
    $('tr.active, td.active').each(function() {
        $(this).addClass('table-active').removeClass('active');
    });

    $('tr.success, td.success').each(function() {
        $(this).addClass('table-success').removeClass('success');
    });

    $('tr.info, td.info').each(function() {
        $(this).addClass('table-info').removeClass('info');
    });

    $('tr.warning, td.warning').each(function() {
        $(this).addClass('table-warning').removeClass('warning');
    });

    $('tr.danger, td.danger').each(function() {
        $(this).addClass('table-danger').removeClass('danger');
    });

    $('table.table-condesed').each(function() {
        $(this).addClass('table-sm').removeClass('table-condesed');
    });

}

function dropdownConverter($, file){
    $('.dropdown-menu > li > a').each(function() {
        $(this).addClass('dropdown-item');
    });

    $('.dropdown-menu > li').each(function() {
        var aContent = $(this).html();
        $(this).after(aContent);
        $(this).remove();
    });
}

function navbarConverter($, file){
    $('.nav.navbar > li > a').each(function() {
        $(this).addClass('nav-link');
    });

    $('.nav.navbar > li').each(function() {
        $(this).addClass('nav-intem');
    });

    $('.navbar-btn').each(function() {
        $(this).addClass('nav-item').removeClass('.navbar-btn');
    });

    $('.navbar-nav').each(function() {
        $(this).addClass('ml-auto').removeClass('navbar-right').removeClass('nav');
    });

    $('.navbar-toggle').each(function() {
        $(this).addClass('ml-auto').removeClass('navbar-toggler-right');
    });

    $('.navbar-nav > li > a').each(function() {
        $(this).addClass('nav-link');
    });

    $('.navbar-nav > li').each(function() {
        $(this).addClass('nav-item');
    });

    $('.navbar-nav > a').each(function() {
        $(this).addClass('navbar-brand');
    });

    $('.navbar-fixed-top').each(function() {
        $(this).addClass('fixed-top').removeClass('navbar-fixed-top');
    });

    $('.navbar-toggle').each(function() {
        $(this).addClass('navbar-toggler').removeClass('navbar-toggle');
    });

    $('.nav-stacked').each(function() {
        $(this).addClass('flex-column').removeClass('nav-stacked');
    });

    $('nav.navbar').each(function() {
        $(this).addClass('navbar-expand-lg');
    });

    $('button.navbar-toggle').each(function() {
        $(this).addClass('navbar-expand-md').removeClass('navbar-toggle');
    });


}
