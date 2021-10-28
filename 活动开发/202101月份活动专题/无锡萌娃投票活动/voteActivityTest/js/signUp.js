//$(function() {
var cityInfo = []; //城市列表
var cityCode; //当前城市编码
var avatarFormData;
var formDataDuo;
var isSignUp = 0; //用户是否报名，0表示未报名，1表示已报名
var personalInfo; //个人信息
var picHtml = ""; //展示图片信息
var isClick = true; //上传按钮是否能点击
var personalPicHtml = ""; //个人档案图片展示
//判断当前用户是否报名
getSignUPInfo(function(res) {
	if(res.successFlg == 0 && res.errorCode == "1035") { //已经报名
		isSignUp = 1;
	} else {
		isSignUp = 0;
	}
	/*
	 * 进入页面判断：如果是未报名的弹出用户协议弹窗，如果报名过的，不展示协议弹窗，展示个人档案和审核状态
	 */
	if(isSignUp == "1") {
		//		alert(isSignUp + "13");
		$(".agreeMentTipBG").css("display", "none");
		$(".touxiang").css("display", "none");
		$(".artPhoto").css("display", "none");
		//获取当前用户报名列表信息	
		getUserInfoShow(function(res) {
			if(res.errorCode == "1000") {
				personalInfo = res.data;
				if(personalInfo.status == "2") { //"2表示审核成功"
					$(".signUpBG").css("display", "none");
					$(".personalFiles").css("display", "block");
					//页面渲染
					$("#playerId").html(PrefixInteger(personalInfo.id, 6));
					$("#playerName").html(personalInfo.playerName);
					if(personalInfo.playerGender == "0") {
						$("#playerSex").html("男");
					} else if(personalInfo.playerGender == "1") {
						$("#playerSex").html("女");
					}
					$("#playerAge").html(personalInfo.playerAge + "岁");
					$("#playerHobbies").html(personalInfo.playerIntroduction);
					$("#playerArea").html(personalInfo.playerCity);
					$("#playerPhone").html(personalInfo.playerPhone);
					for(var i = 0; i < personalInfo.picList.length; i++) {
						personalPicHtml += "<li><img src=" + imgUrl + personalInfo.picList[i].picPath + "></li>";
					}
					$(".presonalFiles_picShow").append(personalPicHtml);
				} else {
					$("#saveBtn").css("background", "#999").html("信息审核中").css("pointer-events", "none");
					//展示页面信息
					if(personalInfo.playerName) {
						$("#name").val(personalInfo.playerName);
					}
					if(personalInfo.playerPhone) {
						$("#phone").val(personalInfo.playerPhone);
					}
					if(personalInfo.playerGender) {
						$("#selectSex").val(personalInfo.playerGender);
					}
					if(personalInfo.playerAge) {
						$("#selectAge").val(personalInfo.playerAge);
					}
					if(personalInfo.playerIntroduction) {
						$("#hobbies").val(personalInfo.playerIntroduction);
					}
					if(personalInfo.playerCity) {
						$("#home-city").val(personalInfo.playerCity);
					}
					$(".signUpForm").css("pointer-events", "none"); //表单禁止点击
					$("#selectAge").css("color", "#333");
					$("#selectSex").css("color", "#333");
				}
			}
		});
	} else {
		//		alert(isSignUp + "54");
		//	$(".agreeMentTipBG").css("display", "block");
		$(".touxiang").css("display", "none");
		$(".artPhoto").css("display", "none");
	}
});

//点击返回
$("#backBtn").click(function() {
	window.history.back();
});

