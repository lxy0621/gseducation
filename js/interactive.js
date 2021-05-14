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

    $('.operation').on('mouseover', '#captcha', function () {
        $('#captcha').css('marginTop', '0');
        $('.pic_canvas').css('display', 'block');
        $('.block').css('display', 'block');
        $('.refreshIcon').css('display', 'block');
    })

    $('.operation').on('mouseout', '#captcha', function () {
        $('#captcha').css('marginTop', '155px');
        $('.pic_canvas').css('display', 'none');
        $('.block').css('display', 'none');
        $('.refreshIcon').css('display', 'none');
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

    //个人中心退出登录
    $('#perLogOut').click(function () {
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

    $('.news_l .list_item').click(function () {
        var i = $(this).index();
        $('.news_l .list_item').eq(i).addClass('active').siblings().removeClass('active');
        $('.news_r .item_content').eq(i).stop().fadeIn(500).show().siblings().hide();
    })

    $('.newsSearch').click(function () {
        $(this).css('border', '1px solid #5ccffd');
        $(this).next().children().css('color', '#5ccffd');
    })
    $('.newsSearch').blur(function () {
        $(this).css('border', '1px solid #888888');
        $(this).next().children().css('color', '#888888');
    })

    $('.news_list').on('click', '.l_item', function (e) {
        value = $(this).attr('value');
        var id = e.currentTarget.id;
        url = "news.html?id=" + id + '&value=' + value;
        window.location.href = url;
    })

    $('.news_r').on('click', '.r_item', function (e) {
        value = $(this).attr('value');
        var id = e.currentTarget.id;
        url = "news.html?id=" + id + '&value=' + value;
        window.location.href = url;
    })

    $('.literature_list').on('click', '.lit_item', function (e) {
        value = $(this).attr('value');
        var id = e.currentTarget.id;
        url = "news.html?id=" + id + '&value=' + value;
        window.location.href = url;
    })

    $('.policy_list').on('click', '.lit_item', function (e) {
        value = $(this).attr('value');
        var id = e.currentTarget.id;
        url = "news.html?id=" + id + '&value=' + value;
        window.location.href = url;
    })

    $('#AllLessonList .content_list .list_item').click(function () {
        var list = $(this).attr('value');
        url = "offline.html?list=" + list;
        window.location.href = url;
    })

    var searchOffline = '';
    $('#searchOfflineInput').blur(function () {
        searchOffline = $(this).val();
    })
    $('#searchOffline').click(function () {
        url = "offline.html?search=" + searchOffline;
        searchOffline = '';
        $('#searchOfflineInput').val('');
        window.location.href = url;
    })
    $('.declare_tabs .dtabs_item').click(function () {
        var i = $(this).index();
        $('.declare_tabs .dtabs_item').eq(i).addClass('active').siblings().removeClass('active');
        $('.declare_contents .dcontent_item').eq(i).stop().fadeIn(500).show().siblings().hide();
    })

})