$(function () {

    //INDEX

    $('#slidershow').carousel({
        interval: 2500 // in milliseconds
    })

    $('.list').mouseover(function () {
        $('.lesson_list').css('display', 'block');
    })
    $('.lesson_list').mouseover(function () {
        $('.lesson_list').css('display', 'block');
    })
    $('.list').mouseout(function () {
        $('.lesson_list').css('display', 'none');
    })
    $('.lesson_list').mouseout(function () {
        $('.lesson_list').css('display', 'none');
    })

    //Login

    $('.login').mouseover(function () {
        $('.login_window').css('display', 'block');
    })
    $('.login_window').mouseover(function () {
        $('.login_window').css('display', 'block');
    })
    $('.login').mouseout(function () {
        $('.login_window').css('display', 'none');
    })
    $('.login_window').mouseout(function () {
        $('.login_window').css('display', 'none');
    })
    $('#login').click(function () {
        url = "login.html";
        window.location.href = url;
    })
    $('#sign').click(function () {
        url = "sign.html";
        window.location.href = url;
    })

    $('#out').click(function () {
        window.location.reload();
        localStorage.removeItem('GS_EDUCATION');
    })

    $('#out_').click(function () {
        localStorage.removeItem('GS_EDUCATION');
        url = "login.html";
        window.location.href = url;
    })

    $('.operation .number input').focus(function () {
        $('.operation .number').css('border', '1px solid #5ccffd');
    })
    $('.operation .number input').blur(function () {
        $('.operation .number').css('border', '1px solid #cccccc');
    })

    $('.operation .password input').focus(function () {
        $('.operation .password').css('border', '1px solid #5ccffd');
    })
    $('.operation .password input').blur(function () {
        $('.operation .password').css('border', '1px solid #cccccc');
    })

    $('.sign .form input').focus(function () {
        $(this).css('border', '1px solid #5ccffd');
    })

    $('.sign .form input').blur(function () {
        $(this).css('border', '1px solid #cccccc');
    })

    //跳转详情
    $('.online_list').on('click', '.online_item', function (e) {
        value = $(this).attr('value');
        var id = e.currentTarget.id;
        url = "detail.html?id=" + id + '&value=' + value;
        window.location.href = url;
    })

    $('#avatarLogin').click(function () {
        url = "personal.html";
        window.location.href = url;
    })

})