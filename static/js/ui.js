var PROGRESS = 0;
var HACKER_SELECTED = null;

var ui = {};
ui.nodeClicked = function(id) {
    if (HACKER_SELECTED == null) return;
    ui.playClick2();
    engine.assign_to_node(HACKER_SELECTED, id);
}

ui.playClick = function() {
    document.getElementById("soundeffect").src = "/static/sound/click.wav";
    document.getElementById("soundeffect").play();
};

ui.playClick2 = function() {
    document.getElementById("soundeffect3").src = "/static/sound/click.wav";
    document.getElementById("soundeffect3").play();
};

ui.playPop = function() {
    document.getElementById("soundeffect2").src = "/static/sound/pop.wav";
    document.getElementById("soundeffect2").play();
};

ui.playMusic = function() {
    //TODO: Implement
};

ui.ambiance = function() {
    var snds = ['keyboard.wav'];
    var randsnd = snds[Math.floor(Math.random()*snds.length)];
    document.getElementById("ambiance").src = "/static/sound/" + randsnd;
    document.getElementById("ambiance").play();

    window.setTimeout(ui.ambiance, 5000+(Math.random() * 10000));
}

ui.updateVisualStats = function() {
    for (hacker_index in USER_HACKERS) {

        var hacker = engine.hackers[USER_HACKERS[hacker_index]];
        if (USER_HACKERS[hacker_index] === HACKER_SELECTED) {
            $("#current_task").html(hacker['state'].charAt(0).toUpperCase() + hacker['state'].slice(1));
            $(".energy.statbar").html(hacker['stats']['energy']);
            $(".productivity.statbar").html(hacker['stats']['productivity']);
            $(".focus.statbar").html(hacker['stats']['focus']);
            $(".teamwork.statbar").html(hacker['base']['teamwork']);

            make_stat_bar($(".energy.statbar"), hacker['base']['energy']);
            make_stat_bar($(".productivity.statbar"), 1.5*hacker['base']['productivity']);
            make_stat_bar($(".focus.statbar"), 100);
            make_stat_bar($(".teamwork.statbar"), 100);
        }
    }
}

ui.updateMonitors = function() {
    $(".monitor").each(function(i, elem) {
        var hacker = engine.hackers[USER_HACKERS[i]];
        $(elem).attr("class", "monitor");
        if (hacker.talents.length > 0)
            $(elem).addClass(hacker.talents[0].toLowerCase()); //Add class
        $(elem).addClass(hacker['state']);
    });
}

ui.init = function(user) {
    hacker_ids = [];
    for (hackerid in USER_HACKERS) {
        hacker_ids.push(hackerid);
        var num = parseInt(hackerid) + 1;
        $("#head_back" + (num) + " img").attr('src', "/static/images/hackers/" + HACKERS[USER_HACKERS[hackerid]]['imgset'] + "back.png");
    }

    ui.ambiance();
    ui.playMusic();
}

ui.select_character = function(index) {
    var target_window = $("#target_window");
    var hacker = engine.hackers[HACKER_SELECTED];

    // no previous hacker selected
    if (HACKER_SELECTED == null){
        $(".head_back").removeClass('selected');
        $("#head_back"+(index+1)).addClass('selected');
        HACKER_SELECTED = USER_HACKERS[index];
        $(".selected_char_pic").attr('src', "/static/images/hackers/" + hacker['imgset'] + "front.png");
        target_window.fadeIn(300);
    }
    else if (HACKER_SELECTED !== USER_HACKERS[index]) { /* a new hacker was selected */
        $(".head_back").removeClass('selected');
        $("#head_back"+(index+1)).addClass('selected');
        HACKER_SELECTED = USER_HACKERS[index];
        // fade the targeting window to left
        $(".selected_char_pic").addClass("selected_char_pic_out");
        target_window.fadeOut(200, function(){
            $(".selected_char_pic").removeClass("selected_char_pic_out");
            $(".selected_char_pic").attr('src', "/static/images/hackers/" + hacker['imgset'] + "front.png");
            target_window.fadeIn(200);
        });
    }
    $("#selected_first_name").html(hacker['first_name']);
    $("#selected_last_name").html(hacker['last_name']);
    $("#selected_class").html(hacker['talents'][0]);
    $("#top_bar").removeClass('programming_bg').removeClass('design_bg').removeClass('business_bg')
        .addClass(hacker['talents'][0].toLowerCase() + '_bg');
    $(".selected_char_pic_wrapper").removeClass('programming_bg_lt').removeClass('design_bg_lt').removeClass('business_bg_lt')
        .addClass(hacker['talents'][0].toLowerCase() + '_bg_lt');
}

$("#top_bar .close").click(function(){
    var target_window = $("#target_window");
    HACKER_SELECTED == null;
    target_window.fadeOut(100);

})

$(".monitor, .head_back, .seat").click(function() {
    ui.playClick();
    var id = $(this).attr("id");
    var index = parseInt(id[id.length - 1]) - 1;
    ui.select_character(index);
});

$(document).keypress(function(event) {
    ui.playClick();
    console.log(event.which);
    if ( event.which >= 49 && event.which <= 52 ) {// 49=1, 52=4
        event.preventDefault();
        var hacker_num = event.which -= 49;
        ui.select_character(hacker_num);
    }
});
