
var userid = '';
var FileName = '';
var fileBytes = '';     //文件参数Base64
var picFileName = '';
var picFileBytes = '';  //上传图片参数
var fileSize = '';      //上传文件大小
var maxFile = 20480;    //文件大小限制
var FilePosition = '';  //文件接收参数
var PicFilePosition = '';   //图片接受参数
var pagesize = 15;  //课程列表
var curpageindex = 1;   //课程列表

var userInfo = {};
var changeInfo = {
    ID: "",
    UpdateType: 0,
    Age: "",
    Email: "",
    OrganId: "",
    RealName: "",
    Sex: "",
    phone: "",
};

var plPagesize = 3;
var plCurpageindex = 1;

var type = 4;
var columns = '';
var subjectType = '';
var free = '';
var neworder = 0;
var ProjectID = '';     //课程id
var level = '';         //课程评分

var subjectID = 1;      //一级学科id
var subjectTwoID = 11;  //二级学科id

var province = '';  //默认省份
var hospitalID = '';    //医院id
var hospitalSearch = '';    //搜索医院关键字
var hospitalName = '';  //医院名字
var doctorID = '';      //选择医生id
var doctorName = '';    //选择医生姓名
var doctor_search = ''; //搜索医生
var personName = '';    //手动添加医生

var changeProvince = '北京';
var changeId = 'aa17f97b-c68d-41c2-9e44-3279979b426c';
var changeOrgan = '';

//申报列表参数
var issueType = '';
var issueVideoType = '';
var issueFreeType = '';
var issueRegionType = '';

$(document).ready(function () {
    userid = JSON.parse(localStorage.getItem('GS_EDUCATION')).id;
    var userInfo = localStorage.getItem('GS_EDUCATION') || '{}';
    if (userInfo !== '{}') {
        userInfo = JSON.parse(userInfo);
        $('<span>欢迎您：来自<span class="item_x"> ' + userInfo.hospital + ' </span> 的 <span class="item_x">' + userInfo.realname + '</span></span>').appendTo('.info_r');
        $('.login_window .nickname').text(userInfo.realname);
        $('.login_window .hospital').text(userInfo.hospital);
        $('#userInfo a p').text(userInfo.realname);
        $('#userInfo a').attr('href', 'personal.html');
        $('#login').css('display', 'none');
        $('#sign').css('display', 'none');
        $('#out_').css('display', 'block');
    } else {
        return;
    }
    changeInfo.ID = userid;
    // 资质审核结果
    getApplyResult(userid);
    //我的课程
    getMyLesson(pagesize, curpageindex, userid, neworder);
    //学科枚举
    var data = JSON.parse(sessionStorage.getItem('GSLIST'));

    //选择医生枚举

    getUserInfo(userid);
    getProvinceList();
    getIussueList(13, 1, userid, issueType, issueVideoType, issueFreeType, issueRegionType)

})

//个人信息修改
toGetUserInfoData = function (backUserInfo) {

    userInfo = backUserInfo[0];
    var userMessage = {
        realname: userInfo.RealName,
        id: userid,
        hospital: userInfo.routeName
    }
    localStorage.setItem('GS_EDUCATION', JSON.stringify(userMessage));

    changeInfo.Age = userInfo.Age;
    changeInfo.Email = userInfo.Email;
    changeInfo.OrganId = userInfo.OrganId;
    changeInfo.RealName = userInfo.RealName;
    changeInfo.Sex = userInfo.Sex;
    changeInfo.phone = userInfo.phone;

    $("#changeGender option[value='']").removeAttr("selected");
    $("#changeGender option[value='" + userInfo.Sex + "']").attr("selected", "selected");
    $('input[name=changeNumber]').val(userInfo.RealName)
    $('input[name=changeEmail]').val(userInfo.Email)
    $('input[name=changePhone]').val(userInfo.phone)
    $('input[name=changeAge]').val('placeholder', userInfo.Age)
    $('input[name=changeOrgan]').attr('placeholder', userInfo.routeName)

}

