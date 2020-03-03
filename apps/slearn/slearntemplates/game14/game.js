var question = [];
var option1 = [];
var option2 = [];
var option3 = [];
var option4 = [];
var correctAnswer;
var hintType = [];
var hintText = [];
var hintImagePath = [];
var shuffledQuestionNumber = [];
var xml;
var currentquestionnumber = 0;
var allanswerstrue = true;
var totalquestion;
var trueanswer = 0;
var wornganswer = 0;
var count;
var audioSrc = "";
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
    var count = 0;
    $.ajax({
        type: 'GET',
        url: questionxmlurl,
        dataType: "xml",
        success: function (data) {
            xml = $(data);
            CheckAnchor();
            ShowLevelImage();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Loading question failed");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });

    var viewportwidth;
    var viewportheight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerWidth,
            viewportheight = window.innerHeight
    }// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = document.documentElement.clientWidth,
            viewportheight = document.documentElement.clientHeight
    } else {
        // older versions of IE
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
            viewportheight = document.getElementsByTagName('body')[0].clientHeight
    }

    $(":image").click(function () {
        switch (this.id) {
            case '38': // Up arrow Key
                moveV(-20);
                break;
            case '40': // Down Arrow Key
                moveV(20);
                break;
            case '37': // left arrow key
                moveH(-20);
                break;
            case '39': // right arrow key
                moveH(20);
                break;
        }
    });

    function moveV(i) {
        var block, vTop, vNum;
        block = document.getElementById('me');
        vTop = block.offsetTop;
        vNum = parseInt(vTop);
        vNum += i;
        if (vNum + block.offsetHeight <= viewportheight && vNum >= 0) {
            block.style.top = vNum + "px";
            var overlap = checkOverLap();
            if ($("#nails").length != 0) {
                lap1Reached();
            } else if ($("#compass").length != 0) {
                var check = checkIfOtherThanLevel2Touched();
                if (check == true) {
                    $("#levelmodal").modal('show');
                    $("#msg").html("સ્તર ૨ પર જાઓ ");
                    $("#me").css({"top": "2em", "left": "2em"});
                } else {
                    lap2Reached();
                }
            } else if ($("#barmagnet").length != 0) {
                var check = checkIfOtherThanLevel3Touched();
                if (check == true) {
                    $("#levelmodal").modal('show');
                    $("#msg").html("સ્તર 3 પર જાઓ");
                    $("#me").css({"top": "2em", "left": "2em"});
                } else {
                    lap3Reached();
                }
            } else if ($("#magnetic").length != 0) {
                lap4Reached();
            } else if ($("#allmagnetic").length != 0) {
                lap5Reached();
            } else if ($("#iron").length != 0) {
                lap6Reached();
            } else if ($("#destinationreached").length != 0) {
                checkIfDestinationReached();
            }
            if (overlap == true) {
                vNum -= i;
                block.style.top = vNum + "px";
            }
        }
    }

    function moveH(i) {
        var block, hLeft, hNum;
        block = document.getElementById('me');
        hLeft = block.offsetLeft;
        hNum = parseInt(hLeft);
        hNum += i;
        if (hNum + block.offsetWidth <= viewportwidth && hNum >= 0) {
            block.style.left = hNum + "px";
            var overlap = checkOverLap();
            if ($("#nails").length != 0) {
                lap1Reached();
            } else if ($("#compass").length != 0) {
                var check = checkIfOtherThanLevel2Touched();
                if (check == true) {
                    $("#levelmodal").modal('show');
                    $("#msg").html("સ્તર ૨ પર જાઓ");
                    $("#me").css({"top": "2em", "left": "2em"});
                } else {
                    lap2Reached();
                }
            } else if ($("#barmagnet").length != 0) {
                var check = checkIfOtherThanLevel3Touched();
                if (check == true) {
                    $("#levelmodal").modal('show');
                    $("#msg").html("સ્તર 3 પર જાઓ");
                    $("#me").css({"top": "2em", "left": "2em"});
                } else {
                    lap3Reached();
                }
            } else if ($("#magnetic").length != 0) {
                lap4Reached();
            } else if ($("#allmagnetic").length != 0) {
                lap5Reached();
            } else if ($("#iron").length != 0) {
                lap6Reached();
            } else if ($("#destinationreached").length != 0) {
                checkIfDestinationReached();
            }
            if (overlap == true) {
                hNum -= i;
                block.style.left = hNum + "px";
            }
        }
    }

    function checkOverLap() {
        var overlap = doTheyOverlap($('#me'), $('#blockage1'));
        if (overlap == true) {
            return true;
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage2'));
            if (overlap == true) {
                return true;
            }
        }
        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage3'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage4'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage5'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage6'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage7'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage8'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage9'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage10'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage11'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage12'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage13'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage14'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage15'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage16'));
            if (overlap == true) {
                return true;
            }
        }


        if (overlap == false) {
            overlap = doTheyOverlap($('#me'), $('#blockage17'));
            if (overlap == true) {
                return true;
            }
        }

        if (overlap == false) {
            return false;
        }

    }

    function checkIfDestinationReached() {
        overlap = doTheyOverlap($('#me'), $('#destinationreached'));
        if (overlap == true) {
            alert("Destination Reached");
            checkGameStatus();
        }
    }

    function lap1Reached() {
        var overlap = doTheyOverlap($('#me'), $('#nails'));
        if (overlap == true) {
            $("#nails").remove();
            $("#me").hide();
            $("#questionsmodal").modal('show');
            document.getElementById('singleQuestion').style.display = 'inherit';
            document.getElementById('videoQuestion').style.display = 'none';
            count = 0;
            sessionStorage.setItem('game14questionId', count);
            $(xml).find('level1').each(function () {
                totalquestion = xml.find("QuestionText").length;
                $("#questiontext").html("<span onclick='playAudio(" + 1 + ")'><img id='audioImg0' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> પ્રશ્ન. " + xml.find("QuestionText")[count].firstChild.data + "</span>");
                $("#option1text").html(xml.find("QuestionText")[count].nextElementSibling.children[0].firstChild.data);
                $("#option2text").html(xml.find("QuestionText")[count].nextElementSibling.children[1].firstChild.data);
                $("#option3text").html(xml.find("QuestionText")[count].nextElementSibling.children[2].firstChild.data);
                $("#option4text").html(xml.find("QuestionText")[count].nextElementSibling.children[3].firstChild.data);
                correctAnswer = xml.find("CorrectAnswerOptionID")[count].firstChild.data;
            });
            hideAudioImg();
        }
    }

    function lap2Reached() {
        var overlap = doTheyOverlap($('#me'), $('#compass'));
        if (overlap == true) {
            $("#compass").remove();
            $("#me").hide();
            $("#questionsmodal").modal('show');
            document.getElementById('singleQuestion').style.display = 'none';
            document.getElementById('videoQuestion').style.display = 'inherit';
            count = 1;
            sessionStorage.setItem('game14questionId', count);
            $(xml).find('level2').each(function () {
                $("#QuesionText").html("<span onclick='playAudio(" + 2 + ")'><img id='audioImg1' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> પ્રશ્ન. " + xml.find("QuestionText")[count].firstChild.data + "</span>");
                question[0] = mat + xml.find("QuestionImage")[0].firstChild.data;
                $("#quesType").html("<img src='" + question[0] + "' style='width:100%'/>");
                $("#option1").html(xml.find("QuestionImage")[0].nextElementSibling.children[0].firstChild.data);
                $("#option2").html(xml.find("QuestionImage")[0].nextElementSibling.children[1].firstChild.data);
                $("#option3").html(xml.find("QuestionImage")[0].nextElementSibling.children[2].firstChild.data);
                $("#option4").html(xml.find("QuestionImage")[0].nextElementSibling.children[3].firstChild.data);
                correctAnswer = xml.find("CorrectAnswerOptionID")[count].firstChild.data;
            });
            hideAudioImg();
        }
    }

    function lap3Reached() {
        var overlap = doTheyOverlap($('#me'), $('#barmagnet'));
        if (overlap == true) {
            $("#barmagnet").remove();
            $("#me").hide();
            $("#questionsmodal").modal('show');
            document.getElementById('singleQuestion').style.display = 'inherit';
            document.getElementById('videoQuestion').style.display = 'none';
            count = 2;
            sessionStorage.setItem('game14questionId', count);
            $(xml).find('level3').each(function () {
                audioSrc = xml.find("QuestionAudio").text();
                $("#questiontext").html("<span onclick='playAudio(audioSrc)'><img id='audioImg2' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> પ્રશ્ન. " + xml.find("QuestionText")[count].firstChild.data + "</span>");
                $("#option1text").html(xml.find("QuestionAudio")[0].nextElementSibling.children[0].firstChild.data);
                $("#option2text").html(xml.find("QuestionAudio")[0].nextElementSibling.children[1].firstChild.data);
                $("#option3text").html(xml.find("QuestionAudio")[0].nextElementSibling.children[2].firstChild.data);
                $("#option4text").html(xml.find("QuestionAudio")[0].nextElementSibling.children[3].firstChild.data);
                correctAnswer = xml.find("CorrectAnswerOptionID")[count].firstChild.data;
            });
        }
    }

    function lap4Reached() {
        var overlap = doTheyOverlap($('#me'), $('#magnetic'));
        if (overlap == true) {
            $("#magnetic").remove();
            $("#me").hide();
            $("#questionsmodal").modal('show');
            document.getElementById('singleQuestion').style.display = 'none';
            document.getElementById('videoQuestion').style.display = 'inherit';
            count = 3;
            sessionStorage.setItem('game14questionId', count);
            $(xml).find('level4').each(function () {
                $("#QuesionText").html("<span onclick='playAudio(" + 4 + ")'><img id='audioImg3' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> પ્રશ્ન. " + xml.find("QuestionText")[count].firstChild.data + "</span>");
                question[0] = mat + xml.find("QuestionVideo").text();
                $("#quesType").html("<div><video width='100%' controls id='video1'><source src='" + question[0] + "' type='video/mp4'></video></div>");
                $("#option1").html(xml.find("QuestionVideo")[0].nextElementSibling.children[0].firstChild.data);
                $("#option2").html(xml.find("QuestionVideo")[0].nextElementSibling.children[1].firstChild.data);
                $("#option3").html(xml.find("QuestionVideo")[0].nextElementSibling.children[2].firstChild.data);
                $("#option4").html(xml.find("QuestionVideo")[0].nextElementSibling.children[3].firstChild.data);
                correctAnswer = xml.find("CorrectAnswerOptionID")[count].firstChild.data;
            });
            hideAudioImg();
        }
    }

    function lap5Reached() {
        var overlap = doTheyOverlap($('#me'), $('#allmagnetic'));
        if (overlap == true) {
            $("#allmagnetic").remove();
            $("#me").hide();
            $("#questionsmodal").modal('show');
            // $("#questiontype,#option3text,#option4text").hide();
            document.getElementById('singleQuestion').style.display = 'inherit';
            document.getElementById('videoQuestion').style.display = 'none';
            count = 4;
            sessionStorage.setItem('game14questionId', count);
            $(xml).find('level5').each(function () {
                $("#questiontext").html("<span onclick='playAudio(" + 5 + ")'><img id='audioImg4' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> પ્રશ્ન. " + xml.find("QuestionText")[count].firstChild.data + "</span>");
                $("#option1text").html(xml.find("QuestionText")[count].nextElementSibling.children[0].firstChild.data);
                $("#option2text").html(xml.find("QuestionText")[count].nextElementSibling.children[1].firstChild.data);
                $("#option3text").html(xml.find("QuestionText")[count].nextElementSibling.children[2].firstChild.data);
                $("#option4text").html(xml.find("QuestionText")[count].nextElementSibling.children[3].firstChild.data);
                correctAnswer = xml.find("CorrectAnswerOptionID")[count].firstChild.data;
            });
            hideAudioImg();
        }
    }

    function lap6Reached() {
        var overlap = doTheyOverlap($('#me'), $('#iron'));
        if (overlap == true) {
            $("#iron").remove();
            $("#me").hide();
            $("#questionsmodal").modal('show');
            // $("#option3text,#option4text").hide();
            document.getElementById('singleQuestion').style.display = 'none';
            document.getElementById('videoQuestion').style.display = 'inherit';
            count = 5;
            sessionStorage.setItem('game14questionId', count);
            $(xml).find('level6').each(function () {
                $("#QuesionText").html("<span onclick='playAudio(" + 6 + ")'><img id='audioImg5' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> પ્રશ્ન. " + xml.find("QuestionText")[count].firstChild.data + "</span>");
                question[1] = mat + xml.find("QuestionImage")[1].firstChild.data;
                $("#quesType").html("<img src='" + question[1] + "' style='width:100%'/>");
                $("#option1").html(xml.find("QuestionImage")[1].nextElementSibling.children[0].firstChild.data);
                $("#option2").html(xml.find("QuestionImage")[1].nextElementSibling.children[1].firstChild.data);
                $("#option3").html(xml.find("QuestionImage")[1].nextElementSibling.children[2].firstChild.data);
                $("#option4").html(xml.find("QuestionImage")[1].nextElementSibling.children[3].firstChild.data);
                correctAnswer = xml.find("CorrectAnswerOptionID")[count].firstChild.data;
            });
            hideAudioImg();
        }
    }
});

