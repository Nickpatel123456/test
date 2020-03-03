var question = [];
var question2 = [];
var opt = [];
var op = [];
var optt = [];
var Correctanswer = [];
var favorite = [];
var cars = [];
var ca;
var flag;
var fav = [];
var totalquestion;
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
            launchLaunchModal();
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

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
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
    } else {
        audie.play();
    }

    checkAudioPlayOrNot = 1;
}

function loadQuestionsToMemory() {
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionText").length;
        question = xml.find("QuestionText").text();
        question2 = mat + xml.find("QuestionImage").text();
        $("#questiontext").html('<span><img src="/apps/slearn/slearntemplates/game56/play.jpg" height="42" width="42" onClick="LoadAudio()"> </span><span class="pl-5">' + question +'</span>');
        $("#questionimage").html("<img src='" + question2 + "' style='width:100%'/>");

        $(xml).find('Options').each(function () {
            var opt = xml.find("OptionText").length;

            var mcqshuffledquestionnumber = [];
            for (var i = 0; i < opt; i++) {
                mcqshuffledquestionnumber[i] = i;
                mcqshuffledquestionnumber = shuffle(mcqshuffledquestionnumber);
            }

            for (i = 0; i < opt; i++) {
                op = mat + xml.find("OptionText")[mcqshuffledquestionnumber[i]].firstChild.data;
                optt[i] = op;

                var imagepathsplit = op.split("images/o");
                var imageid = imagepathsplit[1].split(".jpg");

                $("#loadoptionsdetails").append(
                    '<div class="col-md-4 col-sm-4 col-xs-6" style="margin-top: 5px;">' +
                    '<div class="radio"><label> <span><input type="checkbox" class="chk" name="check" value="' + imageid.slice(0, 1) + '"></input></span>' +
                    '<span class="pl-10"><img class="img-responsive" src="' + optt[i] + '" width="80%"/></span></label></div>' +
                    '</div>');
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

    console.log("favorite array value is " + selectcheckboxvalue)

    if (checkAudioPlayOrNot !== 0) {
        audie.pause();
        checkAudioPlayOrNot = 0;
    }

    var answerstorearray = [];
    $(xml).find('Correctanswer').each(function () {
        var answerlength = xml.find("answer").length;
        for (l = 0; l < answerlength; l++) {
            answerstorearray.push(xml.find("answer")[l].firstChild.data);
        }
    });

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