$('input[name=changeOrgan]').focus(function () {
    $('.changeUserInfo').fadeIn(100);
})
$('.changeUserInfo .cover').click(function () {
    $('.changeUserInfo').fadeOut(100);
})
$('.changeUserInfo .toclose').click(function () {
    $('.changeUserInfo').fadeOut(100);
})
$('.changeClose img').click(function () {
    $('.changeUserInfo').fadeOut(100);
})
getProvinceData = function (data) {
    var province = data;
    $.each(province, function (i, item) {
        $('<option value="' + item.name + '">' + item.name + '</option>').appendTo('#changeProvince');
    })
}

$('input[name=changeNumber]').blur(function () {
    changeInfo.RealName = $(this).val();
});
$('input[name=changeEmail]').blur(function () {
    changeInfo.Email = $(this).val();
});
$('input[name=changePhone]').blur(function () {
    changeInfo.phone = $(this).val();
});
$('input[name=changeAge]').blur(function () {
    changeInfo.Age = $(this).val();
});
$('#changeGender').change(function () {
    changeInfo.Sex = $(this).val();
})
//省份医院选择器Start
$('#changeProvince').change(function () {
    changeProvince = ($("#changeProvince option:selected").val());
    if (changeProvince == 0) {
        $('#changeHospital').attr("disabled", "disabled");
        $('#changeHospital').empty();
        $('<option value="0">请选择所属医院</option>').appendTo('#changeHospital');
        $('#changeDepartment').attr("disabled", "disabled");
        $('#changeDepartment').empty();
        $('<option value="0">请选择所属科室</option>').appendTo('#changeDepartment');
    } else {
        getChangeHospitalList(changeProvince);
        $('#changeHospital').removeAttr("disabled");
        $('#changeDepartment').attr("disabled", "disabled");
        $('#changeDepartment').empty();
        $('<option value="0">请选择所属科室</option>').appendTo('#changeDepartment');
    }
})

$('#changeHospital').change(function () {
    changeId = ($("#changeHospital option:selected").val());
    if (changeId == 0) {
        $('#changeDepartment').empty();
        $('#changeDepartment').attr("disabled", "disabled");
        $('<option value="0">请选择所属科室</option>').appendTo('#changeDepartment');
    } else {
        getDepartmentList(changeId);
        $('#changeDepartment').removeAttr("disabled");
    }
})

$('#changeDepartment').change(function () {
    changeOrgan = ($("#changeDepartment option:selected").val());
})

$('.changeInfoContent .organSubmit').click(function () {
    $('.changeInfoContent .submitTips').text('');
    var hospital = $("#changeHospital option:selected").text();
    var organ = $("#changeDepartment option:selected").text();
    $('input[name=changeOrgan]').attr('placeholder', hospital + '/' + organ);
    if (changeOrgan.length != 0 && changeOrgan != 0) {
        $('.changeUserInfo').fadeOut(100);
        changeInfo.OrganId = changeOrgan;
    } else {
        $('.changeInfoContent .submitTips').text('请完善科室信息');
    }
    // console.log(hospital, organ, changeOrgan)
})
$('.userInfo_form .userInfoChange').click(function () {
    changeUserInfo(changeInfo)
})
checkChangeState = function () {
    getUserInfo(userid);
}
//省份医院选择器End

//课程申报Start