/* this below function and declare variable all slearn template all question Audio Play, Pause and Hide Audio Image*/
var myAudio = document.getElementById("myAudio");
var isPlaying = false;

function playAudio(quesionNumber) {
    if (typeof quesionNumber == "number") {
        myAudio.src = mat + "/" + quesionNumber + ".mp3";
    } else {
        myAudio.src = mat + "/" + quesionNumber;
    }
    if (isPlaying) {
        myAudio.pause();
        isPlaying = false;
        $('#audioImg' + sessionStorage.getItem('game14questionId')).attr('src', '/apps/slearn/slearntemplates/assets/pause.png');
    } else {
        myAudio.play();
        $('#audioImg' + sessionStorage.getItem('game14questionId')).attr('src', '/apps/slearn/slearntemplates/assets/play.png');
    }
};
myAudio.onplaying = function () {
    isPlaying = true;
};
myAudio.onpause = function () {
    isPlaying = false;
    $('#audioImg' + sessionStorage.getItem('game14questionId')).attr('src', '/apps/slearn/slearntemplates/assets/pause.png');
};

function hideAudioImg() {
    if (sessionStorage.getItem('selectedfloor') > 4 || sessionStorage.getItem('activity_standard') > 4) {
        $('#audioImg' + sessionStorage.getItem('game14questionId')).hide();
    }
}

