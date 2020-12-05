/**
 * @author 张慧华 <350863780@qq.com>
 */
biz.my = {
	render(tpl, params) {
		let tplWrap = $.templateWrap(tpl);
		let data = {
			UserInfo: UserInfo
		};
		let html = template.render(tplWrap.tpl, data);
		this.html(html).initUI();

		let $form = this.find('form.dwz-list-form');
		let $listBox = $('#my-announce-box');

		$form.requestList = (loadMore) => {
			let data = $form.serializeArray();

			// 运输单
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.transport),
				dataType: 'json',
				data: data,
				cache: false,
				global: false,
				success: (json) => {
					if ($.isAjaxStatusOk(json)) {
						let _html = template.render(tplWrap['tpl-transport'], json);
						this.find('#transport-card-box').html(_html);
					}
				},
				error: biz.ajaxError
			});

			// 通知
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.announce),
				dataType: 'json',
				data: data,
				cache: false,
				global: false,
				success: (json) => {
					if (!dwz.checkAjaxLogin(json)) {
						return;
					}

					if ($.isAjaxStatusOk(json)) {
						let _html = template.render(tplWrap['tpl-announce'], json);
						$listBox.html(_html);
					}
				},
				error: biz.ajaxError
			});
		};

		$.listForm($form);
	},
	settingRender(tpl, params) {
		let html = template.render(tpl, { UserInfo: UserInfo });
		this.html(html).initUI();

		$('#exitSystemButton').touchwipe({
			touch() {
				$.alert.confirm('确定要退出登录吗？', {
					okCall() {
						UserInfoUtil.clear();
						$.gotoLogin();
					},
					cancelCall() {}
				});
			}
		});

		this.find('.dwz-user-icon').touchwipe({
			touch() {
				dwz.plus.chooseImage({
					title: '修改用户头像',
					maximum: 1,
					callback(imgPath) {
						if (!imgPath) {
							return;
						}

						$.navView.open({
							url: 'tpl/my/settingsIcon.html',
							rel: 'mySettingsIcon',
							data: { imgPath: imgPath },
							callback: biz.my.settingIconRender
						});
					}
				});

				// $.navView.open({
				// 	url: 'tpl/test_croppic.html?dwz_callback=biz.my.settingIconRender',
				// 	rel: 'test'
				// });
			}
		});
	},
	settingIconRender(tpl, params) {
		let html = template.render(tpl, { UserInfo: UserInfo });
		this.html(html).initUI();

		// let $croppic = this.find('.croppic');
		// $.croppic.render($croppic);
		// $croppic.find('.btn-item').touchwipe({
		// 	touch(){
		// 		let imgCropData = $.croppic.imgCropData($croppic);
		// 		console.log(imgCropData);
		// 	}
		// });

		let headerH = biz.safeAreaTop + 44;
		FNImageClip = api.require('FNImageClip');
		FNImageClip.open(
			{
				rect: {
					x: 0,
					y: headerH,
					w: api.winWidth,
					h: api.winHeight - headerH
				},
				srcPath: params.imgPath,
				highDefinition: false,
				isHideGrid: true,
				style: {
					mask: 'rgba(0,0,0,0.6)',
					clip: {
						w: 300,
						h: 300,
						x: (api.winWidth - 300) / 2,
						y: (api.winHeight - 300) / 2,
						borderColor: '#0f0',
						borderWidth: 3,
						//appearance: 'circular',
						appearance: 'rectangle'
					}
				},
				mode: 'image', // image, clip, all
				fixedOn: api.frameName
			},
			function (ret, err) {
				if (ret) {
					console.log(JSON.stringify(ret));
				} else {
					alert(JSON.stringify(err));
				}
			}
		);

		this.find('header .back-btn').touchwipe({
			touch() {
				$.navView.close(true, true);
				FNImageClip.close();
			}
		});
		this.find('header .txt-button').touchwipe({
			touch() {
				FNImageClip.save(
					{
						destPath: 'fs://image/croppic_' + new Date().getTime() + '.jpg',
						copyToAlbum: false,
						quality: 1
					},
					function (ret, err) {
						if (ret) {
							console.log(JSON.stringify(ret));

							FNImageClip.close();
							$.navView.close(true, true);

							dwz.plus.getBase64Image({
								destinationType: 'url',
								imgPath: ret.destPath,
								maxWidth: 300,
								maxHeight: 300,
								callback(strBase64) {
									console.log(strBase64);
									if ($.isFunction(params.callbackFn)) {
										params.callbackFn(strBase64);
									} else {
										$.ajax({
											type: 'POST',
											dataType: 'json',
											global: true,
											url: biz.server.getUrl(biz.server.uploadUserIcon),
											data: {
												type: 4,
												imgUrl: strBase64
											},
											success: (json) => {
												if (json.info) $.alert.toast(json.info);

												let $myUserIcon = $('#my_user_icon_img');
												if ($myUserIcon.size() > 0) {
													$myUserIcon.attr('src', strBase64);
												}
												let $settomgUserIcon = $('#setting_user_icon_img');
												if ($settomgUserIcon.size() > 0) {
													$settomgUserIcon.attr('src', strBase64);
												}

												UserInfoUtil.update({
													headimgurl: strBase64
												});
											}
										});
									}
								}
							});
						} else {
							alert(JSON.stringify(err));
						}
					}
				);
			}
		});
	}
};
