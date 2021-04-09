$(function () {

    var BASE_URL = 'http://192.168.120.200:8012';


    //首页在线课程
    getOnlineLesson = function (pagesize, curpageindex, type, userid, columns, subjectType, free, neworder) {
        $.ajax({
            methods: 'GET',
            url: BASE_URL + '/API/GetProjectList',
            data: {
                pagesize,
                curpageindex,
                type,
                userid,
                columns,
                subjectType,
                free,
                neworder
            },
            success: function (res) {
                var data = res.rows;
                $.each(data, function (i, item) {
                    $('<div class="online_item" id="' + item.id + '" value="online"><div class="pic"><img src="./images/online.jpg" alt=""></div><div class="message"><p class="title">' + item.Title + '</p><p class="hospital line1">' + item.name + ' | ' + item.routeName + '</p><p class="timeslot">开始时间：' + item.StartTime + '</p></div></div>').appendTo('#onlineList');
                })
            }
        })
    }
    //首页离线课程
    getOffLineLesson = function (pagesize, curpageindex, type, userid, columns, subjectType, free, neworder) {
        $.ajax({
            methods: 'GET',
            url: BASE_URL + '/API/GetProjectList',
            data: {
                pagesize,
                curpageindex,
                type,
                userid,
                columns,
                subjectType,
                free,
                neworder
            },
            success: function (res) {
                var data = res.rows;
                $.each(data, function (i, item) {
                    $('<div class="online_item" id="' + item.id + '" value="offline"><div class="pic"><img src="./images/online.jpg" alt=""></div><div class="message"><p class="title">' + item.Title + '</p><p class="hospital line1">' + item.name + ' | ' + item.routeName + '</p><p class="timeslot">开始时间：' + item.StartTime + '</p></div></div>').appendTo('#offLineList');
                })
            }
        })
    }
    //获取课程详情
    getLessonDetail = function (id) {
        $.ajax({
            methods: 'GET',
            url: BASE_URL + '/API/GetProjectById',
            data: {
                id
            },
            success: function (res) {
                console.log(res)
                $('<span>'+ res.Title +'</span>').appendTo('.message_r .title');
                $('<span>编号：'+ res.pro_number +'</span>').appendTo('.message_r .number');
                $('<span>课程时间：'+ res.StartTime +' 至 '+ res.EndTime +'</span>').appendTo('.message_r .timeslot')
                $('<span>截止时间：'+ res.CutoffTime +'</span>').appendTo('.message_r .deadline');
                $('<span>授课人/所属机构：'+ res.name +' | '+ res.routeName +'</span>').appendTo('.message_r .teacher');
                $('<span>所属学科：'+ res.SubjectType +' - '+ res.Subject +'</span>').appendTo('.message_r .subject');
                $('<span>'+ res.Introduction +'</span>').appendTo('.introduction .content')
            }
        })
    }


})