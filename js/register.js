$(function () {

    var BASE_URL = 'http://192.168.120.200:8012';

    //城市枚举
    getProvinceList = function () {
        $.ajax({
            methods: 'GET',
            url: BASE_URL + '/API/GetRegion',
            data: {
                pagesize: 50,
                curpageindex: 1,
                id: 1,
                grade: 2
            },
            success: function (res) {
                var data = res.rows;
                $.each(data, function (i, item) {
                    $('<option value="' + item.name + '">' + item.name + '</option>').appendTo('#province');
                })
            }
        })
    }

    //医院枚举
    getHospitalList = function (province) {
        $.ajax({
            methods: 'GET',
            url: BASE_URL + '/API/GetOrganList',
            data: {
                pagesize: 500,
                curpageindex: 1,
                search: '',
                regionid: province,
                nature: ''
            },
            success: function (res) {
                $('#hospital').empty();
                var data = res.rows;
                if (res.Success == false) {
                    $('<option value="0">暂无数据</option>').appendTo('#hospital');
                } else {
                    $('<option value="0">请选择所属医院</option>').appendTo('#hospital');
                    $.each(data, function (i, item) {
                        $('<option value="' + item.id + '">' + item.OrganName + '</option>').appendTo('#hospital');
                    })
                }

            }
        })
    }

    //对应科室列表枚举
    getDepartmentList = function (id) {
        $.ajax({
            methods: 'GET',
            url: BASE_URL + '/API/GetOrganById',
            data: {
                id: id
            },
            success: function (res) {
                $('#department').empty();
                var data = res.Department;
                if (res.Success == false) {
                    $('<option value="">暂无数据</option>').appendTo('#department');
                } else {
                    $('<option value="0">请选择所属科室</option>').appendTo('#department');
                    $.each(data, function (i, item) {
                        $('<option value="' + item.id + '">' + item.name + '</option>').appendTo('#department');
                    })
                }
            }
        })
    }

    //手机号码判断重复
    checkPhone = function (phone) {
        $.ajax({
            methods: 'GET',
            url: BASE_URL + '/API/PhoneRepeat',
            data: {
                phone: phone
            },
            success: function (res) {
                if (res.State == 0) {
                    $('.backtips').text('');
                } else {
                    $('.backtips').css('color', '#e04e34');
                    $('.backtips').text(res.Message);
                }
            }
        })
    }

    //注册系统账号
    registerUser = function (username, password, realname, email, phone, sex, age, organId) {
        $.ajax({
            methods: 'GET',
            url: BASE_URL + '/API/RegisterUser',
            data: {
                username,
                password,
                realname,
                email,
                phone,
                sex,
                age,
                organId
            },
            success: function (res) {
                if (res.Success == true) {
                    $('.backtips').css('color', '#42c068');
                    $('.backtips').text(res.Message);
                } else {
                    $('.backtips').css('color', '#e04e34');
                    $('.backtips').text(res.Message);
                }
            }
        })
    }
    //登录
    userLogin = function (username, password) {
        $.ajax({
            methods: 'GET',
            url: BASE_URL + '/API/UserLogin',
            data: {
                username,
                password
            },
            success: function (res) {
                if (res.Success == true) {
                    var userMessage = {
                        realname: res.RealName,
                        id: res.id,
                        hospital: res.HospitalName
                    }
                    $('.operation .tips').text('');
                    localStorage.setItem('GS_EDUCATION', JSON.stringify(userMessage));
                    url = "index.html";
                    window.location.href = url;
                } else {
                    $('.operation .tips').text(res.Message);
                }
            }
        })
    }


})