$('input[name=doctor]').focus(function () {
    $('.select_doctor').fadeIn(100);
})
$('.select_doctor .cover').click(function () {
    $('.btn_tips').text('');
    $('.select_doctor').fadeOut(100);
    $('input[name=manualName]').val('');
})
$('.select_doctor .toclose').click(function () {
    $('.btn_tips').text('');
    $('.select_doctor').fadeOut(100);
    $('input[name=manualName]').val('');
})
$('#selectProvince').change(function () {
    hospitalSearch = '';
    $("#HospitalSearchInput").val('');
    $('#selectHospital').empty();
    $('<option value="0">请选择所属医院</option>').appendTo('#selectHospital');
    $('.sDoctor_content').empty();
    province = $(this).val();
    if (province == '请选择所在省份') {
        province = '';  //默认省份
        hospitalID = '';    //医院id
        hospitalSearch = '';    //搜索医院关键字
        hospitalName = '';  //医院名字
        doctorID = '';      //选择医生id
        doctorName = '';    //选择医生姓名
        doctor_search = ''; //搜索医生
        personName = '';    //手动添加医生
        $("#sDoctorSearch").attr("disabled", true);
    } else {
        getHospitalList(hospitalSearch, province);
    }
})
$("#HospitalSearchInput").bind("input propertychange", function (event) {
    hospitalSearch = $(this).val();
    getHospitalList(hospitalSearch, province);
});
$('#selectHospital').change(function () {
    hospitalID = $(this).val();
    if (hospitalID == 0) {
        $("#HospitalSearchInput").val('');
        $('.sDoctor_content').empty();
        $("#sDoctorSearch").attr("disabled", true);
        hospitalID = '';    //医院id
        hospitalSearch = '';    //搜索医院关键字
        hospitalName = '';  //医院名字
        doctorID = '';      //选择医生id
        doctorName = '';    //选择医生姓名
        doctor_search = ''; //搜索医生
        personName = '';    //手动添加医生
    } else {
        hospitalName = $("#selectHospital option:selected").text();
        getDoctorList(hospitalID, doctor_search);
        $("#sDoctorSearch").removeAttr("disabled");
    }

})
$('.sDoctor_content').on('click', '.doctor_item', function (e) {
    personName = '';
    $(this).addClass('doctor_itemActive').siblings().removeClass('doctor_itemActive');
    doctorName = $(this).children()[0].innerText;
    doctorID = e.currentTarget.id;
})
$("#sDoctorSearch").bind("input propertychange", function (event) {
    doctor_search = $(this).val();
    getDoctorList(hospitalID, doctor_search);
});
$('input[name=manualName]').focus(function () {
    doctorID = '';
    doctorName = '';
    $('.sDoctor_content .doctor_item').removeClass('doctor_itemActive');
    $(this).css({ 'border': '1px solid #90c9d3', 'color': '#90c9d3' })
})
$('input[name=manualName]').blur(function () {
    personName = $(this).val();
    $(this).css({ 'border': '1px solid #cccccc', 'color': '#cccccc' })
})
$('.select_confirm').click(function () {
    // console.log('医院id:'+hospitalID, '医生id:'+doctorID, '自定义医生:'+personName, '医院名:'+hospitalName, '医生名:'+doctorName);
    if (hospitalID.length != 0 && doctorID.length != 0 || personName.length != 0) {
        $('.select_doctor').fadeOut(100);
        $('input[name=manualName]').val('');
        if (doctorID.length != 0 && personName.length == 0) {
            $('.form_item .doctor').val(hospitalName + '/' + doctorName);
        } else if (doctorID.length == 0 && personName.length != 0) {
            $('.form_item .doctor').val(hospitalName + '/' + personName);
        }
    } else {
        $('.select_tips').text('请完善选择信息');
    }
})

$('#startdate').datetimepicker({
    minView: 0,
    language: 'zh-CN',
    format: 'yyyy-mm-dd hh:ii',
    todayBtn: 1,//今日按钮
    autoclose: 1,//选中关闭
    todayHighlight: 1,
    forceParse: 1,
})
$("#startdate").datetimepicker("setDate", new Date());
$('#enddate').datetimepicker({
    minView: 0,
    language: 'zh-CN',
    format: 'yyyy-mm-dd hh:ii',
    todayBtn: 1,
    autoclose: 1,//选中关闭
    todayHighlight: 1,
    forceParse: 1,
})
$("#enddate").datetimepicker("setDate", new Date());

