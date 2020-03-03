var numbers = null;
var xml = null;
var correctanswer = [];
var hints = [];
var allanswercorrect = true;
var arr = [];
var cparr = [];
var img = 0;
var selBoxArr = []; //2-1-2017
var flagBlank;     //2-1-2017
var matchFlag;     //2-1-2017
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
var num = Math.floor(Math.random() * 3); //changeG

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

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    LoadDataToMemory();
    hideQuesAudioImg();
}

function LoadDataToMemory() {
    numbers = Number(xml.find("matchthefollowingsize").text());
    var $game_table = $("#table");

    for (i = 0; i < numbers; i++) {
        $(xml).find('LeftShowID').each(function () {
            totalquestion = xml.find("OptionID").length;
            arr = xml.find("OptionID")[i].firstChild.data;
            cparr[i] = arr;
        });

        var tr = $("<tr></tr>");
        $game_table.append(tr);
        $(xml).find('leftside').each(function () {
            var image = mat + "imageleft/" + xml.find("optionleftside")[i].firstChild.data;
            var imagetag = '<img class="img-responsive" src="' + image + '">';

           tr.append("<td class='borderRight flex'><span class='span'>" + cparr[i] + "</span><span> " + imagetag + "</span></td>");
        });

        $(xml).find('rightside').each(function () {
            var imagergt = mat + "imageright/" + xml.find("optionrightside")[i].firstChild.data;
            var imagetagrgt = '<img class="img-responsive" src="' + imagergt + '">';

            tr.append("<td class='center'><input class='form-control font mt-30 ' disabled value='" + cparr[i] + "'>" +
                "<select class='form-control' id='selBox" + i + "'><option value='0'>?</option></select></td>");

            tr.append("<td class='borderLeft flex'><span class='span'>" + (i + 1) + " </span><span>" + imagetagrgt + "</span></td>");
        });

        for (j = 0; j < numbers; j++) {
            $("#selBox" + i).append("<option value='" + (j + 1) + "'>" + (j + 1) + "</option>");
        }

        $(xml).find('hintcollection').each(function () {
            hints[i] = xml.find("hint")[i].firstChild.data;
        });
    }

    $(xml).find('Game').each(function () {
        var gametitle = $(this).find('GameInstruction').text();
        $("#gametitle").html("<span onclick='togglePlay(" + 0 + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> " + gametitle + "</span>");
    });
}

function checkAnswers() {
    stopQuestionAudio();
    for (i = 0; i < numbers; i++) {
        var selBoxId = document.getElementById('selBox' + i);
        var selBoxVal = selBoxId.options[selBoxId.selectedIndex].value;
        selBoxArr[i] = selBoxVal;
        correctanswer[i] = xml.find("answer")[i].firstChild.data;

        console.log("Array Value is: " + selBoxArr[i] + " Correct Ans Value is : " + correctanswer[i]);

        if (selBoxArr[i] == 0) {
            flagBlank = 0;
            break;
        } else {
            flagBlank++;
        }
    }
    //end for loop

    if (flagBlank == 0) {
        console.log("Value is Blank");
    } else {
        console.log("Value is Not Blank");
        for (j = 0; j < numbers; j++) {
            if (selBoxArr[j] == correctanswer[j]) {
                console.log(" Match is " + i);
                matchFlag++;
                trueanswer++;
            } else {
                console.log(" Not Match " + i);
                matchFlag = 0;
                break;
            }
        }
        //end for loop

        var percentage_correct = (Number(trueanswer) / Number(totalquestion)) * 100;
        var current_floor = Number(sessionStorage.getItem("currentfloor"));
        var selected_floor = Number(sessionStorage.getItem("selectedfloor"));
        if (((selected_floor < (current_floor - 3)) && percentage_correct >= 90) || ((selected_floor >= (current_floor - 3)) && percentage_correct >= 80)) {
            $("#successmodal").modal('show');
        } else {
            if (sessionStorage.clickcount == 2 && anchor == "Yes") {
                $("#hintmodal").modal('show');
                GoBackActivity(); //call the logic common anchor js file
            } else if (sessionStorage.clickcount == 2 && anchor == "No") {
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
                        $("#hintmodalbody").append("<img src='" + mat + hints[hit] + "' style='width:30%;height:30%'/>"); //2-1-2017
                    }
                } else {
                    $("#failuremodal").modal('show');
                }
            }
        }
    }
}

function failureModal() {
    $("#hintmodal").modal('hide');
    $("#failuremodal").modal('show');
    // $("#result1").html("Total Questions: "+totalquestion+ "&nbsp;&nbsp;&nbsp;&nbsp;  Wrong Answer: " +falseanswer+ "&nbsp;&nbsp;&nbsp;&nbsp;  Right Answer: "+trueanswer);
}

function restartGame() {
    $("#failuremodal").modal('hide');
    clickCounter();
}