/* End function */

function checkIfOtherThanLevel2Touched() {
    if (doTheyOverlap($('#me'), $('#barmagnet')) || doTheyOverlap($('#me'), $('#magnetic'))) {
        return true;
    }
}

function checkIfOtherThanLevel3Touched() {
    if (doTheyOverlap($('#me'), $('#magnetic'))) {
        return true;
    }
}


function ShowLevelImage() {
    $(xml).find('ImageLevelName').each(function () {
        $("#nails").attr('src', mat + $(xml).find('Level1').text());
        $("#compass").attr('src', mat + $(xml).find('Level2').text());
        $("#barmagnet").attr('src', mat + $(xml).find('Level3').text());
        $("#magnetic").attr('src', mat + $(xml).find('Level4').text());
        $("#allmagnetic").attr('src', mat + $(xml).find('Level5').text());
        $("#iron").attr('src', mat + $(xml).find('Level6').text());
        $("#destinationreached").attr('src', mat + $(xml).find('Destination').text());
    });
}


function CheckAnchor() {
    launchLaunchModal();
}

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    $("#me").show();
}

function checkAnswer(options) {
    stopQuestionAudio();
    sessionStorage.removeItem("game14questionId");
    $("#questionsmodal").modal('hide');
    $("#asnwermodal").modal('show');
    var num = Math.floor(Math.random() * 3); //changeG
    $("#option" + options + "text").css('background-color:orange');
    if (correctAnswer == options) {
        console.log("Answer is correct");
        $("#answermessage").html("<h3 style='color:green'> શાબાશ! તમારો જવાબ સાચો છે. </h3><img src='" + pathgif + imagesArrayT[num] + "'/>");
        trueanswer++;
    } else {
        console.log("Answer is wrong");
        $("#answermessage").html("<h3 style='color:red'> તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
        allanswerstrue = false;
        wornganswer++;
        if (hintType == "Text") {
            $("#answermessage").append(hintText);
        } else if (hintType[shuffledQuestionNumber[currentquestionnumber - 1]] == "Image") {
            $("#answermessage").append(hintText + "<br/><br/>");
            $("#answermessage").append("<img src='" + hintImagePath + "'/>");
        }
    }
}

function askNextQuestion() {
    $("#asnwermodal").modal('hide');
    displayQuestions(currentquestionnumber);
}

function checkGameStatus() {
    var percentage_correct = (Number(trueanswer) / 6) * 100;
    var current_floor = Number(sessionStorage.getItem("currentfloor"));
    var selected_floor = Number(sessionStorage.getItem("selectedfloor"));
    var marksInfo = "<div class='result'><span>Total Question </span><span class='marks lightblue'>" + totalquestion + "</span></div><div class='result'><span>Right Answer </span><span class='marks lightgreen'>" + trueanswer + "</span></div><div class='result'><span>Wrong Answer </span><span class='marks lightcoral'>" + wornganswer + "</span></div>";

    if (((selected_floor < (current_floor - 3)) && percentage_correct >= 90) || ((selected_floor >= (current_floor - 3)) && percentage_correct >= 80)) {
        $("#successmodal").modal('show');
        $("#result").html(marksInfo);
    } else {
        if (sessionStorage.clickcount == 1 && anchor == "Yes") {
            GoBackActivity();
        } else if (sessionStorage.clickcount == 1 && anchor == "No") {
            ConsultToTeacher();
        } else {
            $("#failuremodal").modal('show');
            $("#result1").html(marksInfo);
        }
    }
}

function closeModal(modalname) {
    $('#' + modalname + 'modal').modal('hide');
    $("#me").show();
}

function restartGame() {
    $("#failuremodal").modal('hide');
    clickCounter();
}

