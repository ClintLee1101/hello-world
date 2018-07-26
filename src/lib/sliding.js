
// JavaScript Document
window.onload=function(){
	var oBox = document.getElementById("box");
	var oBtn = document.getElementById("btn");
	var oTxt = document.getElementById("txt");
	var oAdd = document.getElementById("add");
	var oCut = document.getElementById("cut");
	var red_bg = document.getElementById("red_bg");
	var percent = 0;
	var timer = null;

	//var isJg = $("#isJg").val();//是否为机构用户

	var base1 = 0; //点击加减号初始化值

	var rate = document.getElementById("rate");//昨日年化收益率

	var arr1 = [100,1000,10000,100000,1000000,2000000];
	var arr2 = [100,1000,10000,100000,100000];

	function continueAdd()
	{
		var oCon = Number($("#txt").val());

		if(base1 <= 765)
		{

			for(var i = 0; i < arr1.length; i++)
			{
				var oCon = Number($("#txt").val()); //120
				if(oCon < arr1[i])
				{

					if( oCon % arr2[i-1] != 0 )
					{
						oTxt.value = Math.ceil(oCon/arr2[i-1])*arr2[i-1];

					}
					else
					{
						oTxt.value = Number(oTxt.value)+arr2[i-1];
					}
					countMoney(oTxt.value,127);
					break;

				}


			}

		}
		else
		{

			oTxt.value = 2000000;
		}

		$("#income").val((parseInt((Math.pow(1+Number(rate.value),1/365)-1)*Number(oTxt.value)*100)/100).toFixed(2));
		$(".income").html((parseInt((Math.pow(1+Number(rate.value),1/365)-1)*Number(oTxt.value)*100)/100).toFixed(2));
		$("#txt").trigger("keyup");

	}

	oAdd.onmousedown = function(){
		clearInterval(timer);
		//timer = setInterval(function(){
		continueAdd();
		//},100)
	}
	oAdd.onmouseup = function(){
		clearInterval(timer);
	}

	function continueCut(){

		var oCon = Number($("#txt").val());

		if( base1 <= 765 )
		{

			for( var i = 0;i < arr1.length; i++ )
			{
				if( oCon > arr1[i-1] && oCon <= arr1[i])
				{
					if(oCon % arr2[i-1] != 0)
					{
						oTxt.value = Math.ceil(oCon/arr2[i-1])*arr2[i-1]-arr2[i-1];
					}
					else
					{
						oTxt.value = Number(oTxt.value)-arr2[i-1];
					}
				}
			}


		}
		else
		{
			base1 = 1;
			oTxt.value = 1;
		}
		// $("#income").val((rate.value*Number(oTxt.value)/365).toFixed(2));
		// $(".income").html((rate.value*Number(oTxt.value)/365).toFixed(2));

		$("#income").val((parseInt((Math.pow(1+Number(rate.value),1/365)-1)*Number(oTxt.value)*100)/100).toFixed(2));
		$(".income").html((parseInt((Math.pow(1+Number(rate.value),1/365)-1)*Number(oTxt.value)*100)/100).toFixed(2));
		$("#txt").trigger("keyup");

	}
	/** onmousedown和onclick冲突 **/
	oCut.onmousedown = function(){

		clearInterval(timer);
		//timer = setInterval(function(){
		continueCut();
		//},100)

	}
	oCut.onmouseup = function(){

		clearInterval(timer);

	}



	function countLength(allowGos,perWidth){
		var nums = 1;
		if( allowGos <= 1.6 )
		{
			oTxt.value = 100;
		}
		for( var i = 0; i < arr1.length; i++ )
		{
			if( allowGos > i*perWidth && allowGos <= (i+1)*perWidth )
			{
				nums = Math.round((allowGos-i*perWidth)/perWidth*(arr1[i+1]-arr1[i])+arr1[i])//计算金额/本格总金额 = 本格走过的长度/本格总长度
				if( nums % arr2[i] != 0 )
				{
					oTxt.value = Math.ceil(nums/arr2[i])*arr2[i];
				}
				else
				{
					oTxt.value = nums;
				}
			}
		}

		$("#income").val((parseInt((Math.pow(1+Number(rate.value),1/365)-1)*Number(oTxt.value)*100)/100).toFixed(2));
		$(".income").html((parseInt((Math.pow(1+Number(rate.value),1/365)-1)*Number(oTxt.value)*100)/100).toFixed(2));

	}


	var Nowpercent = 0;
	var ml = 0;
	/**  根据金额计算划过的长度 **/
	function countMoney(money,perWidth){
		if(money == 1)
		{
			oBtn.style.marginLeft = '0px';
			red_bg.style.width = '0px';
		}
		else
		{
			for( var i = 0; i < arr1.length; i++ )
			{
				if( money > arr1[i-1] && money <= arr1[i] )
				{
					ml = (money-arr1[i-1])/(arr1[i]-arr1[i-1])*perWidth+(i-1)*perWidth;
				}
			}
			//oBtn.style.marginLeft = ml+'px';
			//red_bg.style.width = ml+'px';
			oBtn.style.marginLeft = ml/7+'%';
			red_bg.style.width =  ml/7+'%';
		}


		/** 收益计算公式 **/
		$("#income").val((parseInt((Math.pow(1+Number(rate.value),1/365)-1)*Number(oTxt.value)*100)/100).toFixed(2));
		$(".income").html((parseInt((Math.pow(1+Number(rate.value),1/365)-1)*Number(oTxt.value)*100)/100).toFixed(2));

	}

	$("#txt").focus(function(){
		$(this).css('border','1px solid #ff9500');
	})

	$("#txt").bind("keyup",function(){

		// var reg_NO = /^[1-9]+[0-9]*$/;
		var reg_NO = /^[1-9]\d*(\.\d{1,2})?$/;
		var btxt = parseInt($("#txt").val());
		if( $(this).val() == '' )
		{
			$(".income").html("0.00");
			$(".error_tip").html("请输入1的整数倍");
			$(".error_tip").addClass("red_tip");
			return false;
		}
		if( !reg_NO.test($("#txt").val()) ){
			//$(".error_tip").html("请输入1的整数倍");
			if($("#txt").val()<1)
			{
				$(".error_tip").addClass("red_tip");
				$(".error_tip").html("购买金额需大于等于1元");
				return false;
			}
			else
			{
				//解决 1.000等于1
				// if($('#txt').val()!=parseInt($('#txt').val()))
				// {
				// 	$(".error_tip").addClass("red_tip");
				//  $(".error_tip").html("追加金额需为1分钱的倍数");
				//  return false;
				// }
				$(".error_tip").addClass("red_tip");
				$(".error_tip").html("追加金额需为1分钱的倍数");
				return false;
			}
			// if( btxt == 0 )
			// {
			// 	this.value = 1;
			// }
			// this.value = this.value.replace(/\D/g,'');
		}
		// else if(btxt == 0)
		// {
		// 	this.value = 1;
		// }
		else if( $("#txt").val() > 2000000 )
		{
			this.value = 2000000;

			$(".error_tip").html("单账户限购200万元");
			$(".error_tip").addClass("red_tip");
			//return false;
		}
		else
		{
			$(".error_tip").html("");
			$(".error_tip").removeClass("red_tip");
		}
		if( $(this).val() == '' )
		{
			$(".income").html("0.00");
			$(".error_tip").html("请输入1的整数倍");
			$(".error_tip").addClass("red_tip");
			return false;
		}
		countMoney($("#txt").val(),127);
	})

	$("#txt").blur(function(){

		$("#txt").trigger("keyup");

	})




	$("#shb_nowBuy").click(function(){
		$("#txt").trigger("keyup");
		if( $(".red_tip").length )
		{
			return false;
		}

	})



	countMoney($("#txt").val(),127);

	//oBtn.onmousedown = function(e){
	$("#btn").on("touchstart",function(e){
		var x = (e || window.event).originalEvent.targetTouches[0].pageX; //距离页面左侧的距离
		var lx = this.offsetLeft; //距离父级元素左侧的距离
		var goMax = oBox.offsetWidth - oBtn.offsetWidth; //可以滑动的距离
		document.touchend = new Function('this.ontouchmove=null');
		$("#btn").on("touchmove",function(e){
			//console.log(percent)
			var thisX = (e || window.event).originalEvent.targetTouches[0].pageX; //鼠标滑动时x坐标距离
			var toObjleft = Math.max(0,( thisX - x ) + lx); //鼠标滑动时距父元素左侧距离
			var allowGo = Math.min( toObjleft , goMax+1); //最大滑动距离（距父元素左侧的距离不大于最大可滑动的距离）
			//console.log(allowGo)
			//debugger
			//oBtn.style.marginLeft = allowGo + 'px';
			var goPercent = Math.max( allowGo / goMax*2.35 , 0);
			toObjleft1 = Math.min(765,toObjleft);
			//red_bg.style.width = toObjleft1 + 'px';
			base1 = toObjleft1;
			countLength(allowGo*2.32,127)
			//$("#txt").focus();
			$("#txt").trigger("keyup");

			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();//mousedown滑动的时候会选中滚动条，清除选中


		})
	});



}