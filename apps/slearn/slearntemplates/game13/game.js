var numbers = null;
var xml = null;
var correctanswer = [];
var hints = [];
var allanswercorrect = true;
var arr = [];
var cparr = [];
var selBoxArr = [];
var flagBlank;
var matchFlag;
var totalquestion;
var xmlname = "/question.xml";
var session = sessionStorage.getItem("subject") + "/" + sessionStorage.getItem("level");
var url = window.location.href;
url = url.split("/");
url = url[0] + "//" + url[2];
url = url.slice(0, url.length - 4);
url = url + "9999/slearn";
var questionxmlurl = url + "/cont/" + session + xmlname;
var mat = url + "/mat/" + session + "/";
var anchor = sessionStorage.getItem("anchor");
var leftsideoptionid = [];
var leftsideOption = [];
var rightsideOption = [];

$(document).ready(function () {
    var count = 0;
    $.ajax({
        type: 'GET',
        url: questionxmlurl,
        dataType: "xml",
        success: function (data) {
            xml = $(data);
            CheckAnchor();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Loading xml questions failed");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});


function CheckAnchor() {
    launchLaunchModal();
}

//this function work show start game modal toggle
function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    LoadData();
    hideQuesAudioImg();
}


//this function work after startGame function work
function LoadData() {
    numbers = Number(xml.find("matchthefollowingsize").text());

    for (i = 0; i < numbers; i++) {
        $(xml).find('LeftShowID').each(function () {
            totalquestion = xml.find("OptionID").length;
            leftsideoptionid.push(xml.find("OptionID")[i].firstChild.data);
        });

        //this each store all left side option data in xml tag
        $(xml).find('leftside').each(function () {
            leftsideOption.push(xml.find("optionleftside")[i].firstChild.data);
        });

        //this each store all right side option data in xml tag
        $(xml).find('rightside').each(function () {
            rightsideOption.push(xml.find("optionrightside")[i].firstChild.data)
        });

        $(xml).find('hintcollection').each(function () {
            hints[i] = xml.find("hint")[i].firstChild.data;
        });
    }

    //this for loop write data in html table tag
    for (var i = 0; i < leftsideOption.length; i++) {
        $("#leftrightoption").append(
            '<tr>'
            + '<td class="leftboxColor" style="vertical-align: middle;padding-bottom: 0px; padding-top: 10px;"><span>[' + leftsideoptionid[i] + '] </span> <span class="pl-5">' + leftsideOption[i] + '</span></td>'
            + '<td class="middleboxColor"><div class="panel-group" data-toggle="collapse" href="#collapse' + i + '"> <div class="panel panel-default"> <div class="panel-heading pb-5"> <h4 class="panel-title"> <a><div class="selectionBox">પસંદ કરો </div> <div id="selectans' + i + '"> </div></a> </h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse"> <ul class="list-group" id="rightbox' + i + '"></ul> </div> </div> </div></td>'
            + '</tr>'
        );

        for (var j = 0; j < rightsideOption.length; j++) {
            $("#rightbox" + i).append(
                '<li class="list-group-item" data-toggle="collapse" data-target="#collapse' + i + '" id="' + (j + 1) + '" style="padding-bottom: 2px;">' + rightsideOption[j] + '</li>'
            );
        }
    }

    $(xml).find('Game').each(function () {
        var gametitle = $(this).find('GameInstruction').text();
        $("#gametitle").html("<span onclick='togglePlay(" + 0 + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> " + gametitle + "</span>");
        // $("#instructionText").html("જોડકાં જોડો." + " ( " + instruction + " ) ");
    });

    $('li').click(function () {
        var selectans_id = $(this).attr('id'); //this is get the select ans li tag id
        $(this).parent().find('li').removeClass('panel-footer');
        $(this).addClass('panel-footer');
        var parentId = $(this).parent().attr('id'); //get li parent id (ul)
        var select_ans = $(this).html(); //get select li html text
        var splitParentId = parentId.split("rightbox"); //split id ul tag
        $("#selectans" + splitParentId[1]).data('indexnumber', selectans_id); //set data attribute
        $("#selectans" + splitParentId[1]).addClass('selectionBox select');
        $("#selectans" + splitParentId[1]).html(select_ans); //selectans id div tag display select li text
        // $("#selectans" + splitParentId[1]).html(select_ans.replace("[", "").replace("]", ".")); //selectans id div tag display select li text
    });
}

var findDuplicate = function (array) {
    return array.some(function (value) {// .some will break as soon as duplicate found (no need to itterate over all array)
        return array.indexOf(value) !== array.lastIndexOf(value);   // comparing first and last indexes of the same value
    })
}

//this function check all dorpdown value select or not
function getallselectdropdownvalue() {
    var selectboxanswervalue = [];
    var rightanswervalue = [];
    var emptyvalue = false;

    for (var i = 0; i < leftsideOption.length; i++) {
        var selectanswerText = $('#selectans' + i).html().trim();
        var selectansweindexnumber = $('#selectans' + i).data('indexnumber');
        console.log(selectansweindexnumber)
        if (selectanswerText == '') {
            emptyvalue = true;
            break;
        } else {
            // var selectAns = selectanswerText.split(":-");
            // selectboxanswervalue.push(selectAns[0]);
            selectboxanswervalue.push(selectansweindexnumber);
            rightanswervalue.push(xml.find("answer")[i].firstChild.data);
        }
    }

    // emptyvalue == true if any one OR all dorpdown value is not selected
    if (emptyvalue == true) {
        $("#errormodal").modal("show");
        $("#errorMsg").html("તમે બધા પ્રશ્નોના જવાબ આપ્યા નથી.");
    } else {
        var duplicate = findDuplicate(selectboxanswervalue);
        if (duplicate == true) {
            $("#errormodal").modal("show");
            $("#errorMsg").html("તમે એક જ જવાબ એક કરતાં વધારે વખત પસંદ કર્યો છે.");
        } else {
            checkAnswersCorrectOrNot(rightanswervalue, selectboxanswervalue);
        }
    }
}

//this function work all dorpdown value selected and check right or wrong answer
function checkAnswersCorrectOrNot(rightAns, selectAns) {
    stopQuestionAudio();
    var trueanswer = 0;
    var wornganswer = 0;

    for (var i = 0; i < rightAns.length; i++) {
        if (Number(rightAns[i]) === Number(selectAns[i])) {
            trueanswer++;
        } else {
            wornganswer++;
        }
    }

    var percentage_correct = (Number(trueanswer) / Number(numbers)) * 100;
    var current_floor = Number(sessionStorage.getItem("currentfloor"));
    var selected_floor = Number(sessionStorage.getItem("selectedfloor"));
    var marksInfo = "<div class='result'><span>Total Question </span><span class='marks lightblue'>" + totalquestion + "</span></div><div class='result'><span>Right Answer </span><span class='marks lightgreen'>" + trueanswer + "</span></div><div class='result'><span>Wrong Answer </span><span class='marks lightcoral'>" + wornganswer + "</span></div>";

    if (((selected_floor < (current_floor - 3)) && percentage_correct >= 90) || ((selected_floor >= (current_floor - 3)) && percentage_correct >= 80)) {
        $("#successmodal").modal('show');
        $("#result").html(marksInfo);
    } else {
        if (sessionStorage.clickcount == 1 && anchor == "Yes") {
            $("#hintmodal").modal('show');
            GoBackActivity();
        } else if (sessionStorage.clickcount == 1 && anchor == "No") {
            $("#hintmodal").modal('show');
            ConsultToTeacher();
        } else {
            for (k = 0; k < numbers; k++) {
                var hintMatch = 0;
                if (hints[k].trim() == "*") {
                    hintMatch++;
                    break;
                    console.log(" Hint Match *" + hintMatch);
                }
            }

            if (hintMatch == 0) {
                $("#hintmodal").modal('show');
                for (hit = 0; hit < numbers; hit++) {
                    $("#hintmodalbody").append(hints[hit] + "</br>");
                }
            } else {
                $("#failuremodal").modal('show');
                $("#result1").html(marksInfo);
            }
        }
    }
}

function restartGame() {
    $("#failuremodal").modal('hide');
    clickCounter();
}