function setSubjectData() { } {
    var data = [
        { id: 1, name: "基础医学" },
        { id: 2, name: "临床内科学" },
        { id: 3, name: "临床外科学" },
        { id: 4, name: "妇产科学" },
        { id: 5, name: "儿科学" },
        { id: 6, name: "眼、耳鼻喉学" },
        { id: 7, name: "口腔医学" },
        { id: 8, name: "影像医学" },
        { id: 9, name: "急诊学与危重症医学" },
        { id: 10, name: "医学检验" },
        { id: 11, name: "公共卫生与预防医学" },
        { id: 12, name: "药学" },
        { id: 13, name: "护理学" },
        { id: 14, name: "医学教育与卫生管理" },
        { id: 15, name: "全科医学与康复医学" },
        { id: 16, name: "中医学/中西医结合医学" },
        { id: 17, name: "老年医学" },
        { id: 18, name: "输血医学" },
        { id: 19, name: "临床营养学" },
        { id: 20, name: "肿瘤医学" },
        { id: 21, name: "南方医科大学研究生课程班" },
        { id: 22, name: "精神科" },
        { id: 23, name: "手术室" },
        { id: 24, name: "运动医学科" }
    ]
    $.each(data, function (i, item) {
        $('<option value="' + item.id + '">' + item.name + '</option>').appendTo('#VsubjectType');
    })
}
$('.vdeclare_submit').click(function () {
    var Type = 0;
    var VideoType = $('#VlessonType').val();
    var Subject_Type = $('#VsubjectType').val();
    var Remarks = $('#Vremarks').val();
    console.log(Type, VideoType, Subject_Type, Remarks)
    setIssue2(Type, VideoType, Subject_Type, Remarks, userid)
})
$('.declare_submit').click(function () {
    var OrgansID = hospitalID;
    var PersonID = doctorID;
    var PersonName = personName;
    var Type = 1;
    var Remarks = $('#Remarks').val();
    var VideoType = $('#lessonType').val();
    var FreeType = $('#freeType').val();
    var S_TeachTime = $('#startdate').val();
    var E_TeachTime = $('#enddate').val();
    var RegionType = $('#positionType').val();
    console.log(OrgansID, PersonID, PersonName, Type, S_TeachTime, E_TeachTime, Remarks, FreeType, VideoType, RegionType, userid)
    setIssue(OrgansID, PersonID, PersonName, Type, S_TeachTime, E_TeachTime, Remarks, FreeType, VideoType, RegionType, userid)
})
// 课程申报End

//课程申报列表
showPage2 = function (c, t) {
    $('#Dpagination').pagination({
        currentPage: c,
        totalPage: t,
        callback: function (current) {
            curpageindex = current;
            getIussueList(13, curpageindex, userid, issueType, issueVideoType, issueFreeType, issueRegionType);
        }
    })
};
showPage2();

$('#decSearch').click(function () {
    issueType = $("#dlistsel1 option:selected").val();
    issueVideoType = $("#dlistsel2 option:selected").val();
    issueFreeType = $("#dlistsel3 option:selected").val();;
    issueRegionType = $("#dlistsel4 option:selected").val();
    getIussueList(13, curpageindex, userid, issueType, issueVideoType, issueFreeType, issueRegionType);
})

$('#decReset').click(function () {
    issueType = '';
    issueVideoType = '';
    issueFreeType = '';
    issueRegionType = '';
    $('#dlistsel1').find("option").first().attr("selected", true);
    $('#dlistsel2').find("option").first().attr("selected", true);
    $('#dlistsel3').find("option").first().attr("selected", true);
    $('#dlistsel4').find("option").first().attr("selected", true);
    getIussueList(13, curpageindex, userid, issueType, issueVideoType, issueFreeType, issueRegionType);
})
//课程申报列表end

$('.function_list .list_item').click(function () {
    var i = $(this).index();
    $('.function_list .list_item').eq(i).addClass('active').siblings().removeClass('active');
    $('.function_content .content_item').eq(i).stop().fadeIn(500).show().siblings().hide();
})
//课程
$('#myLessonList .time_t').click(function () {
    neworder = 1;
    getMyLesson(pagesize, curpageindex, userid, neworder);
    $('#myLessonList .time_t').addClass('active_t');
    $('#myLessonList .time_b').removeClass('active_b');
})

