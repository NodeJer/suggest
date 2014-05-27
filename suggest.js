(function(root, $, factory){

	if(typeof define === 'function' && define.cmd){
		define(function(require, exports, module){
			module.exports = factory($);
		});
	}
	else{
		root.Suggest = factory($);
	}
})(window, window.Zepto||window.jQuery, function($){
	var ie9 = $.browser.msie && $.browser.version == 9;

	function Suggest(input, suggest, list, activeClass, nextfocus){
		this.$input = $(input);
		this.$suggest = $(suggest);
		this.$list = this.$suggest.find(list);
		this.$items = this.$list.children();
		this.$nextfocus = $(nextfocus);
		this.$prevItems = this.$items;

		this.sActiveClass = activeClass;
		this.nIndex = 0;
		this.nItemsLen = this.$prevItems.length;

		this.init();
	}

	Suggest.prototype = {
		constructor: Suggest,
		init: function(){
			this.storageItemsEmail();
			this.addEvents();
		},
		addEvents: function(){

			this.$input.bind('propertychange input', $.proxy(this.input, this)).
			blur($.proxy(this.blur, this)).
			keydown($.proxy(this.keydown, this));

			this.$prevItems.click($.proxy(this.itemsClick, this));
		},
		itemsClick: function(ev){
			this.selection(ev.target.innerHTML);
		},
		input: function(){

			var email = this.showEmail();

			if(this.$input.val() == '')return;

			var re = new RegExp('@'+email.substring(email.indexOf('@')+1)+'');
			this.$suggest.show();

			if(re.test(email)){	
				this.showItems(re);
			}
			else{
				this.spliceItemsEmail(email);
			}
		},
		blur: function(){
			setTimeout($.proxy(function(){ this.$suggest.hide() }, this), 400);
		},
		keydown: function(ev){
			if(this.$input.val() == '')return;

			if(ie9){
				if(ev.which === 8){
					setTimeout($.proxy(this.input, this), 66);
				}
					
			}

			if(ev.which === 38){
				if(this.nIndex === 0){
					this.nIndex = this.nItemsLen-1;
				}
				else{
					this.nIndex--
				}
				this.tab();
			}
			else if(ev.which === 40){
				if(this.nIndex === this.nItemsLen-1){
					this.nIndex = 0;
				}
				else{
					this.nIndex++
				}
				this.tab();
			}
			else if(ev.which === 13){
				this.selection(this.$items.eq(this.nIndex).html());
			}
		},
		tab: function(items){
			this.$items.removeClass(this.sActiveClass).eq(this.nIndex).addClass(this.sActiveClass);
		},
		selection: function(str){
			this.$input.val(str);
			this.$suggest.hide();
			this.$nextfocus.focus();
		},
		storageItemsEmail: function(){
			this.$items.each(function(){
				$(this).data('e', this.innerHTML);
			});
		},
		spliceItemsEmail: function(email){
			this.$items.html(function(index, val){
				if(index === 0)return;

				return email+$(this).data('e');
			});
		},
		showEmail: function(){
			var email = this.$input.val();

			var $item = this.$items.eq(0).html(email).addClass(this.sActiveClass);

			if(email == '')$item.removeClass(this.sActiveClass);

			return email;
		},
		showItems: function(re){
			this.$prevItems.each(function(){
				var $this = $(this);

				if( re.test($this.html()) ){
					$this.css('display', 'block');
				}
				else{
					$this.hide();
				}
			});
			this.$items = this.$prevItems.filter(function(){
				if(this.style.display == 'block'){
					return this;
				}
			});

			this.nIndex = 0;
			this.nItemsLen = this.$items.length;
			this.tab();
		}
	};

	return Suggest;
<<<<<<< HEAD
})
=======
});
>>>>>>> 1f911b688e8686e86ebcc1adef7c8034d39a7101
