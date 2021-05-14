$(function () {

    var BASE_URL = 'http://192.168.120.200:8012';


    //首页在线课程
    getOnlineLesson = function (pagesize, curpageindex, type, userid, columns, subjectType, free, neworder, newsort, search) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetProjectList',
            data: {
                pagesize,
                curpageindex,
                type,
                userid,
                columns,
                subjectType,
                free,
                neworder,
                newsort,
                search
            },
            success: function (res) {
                $('#onlineList').empty();
                var data = res.rows;
                total = Math.ceil(res.total / 8);
                showPage(curpageindex, total);
                $.each(data, function (i, item) {
                    if (item.stick == 1) {
                        $('<div class="online_item" id="' + item.id + '" value="online"><div class="pic"><img src="./images/online.jpg" alt=""></div><div class="message"><p class="title line2">' + item.Title + '</p><p class="hospital line1">' + item.name + ' | ' + item.routeName + '</p><p class="timeslot">开始时间：' + item.StartTime + '</p></div><div class="zd">置顶</div></div>').appendTo('#onlineList');
                    } else {
                        $('<div class="online_item" id="' + item.id + '" value="online"><div class="pic"><img src="./images/online.jpg" alt=""></div><div class="message"><p class="title line2">' + item.Title + '</p><p class="hospital line1">' + item.name + ' | ' + item.routeName + '</p><p class="timeslot">开始时间：' + item.StartTime + '</p></div></div>').appendTo('#onlineList');
                    }
                })
            }
        })
    }
    //首页离线课程
    getOffLineLesson = function (pagesize, curpageindex, type, userid, columns, subjectType, free, neworder, newsort, search) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetProjectList',
            data: {
                pagesize,
                curpageindex,
                type,
                userid,
                columns,
                subjectType,
                free,
                neworder,
                newsort,
                search
            },
            success: function (res) {
                $('#offLineList').empty();
                var data = res.rows;
                total = Math.ceil(res.total / 8);
                showPage(curpageindex, total);
                $.each(data, function (i, item) {
                    if (item.stick == 1) {
                        $('<div class="online_item" id="' + item.id + '" value="offline"><div class="pic"><img src="./images/online.jpg" alt=""></div><div class="message"><p class="title line2">' + item.Title + '</p><p class="hospital line1">' + item.name + ' | ' + item.routeName + '</p><p class="timeslot">开始时间：' + item.StartTime + '</p></div><div class="zd">置顶</div></div>').appendTo('#offLineList');
                    } else {
                        $('<div class="online_item" id="' + item.id + '" value="offline"><div class="pic"><img src="./images/online.jpg" alt=""></div><div class="message"><p class="title line2">' + item.Title + '</p><p class="hospital line1">' + item.name + ' | ' + item.routeName + '</p><p class="timeslot">开始时间：' + item.StartTime + '</p></div></div>').appendTo('#offLineList');
                    }
                })
            }
        })
    }
    //获取课程详情
    getLessonDetail = function (id) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetProjectById',
            data: {
                id
            },
            success: function (res) {
                $('<span>' + res.Title + '</span>').appendTo('.message_r .title');
                $('<span>编号：' + res.pro_number + '</span>').appendTo('.message_r .number');
                $('<span>课程时间：' + res.StartTime + ' 至 ' + res.EndTime + '</span>').appendTo('.message_r .timeslot')
                $('<span>截止时间：' + res.CutoffTime + '</span>').appendTo('.message_r .deadline');
                $('<span>授课人/所属机构：' + res.name + ' | ' + res.routeName + '</span>').appendTo('.message_r .teacher');
                $('<span>所属学科：' + res.SubjectType + ' - ' + res.Subject + '</span>').appendTo('.message_r .subject');
                $('<span>' + res.Introduction + '</span>').appendTo('.introduction .content');
                $('.message_r .enter').attr('id', res.id);
            }
        })
    }
    // 获取学科分类数据
    getSubjectClassification = function (pagesize, curpageindex, name) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetSubject_Type',
            data: {
                pagesize,
                curpageindex,
                name
            },
            success: function (res) {
                sessionStorage.setItem('GSLIST', JSON.stringify(res.rows));
            }
        })
    }
    //课程报名
    lessonSignUp = function (ProjectID, Userid) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/AddSignUp',
            data: {
                ProjectID,
                Userid
            },
            success: function (res) {
                $('#tips').empty();
                $('<span>' + res.Message + '</span>').appendTo('#tips');
                $('#tips').css('display', 'block');
                setTimeout(function () {
                    $('#tips').css('display', 'none');
                }, 2000);
                getLessonState(ProjectID, Userid);
            }
        })
    }
    //课程报名状态
    getLessonState = function (ProjectID, Userid) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetSignUp',
            data: {
                ProjectID,
                Userid
            },
            success: function (res) {
                if (res.status == 1) {
                    $('.message_r .enter').css('display', 'none');
                    $('.message_r .learn').css('display', 'block');
                } else {
                    return;
                }
            }
        })
    }
    //首页医学资讯
    getNewsList1 = function (pagesize, curpageindex, type, search) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetNewsMsgList',
            data: {
                pagesize,
                curpageindex,
                type,
                search
            },
            success: function (res) {
                var titleNews = res.rows[0];
                $('<div class="l_item" id="' + titleNews.id + '" value="info" style="background: url(images/online.jpg) no-repeat center/cover;"><div class="message"><p class="title">' + titleNews.title + '</p><p class="author">' + titleNews.author + ' | ' + titleNews.udltime + '</p></div></div>').appendTo('#info .news_l');
                var commonNews = [res.rows[1] || [], res.rows[2] || [], res.rows[3] || []];
                $.each(commonNews, function (i, item) {
                    $('<div class="r_item" id="' + item.id + '" value="info"><div class="rl_item"><img src="./images/online.jpg" alt=""></div><div class="rr_item"><div class="title line1">' + item.title + '</div><div class="abstract line2">' + item.edu_abstract + '</div><div class="author">' + item.author + ' | ' + item.udltime + '</div></div></div>').appendTo('#info .news_r');
                })
            }
        })
    }
    //首页医学文献数据
    getNewsList2 = function (pagesize, curpageindex, type, search) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetNewsMsgList',
            data: {
                pagesize,
                curpageindex,
                type,
                search
            },
            success: function (res) {
                var data = res.rows;
                $.each(data, function (i, item) {
                    $('<div class="lit_item" id="' + item.id + '" value="literature"><div class="rl_item"><img src="./images/online.jpg" alt=""></div><div class="rr_item"><div class="title line1">' + item.title + '</div><div class="abstract line2">' + item.edu_abstract + '</div><div class="author">' + item.author + ' | ' + item.udltime + '</div></div></div>').appendTo('#literature');
                })
            }
        })
    }
    //首页继教政策数据
    getNewsList3 = function (pagesize, curpageindex, type, search) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetNewsMsgList',
            data: {
                pagesize,
                curpageindex,
                type,
                search
            },
            success: function (res) {
                var data = res.rows;
                $.each(data, function (i, item) {
                    $('<div class="lit_item" id="' + item.id + '" value="policy"><div class="rl_item"><img src="./images/online.jpg" alt=""></div><div class="rr_item"><div class="title line1">' + item.title + '</div><div class="abstract line2">' + item.edu_abstract + '</div><div class="author">' + item.author + ' | ' + item.udltime + '</div></div></div>').appendTo('#policy');
                })
            }
        })
    }
    //详情医学资讯
    getDetailNewsList1 = function (pagesize, curpageindex, type, search) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetNewsMsgList',
            data: {
                pagesize,
                curpageindex,
                type,
                search
            },
            success: function (res) {
                $('#info').empty();
                var data = res.rows;
                total = Math.ceil(res.total / 5);
                showPage(curpageindex, total);
                $.each(data, function (i, item) {
                    $('<div class="news_item" id="' + item.id + '" value="info"><div class="news_pic"><img src="./images/online.jpg" alt=""></div><div class="news_message"><div class="title">' + item.title + '</div><div class="abstract">' + item.edu_abstract + '</div><div class="author">' + item.author + ' | ' + item.udltime + '</div></div></div>').appendTo('#info');
                })
            }
        })
    }
    //详情医学文献数据
    getDetailNewsList2 = function (pagesize, curpageindex, type, search) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetNewsMsgList',
            data: {
                pagesize,
                curpageindex,
                type,
                search
            },
            success: function (res) {
                $('#literature').empty();
                var data = res.rows;
                total = Math.ceil(res.total / 5);
                showPage2(curpageindex, total);
                $.each(data, function (i, item) {
                    $('<div class="news_item" id="' + item.id + '" value="literature"><div class="news_pic"><img src="./images/online.jpg" alt=""></div><div class="news_message"><div class="title">' + item.title + '</div><div class="abstract">' + item.edu_abstract + '</div><div class="author">' + item.author + ' | ' + item.udltime + '</div></div></div>').appendTo('#literature');
                })
            }
        })
    }
    getDetailNewsList3 = function (pagesize, curpageindex, type, search) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetNewsMsgList',
            data: {
                pagesize,
                curpageindex,
                type,
                search
            },
            success: function (res) {
                $('#policy').empty();
                var data = res.rows;
                total = Math.ceil(res.total / 5);
                showPage3(curpageindex, total);
                $.each(data, function (i, item) {
                    $('<div class="news_item" id="' + item.id + '" value="policy"><div class="news_pic"><img src="./images/online.jpg" alt=""></div><div class="news_message"><div class="title">' + item.title + '</div><div class="abstract">' + item.edu_abstract + '</div><div class="author">' + item.author + ' | ' + item.udltime + '</div></div></div>').appendTo('#policy');
                })
            }
        })
    }
    //获取新闻详情
    getNewsDetail = function (id) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetNewsMsgById',
            data: {
                id
            },
            success: function (res) {
                var message = decodeURIComponent(res.educontent)
                $('<div class="title">' + res.title + '</div><div class="author">作者：' + res.author + ' | 来源：' + res.source + ' | 发布时间：' + res.udltime + '</div><pre>' + message + '</pre>').appendTo('.news-content');
            }
        })
    }
    //获取在线视频列表
    getLiveList = function (ProjectID, Userid) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetOnline',
            data: {
                ProjectID,
                Userid
            },
            success: function (res) {
                var SignIn = res.SignIn;
                var SignOut = res.SignOut;
                if (SignIn == 1) {
                    $('.SignIn').addClass('active').text('已签到');
                } else {
                    $('.SignIn').removeClass('active').text('直播签到');
                }
                if (SignOut == 1) {
                    $('.SignOut').addClass('active1').text('已签退');
                } else {
                    $('.SignOut').removeClass('active1').text('直播签退');
                }
            }
        })
    }
    //获取离线视频列表
    getVideoList = function (ProjectID) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetOffline',
            data: {
                ProjectID
            },
            success: function (res) {
                // console.log(res)
                if (res.Success == false) {
                    $('<span>该课程暂无视频</span>').appendTo('.video_title');
                } else {
                    data = [

                    ]
                    var data = res.rows;
                    $('<span>课程题目：' + res.Title + '</span>').appendTo('.video_title');
                    getVideoData(data);
                    $.each(data, function (i, item) {
                        $('<div class="video_item" title="' + item.viode_name + '">' + item.viode_name + '<span></span></div>').appendTo('.video_list');
                    })
                    $('.video_item').eq(0).addClass('active');
                }


            }
        })
    }
    //直播签到地点枚举
    toSign = function (ProjectID, Userid, pro_type) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/API/AddSignIn',
            data: JSON.stringify({
                ProjectID,
                Userid,
                pro_type
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.state == 1) {
                    $('#tips').css('display', 'block').text('签到成功!');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 1000);
                } else if (res.state == 2) {
                    $('#tips').css('display', 'block').text('签退成功!');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 1000);
                }
                if (res.state == -1) {
                    $('#tips').css('display', 'block').text('已签到,请勿重复签到!');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 1000);
                } else if (res.state == -2) {
                    $('#tips').css('display', 'block').text('已签退,请勿重复签退!');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 1000);
                } else if (res.state == 0) {
                    $('#tips').css('display', 'block').text(res.Message);
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 1000);
                }
                getLiveList(ID, Userid);
            }
        })
    }
})