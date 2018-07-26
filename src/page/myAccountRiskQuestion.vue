<!--/*************************************************************************/-->
<!--/***********************      设置 - 风险评估      ************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack()"></a>
            <div class="title">风险评测</div>
            <i></i>
        </header>

        <!--个人-->
        <div v-if="!isOrg">
            <div class="risk_tips spaceHT">
                <h5>风险提示：证券投资需承担各类风险。您在产品认购过程中应当注意核对自己的风险识别和风险承受能力选择与自己风险识别能力和风险承受能力相匹配的私募基金。</h5>
                <h5>尊敬的投资人：</h5>
                <h5>为了便于了解自身的风险承受能力，选择合适的投资产品和服务,请您填写以下风险承受能力评估问卷。下列问题可协助评估您对投资产品和服务的风险承受能力，请您根据自身情况认真选择。评估结果仅供参考不构成投资建议。为了及时了解您的风险承受能力，我们建议您持续做好动态评估。我们承诺对您的所有个人资料保密。</h5>
            </div>

            <div class="risk_list" v-for="el in questionList" v-bind:id="el.anchor">
                <div class="hd">{{el.id+1}}、{{el.question}}</div>
                <dl v-for="(elem,index) in el.option" @click="addScore(el,index)">
                    <dt><label class="check_blue" :class="el.index==elem.index?'icon-on':''"></label></dt>
                    <dd><h5>{{elem.value}}</h5></dd>
                </dl>
            </div>

            <div class="risk_note">
                <h5>声明：本人已如实填写《投资者风险问卷调查》<br>并了解自己的风险承受类型和适合购买的产品类型。</h5>
            </div>

            <!--<div class="btn">-->
                <!--<a @click="changeUserRisk()">提交</a>-->
            <!--</div>-->
            <div class="btn_submit">
                <input type="button" @click="changeUserRisk()" value="提交">
            </div>
        </div>

        <!--机构-->
        <div v-if="isOrg">
            <div class="risk_tips spaceHT">
                <h5>风险提示：证券投资需承担各类风险。您在产品认购过程中应当注意核对自己的风险识别和风险承受能力选择与自己风险识别能力和风险承受能力相匹配的私募基金。</h5>
                <h5>尊敬的投资人：</h5>
                <h5>为了便于了解自身的风险承受能力，选择合适的投资产品和服务,请您填写以下风险承受能力评估问卷。下列问题可协助评估您对投资产品和服务的风险承受能力，请您根据自身情况认真选择。评估结果仅供参考不构成投资建议。为了及时了解您的风险承受能力，我们建议您持续做好动态评估。我们承诺对您的所有个人资料保密。</h5>
            </div>

            <div class="risk_list" v-for="el in questionListOrg" v-bind:id="el.anchorOrg">
                <div class="hd">{{el.id+1}}、{{el.question}}</div>
                <dl v-for="(elem,index) in el.option" @click="addScoreOrg(el,index)">
                    <dt><label class="check_blue" :class="el.index==elem.index?'icon-on':''"></label></dt>
                    <dd><h5>{{elem.value}}</h5></dd>
                </dl>
            </div>

            <div class="risk_note">
                <h5>声明：本人已如实填写《投资者风险问卷调查》<br>并了解自己的风险承受类型和适合购买的产品类型。</h5>
            </div>

            <!--<div class="btn_submit">-->
                <!--<a @click="changeUserRisk('org')">提交</a>-->
            <!--</div>-->
            <div class="btn_submit">
                <input type="button" @click="changeUserRisk('org')" value="提交">
            </div>
        </div>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>

    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    import { fspService } from '../service'
    import alertTip from '../components/alertTip'
    export default{
        data(){
            return{
                arr:[],
                arrOrg:[],//机构得分数组
                isOrg:true,
                active:'',
                questionList:[
                    {
                        "id": 0,
                        "anchor":'anchor0',
                        "question": "请问您的年龄处于:",
                        "index":-1,
                        "option": [
                            {value:"A.30岁以下",index:0},
                            {value:"B.31-40岁",index:1},
                            {value:"C.41-50岁",index:2},
                            {value:"D.51-60岁",index:3},
                            {value:"E.60岁以上",index:4},
                        ],
                        "score": [
                            15,
                            13,
                            11,
                            9,
                            7
                        ]
                    },
                    {
                        "id": 1,
                        "anchor":'anchor1',
                        "index":-1,
                        "question": "您现在的投资目的属于以下哪一种:",
                        "option": [
                            {value:"A.注重短期的高投机回报，能承受短期较大的资产价值波动",index:0},
                            {value:"B.关心长期的高回报，能够接受短期的资产价值波动",index:1},
                            {value:"c.倾向于长期的成长，较少关心短期的回报及价格波动",index:2},
                            {value:"D.希望在承担较小风险的情况下，获得波动适度的投资回报",index:3},
                        ],
                        "score": [
                            15,
                            12,
                            10,
                            8
                        ]
                    },
                    {
                        "id": 2,
                        "anchor":'anchor2',
                        "index":-1,
                        "question": "在您进行证券投资时，您更关注可能获得的收益还是可能发生的损失:",
                        "option": [
                          {value:"A.主要关注可能获得的收益 ",index:0},
                          {value:"B.关注可能的获得的收益稍多 ",index:1},
                          {value:"C.关注可能发生的损失稍多",index:2},
                          {value:"D.主要关注可能发生的损失",index:3},
                        ],
                        "score": [
                            10,
                            8,
                            6,
                            4
                        ]
                    },
                    {
                        "id": 3,
                        "anchor":'anchor3',
                        "index":-1,
                        "question": "如投资发生亏损，您的心态是:",
                        "option": [
                          {value:"A.不在意,喜欢总结经验，并继续投资",index:0},
                          {value:"B.能够接受，能理解投资有风险",index:1},
                          {value:"C.会影响到投资心态",index:2},
                          {value:"D.很难接受，不再投资",index:3},
                        ],
                        "score": [
                            15,
                            12,
                            10,
                            8
                        ]
                    },
                    {
                        "id": 4,
                        "anchor":'anchor4',
                        "index":-1,
                        "question": "您的投资经验可以被概括为：",
                        "option": [
                          {value:"A.有限：除银行活期账户和定期存款外，我基本没有其他投资经验",index:0},
                          {value:"B.一般：除银行活期账户和定期存款外，我购买过基金、保险等理财产品，但还需要进一步的指导",index:1},
                          {value:"C.丰富：我是一位有经验的投资者，参与过股票、基金等产品的交易，并倾向于自己做出投资决策",index:2},
                          {value:"D.非常丰富：我是一位非常有经验的投资者，能够完全自主做出投资决策",index:3},
                        ],
                        "score": [
                            8,
                            10,
                            12,
                            15
                        ]
                    },
                    {
                        "id": 5,
                        "anchor":'anchor5',
                        "index":-1,
                        "question": "以下哪项最符合您的投资目标及可接受的投资价值波动程度:",
                        "option": [
                          {value:"A.不希望投资本金承担风险，愿意接受的回报收益大约与定期存款一致",index:0},
                          {value:"B.希望保守投资，但愿意在低于2年的期间内接受少许负面波动，以使回报收益高于定期存款",index:1},
                          {value:"C.希望以平衡的投资方式，寻求资金的较高收益和成长性。愿意接受2-3年期间负面波动，以使回报收益显著高于定期存款",index:2},
                          {value:"D.希望投资成长并赚取最高回报潜力。能接受为期3年甚至更长期间的负面波动，包括损失本金",index:3},
                        ],
                        "score": [
                            8,
                            10,
                            12,
                            15
                        ]
                    },
                    {
                        "id": 6,
                        "anchor":'anchor6',
                        "index":-1,
                        "question": "您家庭预计通过华创证券进行的投资金额，占您总资产（不含自住、自用房产及汽车等固定资产）的比例是多少",
                        "option": [
                          {value:"A.70 %以上",index:0},
                          {value:"B.50 %—70 %",index:1},
                          {value:"C.30 %—50 % ",index:2},
                          {value:"D.10 %—30 %",index:3},
                          {value:"E.10 %以下",index:4},
                        ],
                        "score": [
                            15,
                            13,
                            11,
                            9,
                            7
                        ]
                    }
                ],
                questionListOrg:[
                    {
                        "id": 0,
                        "anchorOrg":'anchorOrg0',
                        "index":-1,
                        "question": "贵单位的性质:",
                        "option": [
                          {value:"A.国有企事业单位",index:0},
                          {value:"B.非上市民营企业",index:1},
                          {value:"C.外资企业",index:2},
                          {value:"D.上市公司",index:3},
                        ],
                        "score": [
                            6,
                            2,
                            4,
                            7
                        ]
                    },
                    {
                        "id": 1,
                        "anchorOrg":'anchorOrg1',
                        "index":-1,
                        "question": "贵单位的净资产规模为:",
                        "option": [
                          {value:"A.500万元以下",index:0},
                          {value:"B.500万元-2000万元",index:1},
                          {value:"C.2000万元-1亿元",index:2},
                          {value:"D.超过1亿元",index:3},
                        ],
                        "score": [
                            1,
                            2,
                            3,
                            5
                        ]
                    },
                    {
                        "id": 2,
                        "anchorOrg":'anchorOrg2',
                        "index":-1,
                        "question": "贵单位年营业收入为:",
                        "option": [
                          {value:"A.500万元以下",index:0},
                          {value:"B.500万元-2000万元",index:1},
                          {value:"C.2000万元-1亿元",index:2},
                          {value:"D.超过1亿元",index:3},
                        ],
                        "score": [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        "id": 3,
                        "anchorOrg":'anchorOrg3',
                        "index":-1,
                        "question": "贵单位证券账户资产为：",
                        "option": [
                          {value:"A.300万元以内",index:0},
                          {value:"B.300万元-1000万元",index:1},
                          {value:"C.1000万元-3000万元",index:2},
                          {value:"D.超过3000万元",index:3},
                        ],
                        "score": [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        "id": 4,
                        "anchorOrg":'anchorOrg4',
                        "index":-1,
                        "question": "贵单位是否有尚未清偿的数额较大的债务？如有，主要是",
                        "option": [
                          {value:"A.银行贷款 ",index:0},
                          {value:"B.公司债券或企业债券",index:1},
                          {value:"C.通过担保公司等中介机构募集的借款",index:2},
                          {value:"D.民间借贷",index:3},
                          {value:"E.没有数额较大的债务",index:4},
                        ],
                        "score": [
                            3,
                            2,
                            1,
                            "0",
                            4
                        ]
                    },
                    {
                        "id": 5,
                        "anchorOrg":'anchorOrg5',
                        "index":-1,
                        "question": "对于金融产品投资工作，贵单位打算配置怎样的人员力量：",
                        "option": [
                          {value:"A.一名兼职人员（包括负责人自行决策）",index:0},
                          {value:"B.一名专职人员",index:1},
                          {value:"C.多名兼职或专职人员，相互之间分工不明确",index:2},
                          {value:"D.多名兼职或专职人员，相互之间有明确分工",index:3},
                        ],
                        "score": [
                            1,
                            3,
                            4,
                            5
                        ]
                    },
                    {
                        "id": 6,
                        "anchorOrg":'anchorOrg6',
                        "index":-1,
                        "question": "贵单位所配置的负责金融产品投资工作的人员是否符合以下情况：",
                        "option": [
                          {value:"A.现在或此前曾从事金融、经济或财会等与金融产品投资相关的工作超过两年",index:0},
                          {value:"B.已取得金融、经济或财会等与金融产品投资相关专业学士以上学位",index:1},
                          {value:"C.取得证券从业资格、期货从业资格、注册会计师证书（CPA）或注册金融分析师证书（CFA）中的一项及以上",index:2},
                          {value:"D.本单位所配置的人员不符合以上任何一项描述",index:3},
                        ],
                        "score": [
                            6,
                            6,
                            6,
                            "0"
                        ]
                    },
                    {
                        "id": 7,
                        "anchorOrg":'anchorOrg7',
                        "index":-1,
                        "question": "贵单位是否建立了金融产品投资相关的管理制度：",
                        "option": [
                          {value:"A.没有。因为要保证操作的灵活性",index:0},
                          {value:"B.已建立。包括了分工和授权的要求，但未包括投资风险控制的规则",index:1},
                          {value:"C.已建立。包括了分工与授权、风险控制等一系列与金融产品投资有关的规则",index:2},
                        ],
                        "score": [
                            1,
                            3,
                            7
                        ]
                    },
                    {
                        "id": 8,
                        "anchorOrg":'anchorOrg8',
                        "index":-1,
                        "question": "贵单位的投资经验可以被概括为：",
                        "option": [
                          {value:"A.有限：除银行活期账户和定期存款外，基本没有其他投资经验",index:0},
                          {value:"B.一般：除银行活期账户和定期存款外，购买过基金、保险等理财产品，但还需要进一步的指导",index:1},
                          {value:"C.丰富：本单位具有相当投资经验，参与过股票、基金等产品的交易，并倾向于自己做出投资决策",index:2},
                          {value:"D.非常丰富：本单位对于投资非常有经验，参与过权证、期货或创业板等高风险产品的交易",index:3},
                        ],
                        "score": [
                            1,
                            3,
                            5,
                            7
                        ]
                    },
                    {
                        "id": 9,
                        "anchorOrg":'anchorOrg9',
                        "index":-1,
                        "question": "有一位投资者一个月内做了15笔交易（同一品种买卖各一次算一笔），贵单位认为这样的交易频率：",
                        "option": [
                          {value:"A.太高了",index:0},
                          {value:"B.偏高",index:1},
                          {value:"C.正常",index:2},
                          {value:"D.偏低",index:3},
                        ],
                        "score": [
                            1,
                            2,
                            3,
                            5
                        ]
                    },
                    {
                        "id": 10,
                        "anchorOrg":'anchorOrg10',
                        "index":-1,
                        "question": "贵单位的金融产品投资经验是多少年：",
                        "option": [
                          {value:"A.不足1年",index:0},
                          {value:"B.1-3年",index:1},
                          {value:"C.3-5年",index:2},
                          {value:"D.5年以上",index:3},
                          {value:"E.从未投资过金融产品",index:4},
                        ],
                        "score": [
                            1,
                            2,
                            4,
                            6,
                            "0"
                        ]
                    },
                    {
                        "id": 11,
                        "anchorOrg":'anchorOrg11',
                        "index":-1,
                        "question": "如果贵单位曾经从事过金融产品投资，在交易较为活跃的月份，平均月交易额大概是多少：",
                        "option": [
                          {value:"A.100万元以内",index:0},
                          {value:"B.100万元-300万元",index:1},
                          {value:"C.300万元-1000万元",index:2},
                          {value:"D.1000万元以上",index:3},
                          {value:"E.从未投资过金融产品",index:4},
                        ],
                        "score": [
                            1,
                            2,
                            3,
                            4,
                            "0"
                        ]
                    },
                    {
                        "id": 12,
                        "anchorOrg":'anchorOrg12',
                        "index":-1,
                        "question": "贵单位用于证券投资的资金不会用作其它用途的时间段为：",
                        "option": [
                          {value:"A.不在意,喜欢总结经验，并继续投资",index:0},
                          {value:"B.能够接受，能理解投资有风险",index:1},
                          {value:"C.会影响到投资心态",index:2},
                          {value:"D.很难接受，不再投资",index:3},
                        ],
                        "score": [
                            1,
                            3,
                            5
                        ]
                    },
                    {
                        "id": 13,
                        "anchorOrg":'anchorOrg13',
                        "index":-1,
                        "question": "贵单位进行投资时的首要目标是：",
                        "option": [
                          {value:"A.资产保值，我不愿意承担任何投资风险",index:0},
                          {value:"B.尽可能保证本金安全，不在乎收益率比较低",index:1},
                          {value:"C.产生较多的收益，可以承担一定的投资风险",index:2},
                          {value:"D.实现资产大幅增长，愿意承担很大的投资风险",index:3},
                        ],
                        "score": [
                            "0",
                            2,
                            4,
                            6
                        ]
                    },
                    {
                        "id": 14,
                        "anchorOrg":'anchorOrg14',
                        "index":-1,
                        "question": "贵单位打算重点投资于哪一类投资品种:",
                        "option": [
                          {value:"A.债券、货币市场基金、债券基金等固定收益类投资品种",index:0},
                          {value:"B.股票、混合型基金、偏股型基金、股票型基金等权益类投资品种",index:1},
                          {value:"C.期货、融资融券等杠杆性产品",index:2},
                        ],
                        "score": [
                            2,
                            4,
                            6
                        ]
                    },
                    {
                        "id": 15,
                        "anchorOrg":'anchorOrg15',
                        "index":-1,
                        "question": "贵单位认为自己能承受的最大投资损失是多少:",
                        "option": [
                          {value:"A.10%以内",index:0},
                          {value:"B.10%-30%",index:1},
                          {value:"C.30%-50%",index:2},
                          {value:"D.超过50",index:3},
                        ],
                        "score": [
                            "0",
                            2,
                            4,
                            6
                        ]
                    },
                    {
                        "id": 16,
                        "anchorOrg":'anchorOrg16',
                        "index":-1,
                        "question": "假设有两种不同的投资：投资A预期获得5%的收益，有可能承担非常小的损失；投资B预期获得20%的收益，但有可能面临25%甚至更高的亏损。您将您的投资资产分配为:",
                        "option": [
                          {value:"A.全部投资于A",index:0},
                          {value:"B.大部分投资于A",index:1},
                          {value:"C.两种投资各一半",index:2},
                          {value:"D.大部分投资于",index:3},
                          {value:"E.全部投资于B",index:4},
                        ],
                        "score": [
                            "0",
                            1,
                            3,
                            5,
                            7
                        ]
                    },
                    {
                        "id": 17,
                        "anchorOrg":'anchorOrg17',
                        "index":-1,
                        "question": "贵单位参与金融产品投资的主要目的是什么:",
                        "option": [
                          {value:"A.闲置资金保值增值",index:0},
                          {value:"B.获取主营业务以外的投资收益",index:1},
                          {value:"C.现货套期保值、对冲主营业务风险",index:2},
                          {value:"D.减持已持有的股票",index:3},
                        ],
                        "score": [
                            4,
                            7,
                            5,
                            2
                        ]
                    }
                ],
                sumScore:0,
                sumScoreOrg:0,//机构得分
                //显示弹框设置
                showNotice:false,
                options: '',
                active:'',
                label_check:'label_check',
                on:'on',
            }
        },
        components: {
            alertTip,
        },
        computed:{
            ...mapState(['userFspInfo'])
        },
        methods:{
            ...mapActions([
                'getUserFSPInfo',
            ]),
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            goBack(){
//                if(this.userFspInfo.risk==0){
//                    this.$router.push({path:'/setting'})
//                }else{
//                    this.$router.push({path:'/myAccountRisk'})
//                }
                this.$router.goBack();
            },
            addScoreOrg(el,index){
                let outer = el.id;
                this.arrOrg[outer]=this.questionListOrg[outer].score[index];
                el.index = index;
//                console.log(this.arrOrg);
            },

            addScore(el,index){
                let outer = el.id;
                this.arr[outer]=this.questionList[outer].score[index];
                el.index = index;
//                console.log(this.arr);
            },
            changeUserRisk(org){

                var score=0,level;
                if(org){
                    for(var i= 0,l=this.questionListOrg.length;i<l;i++){
                        if(this.arrOrg[i]==''||this.arrOrg[i]==undefined){
                            $("#anchorOrg"+i).find('b').html('(未答题)');
                            this.options='请回答所有问题';
                            this.showNotice=true;
                        }
                    }
                    for(var i= 0,l=this.questionListOrg.length;i<l;i++){
                        if(this.arrOrg[i]==''||this.arrOrg[i]==undefined){
//                            location.href = "#anchorOrg"+i;
                            return;
                        }
                    }
                    this.arrOrg.forEach(item=>{
                        score=score+item;
//                        console.log(item);
                    })
                    console.log(score);
                    if(score>80){
                        level=1;
                    }else if(score>60){
                        level=2;
                    }else if(score>40){
                        level=3;
                    }else if(score>20){
                        level=4;
                    }else if(score>=10){
                        level=5;
                    }else if(score>0){
                        level=0;
                    }
                    this.getRiskLevel(level);
                }else{
                    for(var i= 0,l=this.questionList.length;i<l;i++){
                        if(this.arr[i]==''||this.arr[i]==undefined){
                            $("#anchor"+i).find('b').html('未答题');
                            this.options='请回答所有问题';
                            this.showNotice=true;
                        }
                    }
                    for(var i= 0,l=this.questionList.length;i<l;i++){
                        if(this.arr[i]==''||this.arr[i]==undefined){
//                            location.href = "#anchor"+i;
                            return;
                        }
                    }
                    this.arr.forEach(item=>{
                        score=score+item;
//                        console.log(item);
                    })
                    console.log(score);
                    if(score>90){
                        level=1;
                    }else if(score>80){
                        level=2;
                    }else if(score>70){
                        level=3;
                    }else if(score>60){
                        level=4;
                    }else if(score>=50){
                        level=5;
                    }else if(score>0){
                        level=0;
                    }
                    this.getRiskLevel(level);
                }
            },
            async getRiskLevel(level){
                let _parmas = {
                    riskLevel:level
                }
                let res=await fspService.getRiskLevel(_parmas);
                if(res.code==0){
                    await this.getUserFSPInfo();
//                    this.$router.goBack();
                    this.$router.push({path:'/myAccountRisk'})
                }else{
                    this.options=res.message;
                    this.showNotice=true;
                }

            }
        },
        watch:{

        },
        created(){
            console.log(this.userFspInfo.risk) ;
            if(this.userFspInfo.type==0){
                this.type=0;
                this.isOrg=false;
            }else{
                this.type=1;
                this.isOrg=true;
            }

        },
    }

</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_button";

    .risk_tips, .risk_list .hd, .risk_note{
        padding: 0 $spaceLR;
    }

    .risk_tips, .risk_list{
        background: $white;
        margin-bottom: $spaceV;
    }

    .risk_tips{
        padding-bottom: 1rem;
        padding-top: 1rem;

        h5{
            &:nth-child(1){
                color: $red;
                margin-bottom: 1.125rem;
            }
            &:nth-child(2){
                @include _linkTop_half;
                padding: 0.75rem 0;
            }
        }
    }

    .risk_list{
        .hd{
            @include _linkBottom_half;
            padding-bottom: 0.875rem;
            padding-top: 0.938rem;
        }
        dl{
            @include _linkTop_half;
            display:-moz-flex;
            display:-webkit-flex;
            display:flex;
            font-size: 0.875rem;
            line-height: 1.5em;
            margin: 0 $spaceLR;

            &:nth-child(2){
                &:after{
                    height: 0;
                }
            }

            dt{
                display:-moz-flex;
                display:-webkit-flex;
                display:flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                width: 2.5rem;
                text-align: center;
            }
            dd{
                -moz-flex-grow:1;
                -webkit-flex-grow:1;
                flex-grow:1;

                h5{
                    margin: 0.875rem 0;
                }
            }
        }
    }

    .btn_submit{
        margin-top: 0.5rem;
    }
</style>
