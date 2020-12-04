function renderHome(tpl, params) {
	let tplWrap = $.templateWrap(tpl);
	let html = template.render(tpl, {
		UserInfo: UserInfo,
		widgetList: [
			'navTab',
			'navView',
			'dialog',
			'panel',
			'alert',
			'table',
			'form',
			'brush',
			'tabs',
			'slide',
			'slideTab',
			'charts'
		]
	});
	this.html(html).initUI();

	let $form = this.find('form.dwz-list-form');
	$form.requestList = (loadMore) => {
		let data = $form.serializeArray();

		// 轮播图
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.homeAd),
			dataType: 'json',
			data: data,
			cache: false,
			global: false,
			success: (json) => {
				if ($.isAjaxStatusOk(json)) {
					let _html = template.render(tplWrap['tpl-home-ad'], json);
					this.find('#home-ad-box').html(_html).initUI();
				}
			},
			error: biz.ajaxError
		});
	};

	$.listForm($form);
}

function renderAbout(tpl, params) {
	let html = template.render(tpl, {
		version: window.api ? 'v' + api.appVersion : '',
		env: biz.server.ENV
	});
	this.html(html).initUI();
}
