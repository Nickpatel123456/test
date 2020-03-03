var question = [];
var questionid = [];
var correctanswer = [];
var cppanswer = [];
var currentquestionnumber = 0;
var allanswerstrue = true;
var shuffledQuestionNumber = [];
var arrayText = [];
var cparry;
var quesid;
var len;
var xmlname = "/question.xml";
var session = sessionStorage.getItem("subject") + "/" + sessionStorage.getItem("level");
var url = window.location.href;
url = url.split("/");
url = url[0] + "//" + url[2];
url = url.slice(0, url.length - 4);
url = url + "9999/slearn";
var questionxmlurl = url + "/cont/" + session + xmlname;
var mat = url + "/mat/" + session + "/";

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: questionxmlurl,
        dataType: "xml",
        success: function (data) {
            xml = $(data);
            launchLaunchModal();
            loadQuestionsToMemory();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Loading question failed");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    $("#gmins").html($(xml).find("GameInstruction").text());
    LoadWordToMemomery();
    displayQuestions(currentquestionnumber);
}

function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        questionid[count] = xml.find("QuestionID")[count].firstChild.data;
        question[count] = xml.find("QuestionText")[count].firstChild.data;
        correctanswer[count] = xml.find("CorrectAnswer")[count].firstChild.data;
        $("#op" + (count + 1)).html(xml.find("Title")[count].firstChild.data);
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function displayQuestions(count) {
    if ((currentquestionnumber + 1) > question.length) {
        $("#successmodal").modal('show');
    } else {
        $("#questiontext").html("<span onclick='togglePlay(" + questionid[shuffledQuestionNumber[count]] + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [" + (currentquestionnumber + 1) + "] " + question[shuffledQuestionNumber[count]] + "</span>");
        // $("#questiontext").html("[" + (currentquestionnumber + 1) + "] " + question[shuffledQuestionNumber[count]]);
        quesid = questionid[shuffledQuestionNumber[count]];
        cppanswer = correctanswer[shuffledQuestionNumber[count]];
        currentquestionnumber++;
    }
}

function LoadWordToMemomery() {
    var wordLen = $(xml).find('Word').length;
    var wordText = $(xml).find('Word');
    len = wordLen / 2;

    for (m = 0; m < wordLen; m++) {
        cparry = wordText[m].firstChild.data;
        arrayText[m] = cparry.trim();
    }

    arrayText.sort(function () {
        return Math.random() - .5
    });
    for (var i = 0; i < wordLen; i++) {
        var imagepath = mat + "images/" + arrayText[i];
        console.log(imagepath)
        $("#optionimage").append(
            '<div class="col-xs-2">'
            + '<img class="optionImage img-responsive img-thumbnail" src="' + imagepath + '" id="cl' + i + '">'
            + '</div>'
        );
    }

    InsertData();
}

function InsertData() {
    var num = Math.floor(Math.random() * 3); //changeG
    var cnt = 0;
    var storeselectoptionValue = [];

    $("img").click(function () {
        var imgid = this.id;
        var imgsrc = $(this).attr("src");
        var result = imgsrc.split("images/");
        console.log(result[1].split("."));
        var imgnamesplit = result[1].split(".");
        console.log(imgid);
        var matchname = imgnamesplit[0];
        var ansmatch = cppanswer.split("-");

        if (quesid == 1 || quesid == 2) {
            console.log(matchname);

            var selectOptionValueMatch = 0;

            if (storeselectoptionValue.length > 0) {
                for (var i = 0; i < storeselectoptionValue.length; i++) {
                    if (matchname === storeselectoptionValue[i]) {
                        selectOptionValueMatch = 1;
                    }
                }
            }

            if (selectOptionValueMatch != 1) {
                var flag = 0;
                for (row = 0; row < ansmatch.length && !flag; row++) {
                    console.log(ansmatch[row]);
                    if (ansmatch[row] === matchname) {
                        flag++;
                    } else {
                        flag = 0;
                    }
                }

                if (flag == 0) {
                    console.log("Not Match");
                    playAudio("/apps/slearn/slearntemplates/libs/mp3/no.mp3");
                } else {
                    console.log("Match");
                    playAudio("/apps/slearn/slearntemplates/libs/mp3/applause.mp3");
                    $("#quesion" + quesid + "image").append("<div class='col-sm-3 col-xs-3' style='margin-top:5px;'><img class='img-responsive img-thumbnail' src=" + mat + "images/" + matchname + ".jpg" + "></div>");
                    var elem = document.getElementById(imgid);
                    // elem.style.visibility="hidden";
                    storeselectoptionValue.push(matchname);
                    cnt++;
                }

                if (cnt == len || cnt == (len * 2)) {
                    console.log("current question numeber:-" + currentquestionnumber)
                    if (currentquestionnumber == 1) {
                        setTimeout(function () {
                            $("#asnwermodal").modal('show');
                        }, 100);
                    } else {
                        setTimeout(function () {
                            $("#successmodal").modal('show');
                        }, 100);
                        $("#anst").html("<img src='" + pathgif + imagesArrayT[num] + "'/>");
                    }
                }
            }
        }
    });
}

function playAudio(sAudio) {
    var audioElement = document.getElementById('audioEngine');
    if (audioElement !== null) {
        audioElement.src = sAudio;
        audioElement.play();
    }
}

function askNextQuestion() {
    stopQuestionAudio();
    $("#asnwermodal").modal('hide');
    displayQuestions(currentquestionnumber);
}