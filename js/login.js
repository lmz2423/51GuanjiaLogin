/**
 * Created by luomingzhong on 2014/7/29.
 */
var elementObject = {};
elementObject.key = document.querySelector('.main').getAttribute('data-key');
elementObject.iphone = document.querySelector('#iphoneNumber');//电话
elementObject.peopleID = document.querySelector('#PeopleID');//身份证
elementObject.name = document.querySelector('#peopleName');//姓名
elementObject.regu = /^[a-zA-Z\u4e00-\u9fa5]+$/;//校验姓名 包含中文和英文
elementObject.regID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;//校验身份证，是简单的校验
elementObject.submitButton = document.querySelector("input[type='submit']");
elementObject.errorText = $('.errorText');//错误信息提示
elementObject.form = document.querySelector(".formBlock");//表格
var errorTextConfig = {
    iphone: {
        empty: "手机号码不能为空！",
        errorRule: "手机号码不符合规则！"
    },
    ID: {
        empty: "身份证号码不能为空！",
        errorRule: "身份证号码不符合规则！"
    },
    name: {
        empty: "姓名不能为空",
        errorRule: "请输入中文或英文！"
    }
};
var AddEventListener = function (element, eventype, callfunc) {
    if (element.addEventListener) {
        element.addEventListener(eventype, callfunc);
    }
    else {
        element.attachEvent(eventype, callfunc);
    }
};
var Login = (function () {
    var Login = {};
    //验证手机号
    Login.checkPhoneNumber = function (iphone) {
        var iphoneValue = iphone.value.trim();
        if ((/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(iphoneValue)) && iphoneValue.length === 11) {
            return true;
        }
        else if (iphoneValue.length === 0) {
            return "empty";
        }
        else {
            return false;
        }
    };

    //检测姓名
    Login.checkChineseName = function (name) {
        var nameText = name.value.trim();
        if (nameText.length === 0) {
            return "empty";
        }
        else if (elementObject.regu.test(nameText)) {
            return true;
        }
        return false;
    };

    //检测身份证
    Login.checkID = function (peopleID) {
        var peopleIDText = peopleID.value.trim();
        if (peopleIDText.length === 0) {
            return 'empty'
        }
        else if (elementObject.regID.test(peopleIDText)) {
            return true;
        }
        return false;
    };

    //submit 提交动作
    Login.submit = function (e) {
        var errorArray = new Array();
        errorArray[0] = new Array();
        errorArray[1] = new Array();


        e.preventDefault();
        var returnValueName = this.checkChineseName(elementObject.name),
            returnValueID = this.checkID(elementObject.peopleID),
            returnValueIphoneNumber = this.checkPhoneNumber(elementObject.iphone);


        //结果正确
        if (returnValueID === true &&
            returnValueName === true &&
            returnValueIphoneNumber === true) {
            //传输数据 ajax
        }

        //结果错误
        else {
            if (returnValueName === false) {
                errorArray[0].push(elementObject.name);
                errorArray[1].push(errorTextConfig.name.errorRule);
            }
            if (returnValueName === "empty") {
                errorArray[0].push(elementObject.name);
                errorArray[1].push(errorTextConfig.name.empty);
            }
            if (returnValueID === false) {
                errorArray[0].push(elementObject.peopleID);
                errorArray[1].push(errorTextConfig.ID.errorRule);
            }
            if (returnValueID === "empty") {
                errorArray[0].push(elementObject.peopleID);
                errorArray[1].push(errorTextConfig.ID.empty);
            }
            if (returnValueIphoneNumber === false) {
                errorArray[0].push(elementObject.iphone);
                errorArray[1].push(errorTextConfig.iphone.errorRule);
            }
            if (returnValueIphoneNumber === "empty") {
                errorArray[0].push(elementObject.iphone);
                errorArray[1].push(errorTextConfig.iphone.empty);
            }
            this.showErrorAndFocus(errorArray);
            this.errorInputFocus(errorArray);
        }
    };

    //下一步按钮变红
    Login.submitChecked = function (submitButton) {
        submitButton.disabled = false;
    };

    //下一步按钮变灰

    Login.submitChangeGay = function (submitButton) {
        submitButton.disabled = true;
    }

    //显示错误信息
    Login.showErrorAndFocus = function (errorTextArray) {
        var i = 0,
            length = errorTextArray[0].length,
            errorTexts = "";
        for (i; i < length; i += 1) {
            errorTexts += errorTextArray[1][i];
        }
        elementObject.errorText.text(errorTexts);
    };

    //错误的输入框聚焦
    Login.errorInputFocus = function (errorTextArray) {
        var i = 0,
            length = errorTextArray[0].length;

        for (i; i < length; i += 1) {
            errorTextArray[0][i].style.border = " 1px solid red";
        }
        errorTextArray[0][0].focus();
    }

    //加密信息 返还json字符串
    Login.enctype = function () {

    };
    //信息是否完整
    Login.informationComplete = function () {
        var isComplete = (this.checkChineseName(elementObject.name)===true) &&
            (this.checkID(elementObject.peopleID)===true) &&
            (this.checkPhoneNumber(elementObject.iphone)===true);
        return isComplete;
    };

    Login.KeyUpOrBlur = function (event) {

        if (this.informationComplete()) {
            this.submitChecked(elementObject.submitButton);
        }
        else{
            this.submitChangeGay(elementObject.submitButton);
        }

    };
    return Login;

    // 按enter
}());

//监听submit事件
AddEventListener(elementObject.form, 'submit', function (event) {
    Login.submit(event);
});

AddEventListener(elementObject.iphone, 'keyup', function (event) {
    Login.KeyUpOrBlur();
});

AddEventListener(elementObject.name, 'keyup', function (event) {
    Login.KeyUpOrBlur();
});

AddEventListener(elementObject.peopleID, 'keyup', function (event) {
    Login.KeyUpOrBlur();
});
