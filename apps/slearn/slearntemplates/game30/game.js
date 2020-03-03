var question = [];
var opt = [];
var op = [];
var optt = [];
var Correctanswer = [];
var favorite = [];
var cars = [];
var ca;
var totalquestion;
var trueanswer = 0;
var falseanswer = 0;
var xmlname = "/question.xml";
var session = sessionStorage.getItem("subject") + "/" + sessionStorage.getItem("level");
var url = window.location.href;
url = url.split("/");
url = url[0] + "//" + url[2];
url = url.slice(0, url.length - 4);
url = url + "9999/slearn";
var questionxmlurl = url + "/cont/" + session + xmlname;
var mat = url + "/mat/" + session + "/";
var anchor = sessionStorage.getItem("anchor"); // anchor activity session Yes Or No

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: questionxmlurl,
        dataType: "xml",
        success: function (data) {
            xml = $(data);
            CheckAnchor();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Loading question failed");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});

function CheckAnchor() {
    launchLaunchModal();
}

function startGame() {
    $("#launchmodal").modal('hide');
    loadQuestionsToMemory();
    var vid = document.getElementById("audioIns");
    vid.pause();
    hideQuesAudioImg();
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function loadQuestionsToMemory() {
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionText").length;
        question = xml.find("QuestionText").text();
        $("#questiontext").html("<span onclick='togglePlay(" + 1 + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [1] " + question + "</span>");

        $(xml).find('Options').each(function () {
            var opt = xml.find("OptionText").length;
            var mcqshuffledquestionnumber = [];

            for (var i = 0; i < opt; i++) {
                mcqshuffledquestionnumber[i] = i;
                mcqshuffledquestionnumber = shuffle(mcqshuffledquestionnumber);
            }

            for (i = 0; i < opt; i++) {
                op = xml.find("OptionText")[mcqshuffledquestionnumber[i]].firstChild.data;
                optt[i] = op
                $("#optiontext").append(
                    '<div class="radio"><label class="radioButton">' +
                    '<span><input type="checkbox" name="check" class="chk" value="' + optt[i] + '" id="' + i + '" style="margin-left:10px;"></input> </span> <span class="pl-10">' + optt[i]
                    + '</span></label></div>');
            }
        });

        $(xml).find('Correctanswer').each(function () {
            crt = xml.find("answer").length;
            for (l = 0; l < crt; l++) {
                cars[l] = xml.find("answer")[l].firstChild.data;
                console.log("abcd--" + cars[l]);
            }
        });
    });
}

function checkEmpty() {
    var emapty = $("input[name=check]:checked").val();
    if (emapty == undefined) {
        console.log("Select Answer");
    } else {
        flg();
    }
}

function flg() {
    stopQuestionAudio();
    var favorite = [];

    $(".chk:checked").each(function () {
        favorite.push($(this).val());
        console.log(favorite);
    });

    if (favorite.length == cars.length) {
        var flag = 0;

        for (i = 0; i < favorite.length; i++) {
            for (j = 0; j < cars.length; j++) {
                console.log("b--" + favorite[i]);
                console.log("c--" + cars[j]);

                if (favorite[i] == cars[j]) {
                    flag++;
                    trueanswer++;
                    console.log("true");
                } else {
                    falseanswer++;
                }
            }
        }

        ca = $(flag).length;
        if (favorite.length == flag) {
            $("#successmodal").modal('show');
        } else {
            console.log("Final--false");
            $("#failuremodal").modal('show');
        }
    } else {
        console.log("Final--false");
        $("#failuremodal").modal('show');
    }
}

function restartGame() {
    if (sessionStorage.clickcount == 1 && anchor == "Yes") {
        GoBackActivity(); //call the logic common anchor js file
    } else if (sessionStorage.clickcount == 1 && anchor == "No") {
        ConsultToTeacher();
    } else {
        $("#failuremodal").modal('hide');
        clickCounter();
    }
}
