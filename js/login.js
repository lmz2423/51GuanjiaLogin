/**
 * Created by luomingzhong on 2014/7/29.
 */
var elementObject = {};
elementObject.key = document.querySelector('.main').getAttribute('data-key');
elementObject.pwd = document.querySelector('#pwd');//密码
elementObject.msCode = document.querySelector('#megCode');//验证
elementObject.submitButton = document.querySelector("input[type='submit']");
elementObject.checkButton = document.querySelector("input[type ='checkbox']");
elementObject.errorText = $('.errorText');//错误信息提示
elementObject.form = document.querySelector(".formBlock");//表格
elementObject.checekCodeButton = document.querySelector(".yanzhenma");//验证按钮
var errorTextConfig = {
    msCode: {
        empty: "短信验证码不能为空！",
        errorRule: "短信验证码不符合规则"
    },
    pwd: {
        empty: "密码不能为空",
        errorRule: "密码长度不符合规则！"
    },
    checkbox:{
        errorRule:"未选择同意协议！"
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

    var timeOut =60;
    //验证密码
    Login.checkPwd = function (pwd) {
        var pwdValue = pwd.value;
        if (pwdValue.length>=6&&pwdValue.length<=16) {
            return true;
        }
        else if (pwdValue.length === 0) {
            return "empty";
        }
        else {
            return false;
        }
    };

    //检测短信验证码
    Login.checkMessage = function (msCode) {
        var msCodeValue = msCode.value.trim();
        if (msCodeValue.length === 0) {
            return "empty";
        }
        else {
            return true;
        }
        return false;
    };

    //检测是否同意协议
    Login.checkProtcol = function (checkObject){
        var ischecked = checkObject.checked;
        if(ischecked){
            return true;
        }
        else{
            return false;
        }

    }

    //submit 提交动作
    Login.submit = function (e) {
        var errorArray = new Array();
        errorArray[0] = new Array();
        errorArray[1] = new Array();


        e.preventDefault();
        var returnValuePwd = this.checkPwd(elementObject.pwd),
            returnValueMsCode = this.checkMessage(elementObject.msCode),
            returnValueCheckBox = this.checkProtcol(elementObject.checkButton);


        //结果正确
        if (returnValuePwd === true &&
            returnValueMsCode === true &&
            returnValueCheckBox === true) {
            //传输数据 ajax
            this.ajaxSend();
        }

        //结果错误
        else {
            if (returnValuePwd === false) {
                errorArray[0].push(elementObject.pwd);
                errorArray[1].push(errorTextConfig.pwd.errorRule);
            }
            if (returnValuePwd === "empty") {
                errorArray[0].push(elementObject.pwd);
                errorArray[1].push(errorTextConfig.pwd.empty);
            }
            if (returnValueMsCode === false) {
                errorArray[0].push(elementObject.msCode);
                errorArray[1].push(errorTextConfig.msCode.errorRule);
            }
            if (returnValueMsCode === "empty") {
                errorArray[0].push(elementObject.msCode);
                errorArray[1].push(errorTextConfig.msCode.empty);
            }
            if (returnValueCheckBox === false) {
                errorArray[0].push(elementObject.checekCodeButton);
                errorArray[1].push(errorTextConfig.checkbox.errorRule);
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
    };

    // todo 二伟添加
    Login.ajaxSend = function() {
        $.ajax({
            url:"test.html",//发送的地址
            data:{message:this.informationIntegrated(elementObject)},//传输过去的数据
            dataType:'json',
            Type:'post',
            success:function(data){
                //data 成功 显示绑定成功
                if(data.status===200){

                }
                //信息错误失败
                if(data.status==="xxx"){
                    alert("例如");
                }
            },
            error:function(data){
                //网络错误等
                alert("网络错误");
            }
        });
    };

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

    //验证码点击效果
    Login.touchStart = function(elementObject){
        elementObject.classList.add("yanzhenmaTouch");
    };

    //离开验证码效果
    Login.touchEnd = function(elementObject){
        elementObject.classList.remove("yanzhenmaTouch");
    }

    //错误的输入框聚焦
    Login.errorInputFocus = function (errorTextArray) {
        var i = 0,
            length = errorTextArray[0].length;

        for (i; i < length; i += 1) {
            errorTextArray[0][i].style.border = " 1px solid red";
        }
        errorTextArray[0][0].focus();
    }


    //加密信息 返还密文
    Login.encrypt = function (message, key) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    };

    //整合信息为json格式的字符串
    Login.informationIntegrated = function(elementObject){
        var usePwd = elementObject.pwd.value,
            msCode = elementObject.msCode.value.trim(),
            message={};

        message.usePwd= this.encrypt(usePwd,elementObject.key);
        message.msCode = this.encrypt(msCode,elementObject.key);

        return JSON.stringify(message);
    }

    //信息是否完整
    Login.informationComplete = function (elementObject) {
        var isComplete = (this.checkPwd(elementObject.pwd)===true) &&
            (this.checkMessage(elementObject.msCode)===true) &&
            (this.checkProtcol(elementObject.checkButton)===true);
        return isComplete;
    };

    //获取验证码

    Login.getCode = function(){
        $.ajax({
            url:"test.html",
            data:{xi:""},
            dataType:"json",
            type:'post',
            success:function(){

            },
            error:function(){
                alert("信息错误");
            }
        });
    }

    //是否能够发送验证码
    Login.isCanClick = function(){
        if(timeOut===60){
            return true;
        }
        else {
            return false;
        }
    };


    Login.showClearTime= function(){
        var time = setInterval(function () {
            elementObject.checekCodeButton.innerText =timeOut -1 + "s后重发";
            timeOut = timeOut - 1;
            if (timeOut < 0) {
                timeOut =60;
                clearInterval(time);
                elementObject.checekCodeButton.innerText = "重新发送验证码";
            }
        }, 1000);
    };

    //点击获取验证码的效果
    Login.click = function(){
        if(this.isCanClick()){
            this.getCode();
            this.showClearTime();
        }
    };

    Login.KeyUpOrBlur = function (event) {

        if (this.informationComplete(elementObject)) {
            this.submitChecked(elementObject.submitButton);
        }
        else{
            this.submitChangeGay(elementObject.submitButton);
        }

    };

    //改变密码类型
    Login.checkPwdType = function(elementObject){
        elementObject.pwd.setAttribute("placeholder","");
        elementObject.pwd.setAttribute("type","password");
    };
    //
    Login.checkPwdTypeText = function(elementObject){
        var length = elementObject.pwd.value.length;
        if(length===0){
            elementObject.pwd.setAttribute("placeholder",'密码（6-16位字符）');
            elementObject.pwd.setAttribute("type",'text');
        }
    };
    return Login;

    // 按enter
}());

//监听submit事件
AddEventListener(elementObject.form, 'submit', function (event) {
    Login.submit(event);
});

AddEventListener(elementObject.pwd, 'keyup', function (event) {
    Login.KeyUpOrBlur();
});

AddEventListener(elementObject.msCode, 'keyup', function (event) {
    Login.KeyUpOrBlur();
});

AddEventListener(elementObject.checkButton, 'click', function (event) {
    Login.KeyUpOrBlur();
});

AddEventListener(elementObject.pwd,"focus",function(event){
    Login.checkPwdType(elementObject);
});

AddEventListener(elementObject.pwd,"blur",function(event){
    Login.checkPwdTypeText(elementObject);
})

AddEventListener(elementObject.checekCodeButton,'touchstart',function(event){
    Login.touchStart(elementObject.checekCodeButton);
});
AddEventListener(elementObject.checekCodeButton,'touchend',function(){
    Login.touchEnd(elementObject.checekCodeButton);
});

AddEventListener(elementObject.checekCodeButton,'click',function(){
    Login.click();
});