//用户协议同意,弹窗消失
$("#agreeBtn").click(function() {
	$(".agreeMentTipBG").css("display", "none");
	$(".touxiang").css("display", "block");
	$(".artPhoto").css("display", "block");
});
//用户不同意，返回首页
$("#disagreeBtn").click(function() {
	window.history.back();
});
//性别选择
$("#selectSex").on("change", function() {
	changeTextArea(this);
});
//年龄选择
$("#selectAge").on("change", function() {
	changeTextArea(this);
});
//下拉选择框值改变
function changeTextArea(aa) {
	if($(aa).val() !== "") {
		$(aa).css("color", "#333");
	} else {
		$(aa).css("color", "#999");
	}
}
//地区选择
$("#home-city").cityPicker({
	title: "选择所在地区",
	showDistrict: false,
	onChange: function(picker, values, displayValues) {
		console.log(values, displayValues);
	}
});
//点击完成获取省市信息
$(document).on("click", ".close-picker", function() {
	var pickerToClose = $('.weui-picker-modal.weui-picker-modal-visible');
	if(pickerToClose.length > 0) {
		$.closePicker(pickerToClose);
		//获取城市编码
		getCityByProvince("32", function(res) {
			if(res && res.successFlg == "1" && res.errorCode == "1000") {
				cityInfo = res.data;
				for(var i = 0; i < cityInfo.length; i++) {
					if($("#home-city").attr("data-code") == cityInfo[i].cityCode) {
						cityCode = cityInfo[i].cityCode;
						console.log(cityCode);
					}
				}
			}
		});
	}
});

/*
 * 图片上传
 */
//单图上传
//点击图片调出input框，type为file，即文件上传框
$("#uploadTouxiang").click(function() {
	var isUpLoad = $("#uploadTouxiang").attr("data-isUpLoad");
	if(isUpLoad == "0") {
		$("#file0").click();
	} else if(isUpLoad == "1") {
		$("#deleteHead").css("display", "block").click(function() {
			$("#uploadTouxiang").attr("src", "img/signUpPage/camera@3x.png").attr("data-isUpLoad", "0");
			$("#deleteHead").css("display", "none");
		});
	}
});

//选择文件后将上传的图片渲染到页面，将原来的图片清掉
$("#file0").change(function() {
	avatarFormData = new FormData($('#single_pic')[0]);
	console.log($('#single_pic'));
	console.log(avatarFormData);
	console.log($("#file0"));
	var objUrl = getObjectURL(this.files[0]);
	console.log("objUrl = " + objUrl);
	if(objUrl) {
		$("#uploadTouxiang").attr("src", objUrl).attr("data-isUpLoad", "1");
	}
});

