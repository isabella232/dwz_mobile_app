/**
 * @author 张慧华 <350863780@qq.com>
 */
(function ($) {
	$.setRegional('actionSheet', {
		cancelTxt: '取消'
	});

	$.actionSheet = {
		config: {
			box$: '#action-sheet'
		},

		/**
		 *
		 * @param {*} title, buttons, cancelTxt
		 * buttons: ['button1', 'button2'] or [{txt:'button1', style:'color:red'}, 'button2']
		 * @param {*} callback
		 */
		open({ title, buttons = [], cancelTxt = $.regional.actionSheet.cancelTxt }, callback) {
			let html = `<div id="action-sheet" onclick="return $.actionSheet.close()">
				<div class="action-sheet-pane hide-down">
					<div class="action-sheet-ul">
						${title ? '<a class="action-sheet-title">' + title + '</a>' : ''}
						${buttons
							.map((item) => {
								let btn = { txt: item.txt || item, style: item.style || '' };
								return `<a class="action-sheet-item" style="${btn.style}">${btn.txt}</a>`;
							})
							.join('')}
					</div>

					<a class="action-sheet-cancel" onclick="return $.actionSheet.close()">${cancelTxt}</a>
				</div>
			</div>`;

			$(this.config.box$).remove();
			let $box = $(html).appendTo($('body').get(0));
			setTimeout(() => {
				$box.find('.action-sheet-pane').removeClass('hide-down');
			}, 50);

			let $btns = $box.find('a.action-sheet-item');
			$.fn.hoverClass && $btns.hoverClass();

			for (let i = 0; i < buttons.length; i++) {
				$btns.eq(i).click(i, (event) => {
					let buttonIndex = event.data + 1;
					callback && callback({ buttonIndex });
					event.preventDefault();
					event.stopPropagation();

					setTimeout(() => {
						$.actionSheet.close();
					}, 300);
				});
			}
		},
		close() {
			let $box = $(this.config.box$);
			$box.find('.action-sheet-pane').addClass('hide-down');
			setTimeout(() => {
				$box.remove();
			}, 300);

			return false;
		}
	};
})(dwz);
