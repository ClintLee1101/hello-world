import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate';
//修改语言包
import zh_CN from 'vee-validate/dist/locale/zh_CN';
//VeeValidate语言包切换,放自定义提示前
Validator.addLocale(zh_CN);
//自定义验证器
//添加一个简单的手机号验证
//匹配0-9之间的数字,并且长度是11位

//自定义提示
const dictionary = {
    zh_CN: {
        messages: {
            // required: (field) => field + '不能为空'
            required: (field) => fieldDict[field] + "不能为空"
        }
    }
};
Validator.updateDictionary(dictionary);
const fieldDict = {
    "mobile":"手机号",
    "verify":"验证码",
    "password":"密码",
    "confirmPassword":"确认密码",
    "clientName":"姓名",
    "idNo":"身份证",
    "cardNo":"银行卡",
    "oldPass":"原密码"
}

Validator.extend('mobile', {
    messages: {
        zh_CN:field => '手机号码输入不正确',
    },
    validate: value => {
        return value.length == 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(value)
    }
});


Validator.extend('confirmed', {
    messages: {
        zh_CN:field => '两次密码不一致',
    },
    validate: (value, args) => {
        return value == args[0]
    }
});


Validator.extend('verify', {
    messages: {
        zh_CN:field => '验证码输入不正确',
    },
    validate: value => {
        return value.length == 6 && /^\d{6}$/.test(value)
    }
});
Validator.extend('password', {
    messages: {
        zh_CN:field => '密码格式不对',
    },
    validate: value => {
        return value.length == 6 && /^[A-Za-z0-9]+$/.test(value)
    }
});
Validator.extend('oldPass', {
    messages: {
        zh_CN:field => '密码格式不对',
    },
    validate: value => {
        return value.length == 6 && /^[A-Za-z0-9]+$/.test(value)
    }
});
Validator.extend('confirmPassword', {
    messages: {
        zh_CN:field => '确认密码格式不对',
    },
    validate: value => {
        return value.length == 6 && /^[A-Za-z0-9]+$/.test(value)
    }
});



const config = {
    errorBagName: 'errors', // change if property conflicts.
    fieldsBagName: 'fields',
    delay: 0,
    locale: 'zh_CN',
    strict: true,
    enableAutoClasses: false,
    classNames: {
        touched: 'touched', // the control has been blurred
        untouched: 'untouched', // the control hasn't been blurred
        valid: 'valid', // model is valid
        invalid: 'invalid', // model is invalid
        pristine: 'pristine', // control has not been interacted with
        dirty: 'dirty' // control has been interacted with
    },
    // events: 'blur',
    inject: true
};

export default Validator;
Vue.use(VeeValidate,config);

