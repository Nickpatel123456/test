var question = [];
var question1 = [];
var question2 = [];
var opt = [];
var op = [];
var optt = [];
var Correctanswer = [];
var favorite = [];
var cars = [];
var ca;
var audioSrc;
var splt;
var flag;
var totalquestion = '';
var trueanswer = 0;
var falseanswer = 0;
var checkAudioPlayOrNot = 0;
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
            loadQuestionsToMemory();
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

Array.prototype.diff = function (arr2) {
    var ret = [];
    this.sort();
    arr2.sort();
    for (var i = 0; i < this.length; i += 1) {
        if (arr2.indexOf(this[i]) > -1) {
            ret.push(this[i]);
        }
    }
    return ret;
};

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
}

function CheckAnchor() {
    launchLaunchModal();
}

function LoadAudio() {
    $(xml).find('Question').each(function () {
        audioSrc = xml.find("QuestionAudio").text();
        console.log("Audio Src is : " + audioSrc)
    });

    var xmlsrc;
    splt = audioSrc.split("/");
    xmlsrc = splt[1].slice(1, 2);
    // console.log("Audio Loadd id:-" + audiosrc +  " audio src " + audiopath);

    audie = document.getElementById("myAudio");
    if (!audie.src || audie.src !== xmlsrc)
        audie.src = mat + audioSrc;
    if (audie.paused == false) {
        audie.pause();
    }
    else {
        audie.play();
    }

    checkAudioPlayOrNot = 1;
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function loadQuestionsToMemory() {
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionText").length;
        question = xml.find("QuestionText").text();
        question2 = mat + xml.find("QuestionVideo").text();

        $("#questiontext").html('<span><img src="/apps/slearn/slearntemplates/game33/play.jpg" height="42" width="42" onClick="LoadAudio()"> </span><span class="pl-5">' + question + '</span>');
        $("#questionvideo").html("<video width='100%' controls><source src='" + question2 + "' type='video/mp4'></video>");

        $(xml).find('Options').each(function () {
            var opt = xml.find("OptionText").length;

            var mcqshuffledquestionnumber = [];
            for (var i = 0; i < opt; i++) {
                mcqshuffledquestionnumber[i] = i;
                mcqshuffledquestionnumber = shuffle(mcqshuffledquestionnumber);
            }

            for (i = 0; i < opt; i++) {
                op = xml.find("OptionText")[mcqshuffledquestionnumber[i]].firstChild.data;
                optt[i] = op;

               /* $("#loadoptionsdetails").append(
                    '<div class="row">' +
                    '<div class="col-md-12 col-xs-12">' +
                    // '<div class="div2"><center>'+(j+1)+'</center></div>'+
                    '<div class="div2"><input type="checkbox" name="check" class="chk" value="' + optt[i] + '" id="' + i + '"></input></div>' +
                    '<div class="optiontext">' + optt[i] + '</div>' +
                    '</div>' +
                    '</div>');*/

                $("#loadoptionsdetails").append(
                    '<div class="radio"><label class="radioButton"><span class="pt-2 pl-5"><input type="checkbox" name="check" class="chk" value="' + optt[i] + '" id="' + i + '"></span><span class="pl-10">' +
                    optt[i] + '</span></label></div>');
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
    var num = Math.floor(Math.random() * 3); //changeG
    var favorite = [];
    var sotreImageName = [];

    var selectcheckboxvalue = [];
    $(".chk:checked").each(function () {
        selectcheckboxvalue.push($(this).val());
    });

    console.log("select user answer array value is " + selectcheckboxvalue)

    var answerstorearray = [];
    $(xml).find('Correctanswer').each(function () {
        var answerlength = xml.find("answer").length;
        for (l = 0; l < answerlength; l++) {
            answerstorearray.push(xml.find("answer")[l].firstChild.data);
        }
    });

    if (checkAudioPlayOrNot !== 0) {
        audie.pause();
        checkAudioPlayOrNot = 0;
    }

    if (selectcheckboxvalue.length === answerstorearray.length) {
        var matchAnsValue = selectcheckboxvalue.diff(answerstorearray);
        if (matchAnsValue.length === answerstorearray.length) {
            trueanswer++;
            $("#successmodal").modal('show');
        } else {
            falseanswer++;
            $("#failuremodal").modal('show');
        }
    } else {
        falseanswer++;
        $("#failuremodal").modal('show');
    }

    console.log("answer array value is " + answerstorearray)
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
