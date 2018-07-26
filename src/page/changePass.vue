<!--/*************************************************************************/-->
<!--/***********************      设置 - 修改登录密码      ********************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">{{title}}</div>
            <i></i>
        </header>

        <ul class="list60 spaceHT">
            <li>
                <span>{{spanTitle}}</span>
                <input type="password" v-model="input.input1" ref="pass" name="oldPass" v-validate.initial="'required|oldPass'" :class="{'input': true, 'is-danger': errors.has('password') }"  placeholder="输入当前登录密码">
                <i class="icon-emptied" v-show="input.input1" v-on:click="clearText(1)"></i>
            </li>
            <li>
                <span>新的密码</span>
                <input type="password" v-model="input.input2" ref="newPass" name="password" v-validate.initial="'required|password'" :class="{'input': true, 'is-danger': errors.has('password') }" placeholder="设置6位数字或字母">
                <i class="icon-emptied" v-show="input.input2" v-on:click="clearText(2)"></i>
            </li>
            <li>
                <span>确认密码</span>
                <input v-model="input.input3" ref="newPass_verify" name="confirmPassword" v-validate.initial="'required|confirmed:password'" :class="{'input': true, 'is-danger': errors.has('confirmPassword') }" type="password" placeholder="确认登录密码">
                <i class="icon-emptied" v-show="input.input3" v-on:click="clearText(3)"></i>
            </li>
        </ul>

        <!--错误提示-->
        <div class="eTip">
            <h6 v-if="errors.has('oldPass')">{{ errors.first('oldPass') }}</h6>
            <h6 v-else-if="errors.has('password')">{{ errors.first('password') }}</h6>
            <h6 v-else-if="errors.has('confirmPassword')">{{ errors.first('confirmPassword') }}</h6>
        </div>

        <!--<div class="btn_submit" @click="comfirm" :disabled="errors.any()">-->
            <!--<a>确定</a>-->
        <!--</div>-->
        <div class="btn_submit">
            <input type="button" @click="comfirm()" value="确定" :disabled="errors.any()">
        </div>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import alertTip from '../components/alertTip'
    import VeeValidate from '../validator/validation'
    import { mapFields } from 'vee-validate';
    import {mapState, mapActions} from 'vuex'
    import { fspService } from '../service'
    export default{
        data(){
            return {
                mobile:'',
                newPass:'',
                pass:'',
                newPass_verify:'',
                //显示弹框设置
                showNotice:false,
                options: '',
                flag:false,
                title:'修改登录密码',
                spanTitle:'原登录密码',
                input: {
                    input1: '',
                    input2: '',
                    input3: '',
                },
            }
        },
        components: {
            alertTip,

        },
        methods:{
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            clearText: function (tag) {
                this.input['input' + tag] = ''
            },
            goBack(){
                this.$router.goBack();
            },
            async changePassWord(){
                if(this.$route.query.trade){
                    let _params = {
                        type:'trade',
                        mobile:this.userFspInfo.mobile,
                        oldPasword:this.$refs.pass.value,
                        newPasword:this.$refs.newPass_verify.value
                    }
                    let res=await fspService.changePassWordTrade(_params);
                    if(res.code==0){
                        this.showNotice = true;
                        this.options = '修改成功';
                        this.$router.push({path:'/home/index'})
                    }else{
                        this.showNotice = true;
                        this.options = res.message;
                    }
                }else{
                    let _params = {
                        type:'login',
                        mobile:this.userFspInfo.mobile,
                        oldPasword:this.$refs.pass.value,
                        newPasword:this.$refs.newPass_verify.value
                    }
                    let res=await fspService.changePassWordLogin(_params);
                    if(res.code==0){
                        this.showNotice = true;
                        this.options = '修改成功';
                        this.$router.push({path:'/home/index'})
                    }else{
                        this.showNotice = true;
                        this.options = res.message;
                    }
                }


            },
            comfirm(){
                    this.changePassWord();
            }
        },
        computed:{
            ...mapState([
                'userFspInfo',
            ])
        },
        watch:{
        },
        created(){
            console.log( this.userFspInfo.mobile);
            if(this.$route.query.trade){
                this.title='修改交易密码';
                this.spanTitle='原交易密码';
            }
        }

    }

</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";
</style>