//建立一个可存取到该file的url		
function getObjectURL(file) {
	var url = null;
	if(window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if(window.URL != undefined) {
		// mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if(window.webkitURL != undefined) {
		// webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

/*
 * 多图上传
 */
// 允许上传的图片类型
var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
// 1024KB，也就是 1MB
var maxSize = 1024 * 1024 * 100;
var picsSize = 0; //上传图片总大小
// 图片最大宽度
var maxWidth = 300;
// 最大上传图片数量
var maxCount = 5;
var num = 0; //当前上传的数量
var totalFiles = []; //总文件
$('#uploadArtPhoto').on('change', function(event) {
	var files = event.target.files;
	// 如果没有选中文件，直接返回
	if(files.length === 0) {
		return;
	}
	for(var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
		picsSize += file.size;
		var reader = new FileReader();
		if(len > 4) {
			$(".weui_uploader_input_wrp").css("display", "none");
		}
		// 如果类型不在允许的类型范围内
		if(allowTypes.indexOf(file.type) === -1) {
			layer.open({
				content: '该类型不允许上传',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			$(".weui_uploader_input_wrp").css("display", "block");
			return
		} else if(picsSize > maxSize) {
			layer.open({
				content: '上传图片总大小超过100M',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			$(".weui_uploader_input_wrp").css("display", "block");
			return
		} else if(len > maxCount || (len + num) > 5) {
			console.log(len);
			layer.open({
				content: '最多只能上传' + maxCount + '张图片',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			$(".weui_uploader_input_wrp").css("display", "block");
			return;
		} else {
			totalFiles.push(file);
			reader.onload = function(e) {
				var img = new Image();
				img.onload = function() {
					// 不要超出最大宽度
					var w = Math.min(maxWidth, img.width);
					// 高度按比例计算
					var h = img.height * (w / img.width);
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					// 设置 canvas 的宽度和高度
					canvas.width = w;
					canvas.height = h;
					ctx.drawImage(img, 0, 0, w, h);
					var base64 = canvas.toDataURL('image/png');
					// 插入到预览区
					var $preview = $('<li class="weui_uploader_file weui_uploader_status" style="background-image:url(' + base64 + ');background-size:100% 100%;"><div class="weui_uploader_status_content">0%</div><img src="img/signUpPage/delete@3x.png" class="deleteBtn" id="deleteHead"/></li>');
					$('.weui_uploader_files').append($preview);
					num = $('.weui_uploader_file').length;
					if(num > 4) {
						$(".weui_uploader_input_wrp").css("display", "none");
					}

					// 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传
					var progress = 0;

					function uploading() {
						$preview.find('.weui_uploader_status_content').text(++progress + '%');
						if(progress < 100) {
							setTimeout(uploading, 30);
						} else {
							// 如果是失败，塞一个失败图标
							//$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');
							$preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();
						}
					}
					setTimeout(uploading, 30);
				};
				img.src = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}
	var formDataDuo = new FormData($('#duo_pic')[0]);
	console.log($('#duo_pic')[0]);
});

/*
 *多图上传删除
 *点击删除，删除掉当前li;
 *如果少于五张图片，上传按钮出现;
 */
$(document).on("click", ".deleteBtn", function() {
	for(var i = 0; i < totalFiles.length; i++) {
		if(i == $(this).parent("li").index() - 1) {
			totalFiles.splice(i, 1);
		}
	}
	console.log($(this).parent("li").index())
	$(this).parent("li").remove();
	num--;
	if($(".weui_uploader_file").length < 5) {
		$(".weui_uploader_input_wrp").css("display", "block");
	}
});

/*
 * 点击保存按钮
 * 表单验证》确认弹窗：确认（存localstorage、展示报名信息、按钮不可点、上传数据）；返回：继续修改
 */
$("#saveBtn").click(function() {
	var name = $("#name").val();
	var phone = $("#phone").val();
	var sex = $("#selectSex").val();
	var selectAge = $("#selectAge").val();
	var hobbies = $("#hobbies").val();
	var homeCity = $("#home-city").val();
	var headPic = $("#uploadTouxiang").attr("src");
	var artPicLength = $(".weui_uploader_file").length;
	var reg = /^1(3|4|5|6|7|8|9)\d{9}$/; //手机号验证
	if(name == "" || phone == "" || sex == "" || selectAge == "" || hobbies == "" || homeCity == "") {
		layer.open({
			content: '您有信息未填写',
			skin: 'msg',
			time: 2 //2秒后自动关闭
		});
	} else if(headPic.indexOf("camera") > -1) {
		layer.open({
			content: '请上传一张正面照',
			skin: 'msg',
			time: 2 //2秒后自动关闭
		});
	} else if(artPicLength <= 0) {
		layer.open({
			content: '请至少上传一张形象照',
			skin: 'msg',
			time: 2 //2秒后自动关闭
		});
	} else if(!reg.test(phone)) {
		layer.open({
			content: '手机号格式不正确',
			skin: 'msg',
			time: 2 //2秒后自动关闭
		});
	} else {
		//弹出确认弹窗
		$(".confirmTanBG").css("display", "block");
	}
});

//立即保存，信息提交后台;展示报名信息、按钮显示审核中；
$("#confirmSave").click(function() {
	if(isClick) {
		isClick = false;
		//提交报名信息
		submitFormInfo(function(res) {
			if(res.errorCode == "1000") {
				$(".confirmTanBG").css("display", "none");
				$(".signUpForm").css("pointer-events", "none"); //表单禁止点击
				$("#saveBtn").css("background", "#999").html("信息审核中").css("pointer-events", "none");
				$(".touxiang").css("display", "none");
				$(".artPhoto").css("display", "none");
			} else if(res.errorCode == "1040") {
				layer.open({
					content: '上传失败,您填写的信息存在敏感词汇！',
					skin: 'msg',
					time: 2, //2秒后自动关闭
				});
			}
			isClick = true; //恢复点击
		});
	}
});

//返回修改，弹窗隐藏
$("#backEdit").click(function() {
	$(".confirmTanBG").css("display", "none");
});

//});