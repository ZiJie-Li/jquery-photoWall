/**
 *   photoWall
 *
 *   version 1.0.0
 *   
 *   By Lee 
 *    
 *   20150810
 *
 */

(function($, f) {
	var photoWall = function() {
		//  Object clone
		var _this = this;

		//  Set some options
		_this.options = {
			imgWidth : 0, //set img width
			imgHeight : 0, //set img height
			oneLineMaxLength : 3, // set image of numbers in row
			showMax : 6, //set all show Images
			init : 600, // init delay, false for no delay (integer or boolean)
			effect : 'zoomInUp', // init animation effect
			speed : 3000, // transition speed, false for no transition (integer or boolean)
			duration : 1000, // animation speed
			imgSort : 'single', // sort image method ('single' or 'random')
			changeSytle : 'loop', // images display style ('loop' or 'random')
			loopSpeed : 10, // if u chice 'loop' , u can set animation speed level (1 ~ 10)
			changeEffect : 'flipInY', // play animation effect
			autoplay : true, // enable autoplay on initialisation
			fluid : true // is it a percentage width? (boolean) RWD
		};

		_this.init = function(el, options) {
			//  Check whether we're passing any options in to photoWall
			_this.options = $.extend(_this.options, options);
			_this.el = el;

			_this.el.addClass('photo-wall');

			_this.photoWallWidth = _this.el.width();
			_this.imgArray = new Array();
			_this.li = $('.photo-wall li');
			_this.liCount = $('.photo-wall li').length;
			_this.imgWidth = _this.options.imgWidth;
			_this.imgHeight = _this.options.imgHeight;

			//  Cached vars
			var o = _this.options;

			o.showMax = (o.showMax == 'all') ? _this.liCount : o.showMax;

			_this.imgWidth = getImgWidth(_this.photoWallWidth, _this.liCount, o.oneLineMaxLength, _this.li);

			//set animation time
			_this.li.css({'-webkit-animation-duration': o.duration/1000+'s', 'animation-duration': o.duration/1000+'s', '-webkit-animation-delay': o.init/1000+'s', 'animation-delay': o.init/1000+'s'});


			_this.li.each( function(index) {
				_this.imgArray[index] = $(this).find("img").attr('src');

				var j = parseInt(Math.random() * index);
			    var k = _this.imgArray[index];
			    _this.imgArray[index] = _this.imgArray[j];
			    _this.imgArray[j] = k;

				$(this).addClass('animated').addClass(o.effect);
				$(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$(this).removeClass(o.effect);
				});
				
				$(this).width(_this.imgWidth);

				if (_this.imgHeight != 0) $(this).find("img").height(_this.imgHeight);
			});

			_this.li.each( function(index) {
				$(this).find("img").attr('src',_this.imgArray[index]);
				if (index > o.showMax - 1) {
					$(this).remove();
				}
			});

			_this.li = $('.photo-wall li');
			_this.liCount = _this.li.length;
			
			//  Autoplay
			o.autoplay && setTimeout(function() {
				
				_this.play();

				_this.el.hover(
					function() {
					   _this.stop();
					}, function() {
					   _this.play();
					}
				);	

			}, 0);

			// for RWD
			o.fluid && $(window).resize(function() {
				_this.r && clearTimeout(_this.r);

				_this.r = setTimeout(function() {
					_this.photoWallWidth = _this.el.width();

					_this.imgWidth = getImgWidth(_this.photoWallWidth, _this.liCount, o.oneLineMaxLength, _this.li);

					_this.li.css('width', _this.imgWidth + 'px');
				}, 50);
			}).resize();

			return _this;
		};

		//  Autoplay functionality
		_this.play = function() {
			_this.mySet = setInterval(function() {
				if (_this.options.imgSort == 'single') var reImgArray = singleSortImg(_this.imgArray);
				else if (_this.options.imgSort == 'random') var reImgArray = randomSortImg(_this.imgArray);
		
				_this.li.each( function(index) {
					$(this).find("img").attr('src',reImgArray[index]);

					//random
					if (_this.options.changeSytle == 'random') {
						var _speed = _this.options.duration/1000 - Math.random()*(_this.options.speed/1000);
						_speed = (_speed < 0) ? 0 : _speed;
					}
					
					//loop
					if (_this.options.changeSytle == 'loop') {
						var _speed = (_this.options.speed/1000) / (_this.liCount+1);
						_speed = index * _speed / _this.options.loopSpeed;
					}

					$(this).css({'-webkit-animation-delay': _speed + 's', 'animation-delay': _speed + 's'});
					
					$(this).addClass(_this.options.changeEffect);
					$(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						$(this).removeClass(_this.options.changeEffect);
					});
				});
			}, _this.options.speed | 0);
		};

		//  Stop autoplay
		_this.stop = function() {
			_this.mySet = clearInterval(_this.mySet);
			return _this;
		};

		function getImgWidth(photoWallWidth, liCount, maxLength, li) {
			var imgWidth = 0;
			var padding = parseInt(li.css('padding-left').replace("px", "")) + parseInt(li.css('padding-right').replace("px", ""));
			var margin = parseInt(li.css('margin-left').replace("px", "")) + parseInt(li.css('margin-right').replace("px", ""));
			var border = parseInt(li.css('border-width').replace("px", ""))*2;

			if (liCount > maxLength) {
				photoWallWidth = photoWallWidth - (maxLength*maxLength);
				imgWidth = photoWallWidth/maxLength - (padding + border + margin);
			}
			else {
				photoWallWidth = photoWallWidth - (liCount*liCount);
				imgWidth = photoWallWidth/liCount - (padding + border + margin);
			}

			return imgWidth;
		}

		function randomSortImg(arr) {
			var reArr = new Array();
			for (var i = 0; i < arr.length; i++) {
				reArr[i] = arr[useceil(0,arr.length)];
			}

			return reArr;
		}

		function singleSortImg(arr) {
			//var reArr = new Array();
			for (var i = 0; i < arr.length; i++) {
				var j = parseInt(Math.random() * i);
			    var k = arr[i];
			    arr[i] = arr[j];
			    arr[j] = k;
			}

			return arr;
		}

		function useceil(min,max) {
			return Math.ceil(Math.random()*(max-min+1)+min-1);
		}
	};

	//  Create a jQuery plugin
	$.fn.photoWall = function(o) {
		var len = this.length;

		//  Enable multiple support
		return this.each(function(index) {
			//  Cache a copy of $(this), so it
			var me = $(this),
				key = 'photoWall' + (len > 1 ? '-' + ++index : ''),
				instance = (new photoWall).init(me, o);

			//  Invoke an photoWall instance
			me.data(key, instance).data('key', key);
		});
	};

	photoWall.version = "1.0.0";
})(jQuery, false);