$('#myLessonList .time_b').click(function () {
    neworder = 0;
    getMyLesson(pagesize, curpageindex, userid, neworder);
    $('#myLessonList .time_b').addClass('active_b');
    $('#myLessonList .time_t').removeClass('active_t');
})

showPage = function (c, t) {
    $('#pagination').pagination({
        currentPage: c,
        totalPage: t,
        callback: function (current) {
            curpageindex = current;
            getMyLesson(pagesize, curpageindex, userid, neworder);
        }
    })
};
showPage();


$('.tbody').on('click', '.comment', function (e) {
    e.preventDefault();
    var lessonName = $(this).attr('value');
    var teacher = $(this).attr('name');
    var number = $(this).attr('number');
    ProjectID = e.currentTarget.id;
    getEvaluationList(plPagesize, plCurpageindex, ProjectID)

    $('.rightComment .lessonName').html("<span>课程名称：</span>" + lessonName);
    $('.rightComment .lessonNumber').html('<span>课程编号：</span>' + number);
    $('.rightComment .lessonTeacher').html('<span>授&ensp;课&ensp;人：</span>' + teacher);

    $(".comment_region").fadeIn(500);
    $(".comment_region .rightComment").animate({ right: '0' })
})

plshowPage = function (c, t) {
    $('#ppagination').pagination({
        currentPage: c,
        totalPage: t,
        callback: function (current) {
            plcurpageindex = current;
            getEvaluationList(plPagesize, plcurpageindex, ProjectID)
        }
    })
};
plshowPage();

$(".comment_region .cover").click(function () {
    level = '';
    $('.lesson_level').children().addClass('level_item');
    $('.lesson_level').children().text('');
    $('#commentInput').val('');
    $(".comment_region").fadeOut(500);
    $(".comment_region .rightComment").animate({ right: '-440px' });
})
$(".rightComment").click(function () {
    $(".comment_region").css('display', 'block');
})

$('.lesson_level .five').click(function (e) {
    level = '5';
    $('.lesson_level').children().addClass('level_item');
    $('.lesson_level .five').removeClass('level_item').text('非常好').siblings().text('');
    $('.lesson_level .five').prevAll().removeClass('level_item');
})
$('.lesson_level .four').click(function (e) {
    level = '4';
    $('.lesson_level').children().addClass('level_item');
    $('.lesson_level .four').removeClass('level_item').text('很好').siblings().text('');
    $('.lesson_level .four').prevAll().removeClass('level_item');
})
$('.lesson_level .three').click(function (e) {
    level = '3';
    $('.lesson_level').children().addClass('level_item');
    $('.lesson_level .three').removeClass('level_item').text('较好').siblings().text('');
    $('.lesson_level .three').prevAll().removeClass('level_item');
})
$('.lesson_level .two').click(function (e) {
    level = '2';
    $('.lesson_level').children().addClass('level_item');
    $('.lesson_level .two').removeClass('level_item').text('一般').siblings().text('');
    $('.lesson_level .two').prevAll().removeClass('level_item');
})
$('.lesson_level .one').click(function (e) {
    level = '1';
    $('.lesson_level').children().addClass('level_item');
    $('.lesson_level .one').removeClass('level_item').text('较差').siblings().text('');
    $('.lesson_level .one').prevAll().removeClass('level_item');
})

$('#comSubmit').click(function () {
    var Userid = userid;
    var comment = $('#commentInput').val();
    toEvaluation(ProjectID, Userid, comment, level)
})

