$(function () {

    var BASE_URL = 'http://192.168.120.200:8012';

    var k = 0;

    //获取用户信息
    getUserInfo = function (Userid) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetUser',
            data: {
                Userid
            },
            success: function (res) {
                var backUserInfo = res.rows;
                toGetUserInfoData(backUserInfo)
            }
        })
    }
    //修改用户信息
    changeUserInfo = function (changeInfo) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/API/UserUpdate',
            data: JSON.stringify(changeInfo),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.Success == true) {
                    $('#tips').empty();
                    $('#tips').css('display', 'block');
                    $('<span>' + res.Message + '</span>').appendTo('#tips');
                    checkChangeState();
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                        url = "index.html";
                        window.location.href = url;
                    }, 2000);

                } else {
                    $('#tips').empty();
                    $('#tips').css('display', 'block');
                    $('<span>' + res.Message + '</span>').appendTo('#tips');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 2000);
                }
            }
        })
    }
    //上传资质审核文件
    toUpLoad = function (fileBytes, userid, filename, limitType) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/API/Upload',
            data: JSON.stringify({
                fileBytes,
                userid,
                filename,
                limitType
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function (e) {
                        var load = e.loaded;
                        var tot = e.total;
                        var per = Math.floor(100 * load / tot);
                        $('#uploadLine').css('width', per + '%');   //这里指的是进度条的宽度等于完成的百分比
                        $('#progressPercent').text(per + '%'); //显示进度百分比
                    })
                }
                return xhr;
            },
            success: function (res) {

                if (res.Success == true) {
                    $('#progressBtn').text('上传成功');
                    $('#progressText').text('文件上传成功!').css({ 'color': '#0ca132' });
                    getUpLoadCallBack(res.Message);
                } else {
                    $('#progressBtn').text('失败');
                    $('#progressText').text(res.Message).css({ 'color': '#e04e34' });
                }
            }
        })
    }
    //资质审核提交
    submitVerification = function (ID, UpdateType, IdCardNo, fileurl, reamk) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/API/UserUpdate',
            data: JSON.stringify({
                ID,
                UpdateType,
                IdCardNo,
                fileurl,
                reamk
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.Success == true) {
                    $('.vertips').text('提交成功，请等待审核!').css('color', '#42c068');
                } else {
                    $('.vertips').text(res.Message).css('color', '#e04e34');
                }
            }
        })

    }
    // 获取用户讲师资质申请结果
    getApplyResult = function (Userid) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetUserLecturer',
            data: {
                Userid
            },
            success: function (res) {
                console.log(res)
                if (res.Success == true) {
                    if (res.rows[0].State == 0) {
                        //正在审核
                        $('.judgeVer .judgeResult span').text('正在审核').css('color', '#5ccffd');
                    } else if (res.rows[0].State == 1) {
                        //审核通过
                        $('.judgeVer .judgeResult span').text('审核通过').css('color', '#50b661');;
                    } else if (res.rows[0].State == 2) {
                        //审核失败
                        $('.judgeVer .judgeResult span').text('审核未通过').css('color', '#e04e34');
                        $('.judgeVer .resultReason').css('display', 'block').text('驳回理由：' + res.rows[0].L_R_R);
                        $('.judgeVer .reVerification').css('display', 'block');
                    } else {
                        //未提交
                        $('.judgeVer').css('display', 'none');
                        $('.toVerification').css('display', 'block');
                    }
                } else {
                    //未提交
                    $('.judgeVer').css('display', 'none');
                    $('.toVerification').css('display', 'block');
                }
            }
        })
    }
    //获取我的课程
    getMyLesson = function (pagesize, curpageindex, Userid, neworder) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetProjectListByUserid',
            data: {
                pagesize,
                curpageindex,
                Userid,
                neworder
            },
            success: function (res) {
                $('#myLessonList .tbody').empty();
                var data = res.rows;
                total = Math.ceil(res.total / 15);
                showPage(curpageindex, total);
                $.each(data, function (i, item) {
                    var lessontype = item.columns;
                    var columns = '';
                    if (lessontype == 'edu_class') {
                        columns = '离线课程'
                    } else {
                        columns = '在线课程'
                    }
                    if (item.SignIn_img == 0) {
                        var signState = '未上传'
                    } else {
                        var signState = '已上传'
                    }
                    $('<li><div class="operation"><div class="comment" id="' + item.id + '" number="' + item.pro_number + '" name="' + item.name + '" value="' + item.Title + '">课程评价</div><div class="upload" id="' + item.id + '" number="' + item.pro_number + '" name="' + item.name + '" value="' + item.Title + '">上传签到</div></div><div class="number">' + item.pro_number + '</div><div class="signState">' + signState + '</div><div class="name line1" title="' + item.Title + '">' + item.Title + '</div><div class="time">' + item.StartTime + '</div><div class="type">' + columns + '</div><div class="teacher line1" title="' + item.name + '">' + item.name + '</div></li>').appendTo('#myLessonList .tbody');
                })
            }
        })
    }
    //课程评价
    toEvaluation = function (ProjectID, Userid, eva_content, eva_star) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/API/AddEvaluation',
            data: JSON.stringify({
                ProjectID,
                Userid,
                eva_content,
                eva_star
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.Success == true) {
                    level = '';
                    $('.lesson_level').children().addClass('level_item');
                    $('.lesson_level').children().text('');
                    $('#commentInput').val('');
                    $(".comment_region").fadeOut(500);
                    $(".comment_region .rightComment").animate({ right: '-440px' });
                    $('#tips').empty();
                    $('#tips').css('display', 'block');
                    $('<span>评价成功</span>').appendTo('#tips');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 2000);
                } else {
                    $('#tips').empty();
                    $('#tips').css('display', 'block');
                    $('<span>' + res.Message + '</span>').appendTo('#tips');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 2000);
                    return;
                }
            }
        })
    }
    //评价列表
    getEvaluationList = function (pagesize, curpageindex, ProjectID) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetEvaluationList',
            data: {
                pagesize,
                curpageindex,
                ProjectID
            },
            success: function (res) {
                $('#allComment').empty();
                plshowPage(1, 0);
                if (res.Success == true) {
                    $('.ctitle span').empty();
                    $('<span>' + res.total + '</span>').appendTo('.ctitle span');
                    var data = res.rows;
                    $('#allComment').empty();
                    total = Math.ceil(res.total / 3);
                    plshowPage(curpageindex, total);
                    $.each(data, function (i, item) {
                        var level = item.eva_star;
                        if (level == 5) {
                            var level_ = '非常好'
                        } else if (level == 4) {
                            var level_ = '很好'
                        } else if (level == 3) {
                            var level_ = '较好'
                        } else if (level == 2) {
                            var level_ = '一般'
                        } else if (level == 1) {
                            var level_ = '较差'
                        }
                        $('<div class="comment_item"><div class="word line3">' + item.eva_content + '</div><div class="another"><div class="another_l">评价等级：<span>' + level_ + '</span></div><div class="another_r"><span>' + item.RealName + '</span><span class="line">|</span><span>' + item.addtime + '</span></div></div></div>').appendTo('#allComment');
                    })
                } else {
                    $('.ctitle span').empty();
                    $('<span>0</span>').appendTo('.ctitle span');
                }
            }
        })
    }
    //获取省份枚举
    getProvinceList = function () {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetRegion',
            data: {
                pagesize: 50,
                curpageindex: 1,
                id: 1,
                grade: 2
            },
            success: function (res) {
                var data = res.rows;
                getProvinceData(data);
                $.each(data, function (i, item) {
                    $('<option value="' + item.name + '">' + item.name + '</option>').appendTo('#selectProvince');
                })
            }
        })
    }
    //医院枚举
    getHospitalList = function (search, province) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetOrganList',
            data: {
                pagesize: 500,
                curpageindex: 1,
                search,
                regionid: province,
                nature: ''
            },
            success: function (res) {
                $('#selectHospital').empty();
                $('<option value="0">请选择所属医院</option>').appendTo('#selectHospital');
                var data = res.rows;
                if (res.Success == true) {
                    $.each(data, function (i, item) {
                        $('<option value="' + item.id + '">' + item.OrganName + '</option>').appendTo('#selectHospital');
                    })
                } else {
                    $('<option value="">暂无数据</option>').appendTo('#selectHospital');
                }
            }
        })
    }
    //对应科室列表枚举
    getDepartmentList = function (id) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetOrganById',
            data: {
                id: id
            },
            success: function (res) {
                $('#changeDepartment').empty();
                var data = res.Department;
                if (res.Success == false) {
                    $('<option value="">暂无数据</option>').appendTo('#changeDepartment');
                } else {
                    $('<option value="0">请选择所属科室</option>').appendTo('#changeDepartment');
                    $.each(data, function (i, item) {
                        $('<option value="' + item.id + '">' + item.name + '</option>').appendTo('#changeDepartment');
                    })
                }
            }
        })
    }
    //修改个人信息医院枚举
    getChangeHospitalList = function (province) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetOrganList',
            data: {
                pagesize: 500,
                curpageindex: 1,
                search: '',
                regionid: province,
                nature: ''
            },
            success: function (res) {
                $('#changeHospital').empty();
                var data = res.rows;
                if (res.Success == false) {
                    $('<option value="0">暂无数据</option>').appendTo('#changeHospital');
                } else {
                    $('<option value="0">请选择所属医院</option>').appendTo('#changeHospital');
                    $.each(data, function (i, item) {
                        $('<option value="' + item.id + '">' + item.OrganName + '</option>').appendTo('#changeHospital');
                    })
                }

            }
        })
    }
    //获取医生列表
    getDoctorList = function (Organsid, search) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetPersonByOrgansid',
            data: {
                pagesize: 500,
                curpageindex: 1,
                Organsid,
                search
            },
            success: function (res) {
                $('.sDoctor_content').empty();
                var data = res.rows;
                if (data) {
                    $.each(data, function (i, item) {
                        var orgroutename = item.orgroutename.substring(item.orgroutename.lastIndexOf("/") + 1);
                        $('<div id="' + item.id + '" class="doctor_item"><span class="name">' + item.name + '</span><span class="subname">' + orgroutename + '</span></div>').appendTo('.select_doctor .select_Doctor .sDoctor_content');
                    })
                } else {
                    $('<span class="nodoctor">暂医院暂无医师供选择</span>').appendTo('.select_doctor .select_Doctor .sDoctor_content');
                }
            }
        })
    }
    //申报听课课题
    setIssue2 = function (Type, VideoType, Subject_Type, Remarks, Userid) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/API/AddIssue',
            data: JSON.stringify({
                Type,
                VideoType,
                Subject_Type,
                Remarks,
                Userid
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res)
                if (res.Success == true) {
                    $('#tips').empty();
                    $('#tips').css('display', 'block');
                    $('<span>' + res.Message + '</span>').appendTo('#tips');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                        window.location.reload()
                    }, 2000);
                } else {
                    $('#tips').empty();
                    $('#tips').css('display', 'block');
                    $('<span>' + res.Message + '</span>').appendTo('#tips');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 2000);
                }
            }
        })
    }
    //申报讲课课题
    setIssue = function (OrgansID, PersonID, PersonName, Type, S_TeachTime, E_TeachTime, Remarks, VideoType, FreeType, RegionType, Userid) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/API/AddIssue',
            data: JSON.stringify({
                OrgansID,
                PersonID,
                PersonName,
                Type,
                S_TeachTime,
                E_TeachTime,
                Remarks,
                VideoType,
                FreeType,
                RegionType,
                Userid
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res)
                if (res.Success == true) {
                    $('#tips').empty();
                    $('#tips').css('display', 'block');
                    $('<span>' + res.Message + '</span>').appendTo('#tips');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                        window.location.reload()
                    }, 2000);
                } else {
                    $('#tips').empty();
                    $('#tips').css('display', 'block');
                    $('<span>' + res.Message + '</span>').appendTo('#tips');
                    setTimeout(function () {
                        $('#tips').css('display', 'none');
                    }, 2000);
                }
            }
        })
    }
    //申报列表
    getIussueList = function (pagesize, curpageindex, Userid, Type, VideoType, FreeType, RegionType) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetIssueListByUserid',
            data: {
                pagesize,
                curpageindex,
                Userid,
                Type,
                VideoType,
                FreeType,
                RegionType
            },
            success: function (res) {
                $('#myDeclareList .tbody').empty();
                var data = res.rows;
                total = Math.ceil(res.total / 13);
                showPage2(curpageindex, total);
                $.each(data, function (i, item) {
                    if (item.PersonID.length == '') {
                        var PersonName = item.PersonName
                    } else {
                        var PersonName = item.PersonID
                    }
                    if (item.Type == 0) {
                        var type = '听课申报'
                    } else {
                        var type = '讲课申报'
                    }
                    if (item.VideoType == 0) {
                        var vtype = '离线课程'
                    } else {
                        var vtype = '在线课程'
                    }
                    if (item.FreeType == 0) {
                        var ftype = '免费'
                    } else {
                        var ftype = '收费'
                    }
                    if (item.RegionType == 0) {
                        var rtype = '区内'
                    } else {
                        var rtype = '区外'
                    }
                    $('<li><div class="type">' + type + '</div><div class="VideoType">' + vtype + '</div><div class="setup" title="' + item.OrgansID + '">' + item.OrgansID + '</div><div class="doctor">' + PersonName + '</div><div class="FreeType">' + ftype + '</div><div class="RegionType">' + rtype + '</div><div class="TeachTime">' + item.S_TeachTime + '</div><div class="Remarks">' + item.Remarks + '</div></li>').appendTo('#myDeclareList .tbody');
                })
            }
        })
    }
    //签到表上传
    toUpLoadpic = function (fileBytes, userid, filename, limitType) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/API/Upload',
            data: JSON.stringify({
                fileBytes,
                userid,
                filename,
                limitType
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function (e) {
                        var load = e.loaded;
                        var tot = e.total;
                        var per = Math.floor(100 * load / tot);
                        $('#picUploadLine').css('width', per + '%');   //这里指的是进度条的宽度等于完成的百分比
                        $('#uploadTips').text(per + '%'); //显示进度百分比
                    })
                }
                return xhr;
            },
            success: function (res) {
                getPicUpLoadCallBack(res.Message);
            }
        })
    }
    //签到表提交
    UploadPicForSign = function (ProjectID, Userid, imgurl) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/API/AddSignIn_imgurl',
            data: JSON.stringify({
                ProjectID,
                Userid,
                imgurl
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.Success == true) {
                    $('#picSubmitTips').text('提交成功！').css({ 'color': '#0ca132' });
                } else {
                    $('#picSubmitTips').text(res.Message).css({ 'color': '#e04e34' });
                }
            }
        })
    }
    //获取当前用户报名课程上传的签到表
    getSignPicture = function (ProjectID, Userid) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/API/GetSignIn_imgurl',
            data: {
                ProjectID,
                Userid
            },
            success: function (res) {
                if (res.Success == true) {
                    var pic_url = BASE_URL + '/' + res.imgurl;
                    $('.signPicture .signFileInput .getPic').attr('src', pic_url);
                    $('.signPicture .signFileInput .getPic').css('display', 'block');
                } else {
                    return;
                }
            }
        })
    }
})
