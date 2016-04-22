document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

	function backKeyDown() {
    	navigator.app.exitApp();
  	} 

 	FastClick.attach(document.body);

  	document.addEventListener("backbutton", backKeyDown, true); 

	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}

		return array;
	}

	$.fn.filterByData = function(prop, val) {
	    return this.filter(
	        function() { return $(this).data(prop)==val; }
	    );
	}

	var images = [
		"p-1.png",
		"p-2.png",
		"p-3.png",
		"p-4.png"
	];

	var stored_item;
	var flag_pair = false;
	var flag_click = false;
	var count_attempts = 0;
	var total_attempts = 3;

	var duplicated_items = [];

	$.each(images, function (i, e) {
		var route_images = "img/";

		duplicated_items.push([route_images+images[i], i]);
		duplicated_items.push([route_images+images[i], i]);
	});

	var shuffled_items = shuffleArray(duplicated_items);

	function flip_event () {
		var data_group = $(this).data("group");

		if (flag_click && !$(this).hasClass("active") && !$(this).hasClass("matched")) {
			flag_click = false;
			$(this).addClass("active");

			setTimeout(function(){
				if (flag_pair) {
					if (stored_item == data_group) {
						$(".flip-container").filterByData("group", data_group).addClass("matched");

						if ($(".flip-container.matched").length == 8) {
							count_attempts = 0;
							flag_click = false;
							stored_item = null;
							flag_pair = false;

							setTimeout(function(){
								$("#game").fadeOut(500, function () {
									$(".flip-container").removeClass("matched");

									$("#you_won").fadeIn(500, function () {
										setTimeout(function(){
											$("#you_won").fadeOut(500, function () {
												$("#logo").fadeIn(500);
											});
										}, 500);
									});
								});
							}, 500);
						}
					} else {
						count_attempts++;

						if (count_attempts == total_attempts) {
							count_attempts = 0;
							flag_click = false;
							stored_item = null;
							flag_pair = false;

							setTimeout(function(){
								$("#game").fadeOut(500, function () {
									$(".flip-container").removeClass("active");
									$(".flip-container").removeClass("matched");
									$("#try_again").fadeIn(500);
								});
							}, 500);
						}
					}

					stored_item = null;
					flag_pair = false;
					$(".flip-container").removeClass("active");
				} else {
					stored_item = data_group;
					flag_pair = true;
				}

				flag_click = true;
			}, 500);
		}	
	};

	$(".flip-container").on("click", flip_event);

	$("#logo").on("click", function () {
		$(this).fadeOut(500, function () {
			$("#welcome").fadeIn(500);
		});
	});

	$("#welcome, #try_again").on("click", function () {
		count_attempts = 0;
		flag_click = false;
		stored_item = null;
		flag_pair = false;
		$(".flip-container").removeClass("active");
		$(".flip-container").removeClass("matched");

		shuffled_items = shuffleArray(duplicated_items);

		$(".back").each( function(i, e) {
			$(this).css("background-image", "url("+shuffled_items[i][0]+")");
			$(this).closest(".flip-container").data("group", shuffled_items[i][1]);
		});

		$(this).fadeOut(500, function () {
			$("#game").fadeIn(500, function () {
				$(".flip-container").addClass("active");
				setTimeout(function(){
					$(".flip-container").removeClass("active");

					setTimeout(function(){
						flag_click = true;
					}, 700);
					
				}, 3000);
			});
		});
	});
}