//---上传签到---
$('.tbody').on('click', '.upload', function (e) {
    e.preventDefault();
    var lessonName = $(this).attr('value');
    var teacher = $(this).attr('name');
    var number = $(this).attr('number');
    ProjectID = e.currentTarget.id;
    getSignPicture(ProjectID,userid);
    $('.rightSign .lessonName').html("<span>课程名称：</span>" + lessonName);
    $('.rightSign .lessonNumber').html('<span>课程编号：</span>' + number);
    $('.rightSign .lessonTeacher').html('<span>授&ensp;课&ensp;人：</span>' + teacher);

    $(".sign_region").fadeIn(500);
    $(".sign_region .rightSign").animate({ right: '0' });
})
$('.sign_region .cover').click(function () {
    fileBytes = '';
    picFileName = '';
    picFileBytes = '';
    PicFilePosition = '';
    $('#uploadTips').text('');
    $('#picSubmitTips').text('');
    $('#picUploadLine').css('width', '0');
    $('#picUploadFile').addClass("prohibit");
    getMyLesson(pagesize, curpageindex, userid, neworder);
    $(".sign_region").fadeOut(500);
    $(".sign_region .rightSign").animate({ right: '-440px' });
    $('.signPicture .signFileInput .getPic').attr('src', '');
    $('.signPicture .signFileInput .getPic').css('display', 'none');
})
$(".rightSign").click(function () {
    $(".sign_region").css('display', 'block');
})
$('#signFileUpload').change(function () {
    if (this.files.length != 0) {
        picFileName = this.files[0].name;
        fileSize = this.files[0].size;
    } else {
        return;
    }
    var FileJudgeName = picFileName.substring(picFileName.lastIndexOf(".") + 1);
    var v = $(this).val();
    var reader = new FileReader();
    reader.readAsDataURL(this.files[0]);
    reader.onload = function (e) {
        picFileBytes = e.target.result.split(',')[1];
        var picFile = (fileSize / 1024).toFixed(0);
        if (picFile <= 1024) {
            if (FileJudgeName == 'jpg' || FileJudgeName == 'png' || FileJudgeName == 'jpeg' || FileJudgeName == 'gif') {
                $('#picUploadFile').removeClass("prohibit");
                $('#uploadTips').text('已添加:' + picFileName).css('color', '#0ca132');
            } else {
                $('#uploadTips').text('上传图片格式仅支持jpg/jpeg/png/gif');
            }
        } else {
            $('#uploadTips').text('上传图片大小不得超过1M');
        }
    }
})
$('#picUploadFile').click(function () {
    var limitType = 2;
    toUpLoadpic(picFileBytes, userid, picFileName, limitType);
})
getPicUpLoadCallBack = function (callbackMessage) {
    PicFilePosition = callbackMessage;
}
$('.sign_region .picSignSubmit').click(function () {
    UploadPicForSign(ProjectID, userid, PicFilePosition);
})
//资质上传start
$('.reVerification').click(function(){
    $('.judgeVer').css('display','none');
    $('.toVerification').css('display','block');
})
$('#uploadFile').change(function () {
    if (this.files.length != 0) {
        FileName = this.files[0].name;
        fileSize = this.files[0].size;
    } else {
        return;
    }
    var FileJudgeName = FileName.split('.')[1];
    var v = $(this).val();
    var reader = new FileReader();
    reader.readAsDataURL(this.files[0]);
    reader.onload = function (e) {
        fileBytes = e.target.result.split(',')[1];
        maxFile = (fileSize / 1024).toFixed(0);
        if (maxFile <= 20480) {
            if (FileJudgeName == 'rar' || FileJudgeName == 'zip' || FileJudgeName == '7z') {
                $('#progressBtn').text('立即上传');
                $('#progressText').text('');
                $('#progressName .proname').text(FileName);
                $('#progressBtn').removeClass("prohibit");
            } else {
                $('#progressBtn').addClass("prohibit");
                $('#progressText').text('上传文件格式仅支持zip/rar/7z').css('color', '#e04e34');
            }
        } else {
            $('#progressBtn').addClass("prohibit");
            $('#progressText').text('上传文件大小不得超过20M');
        }
    };
})
$('#progressBtn').click(function () {
    var limitType = 1;
    toUpLoad(fileBytes, userid, FileName, limitType);
})
getUpLoadCallBack = function (callbackMessage) {
    FilePosition = callbackMessage;
}
$('#verSubmit').click(function () {
    var UpdateType = 1;
    var IdCardNo = $('input[name=idcard]').val();
    var filurl = FilePosition;
    var reamk = $('#remark').val();
    submitVerification(userid, UpdateType, IdCardNo, filurl, reamk)
})
