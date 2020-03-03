var numbers = null;
var xml = null;
var correctanswer = [];
var hints = [];
var allanswercorrect = true;
var arr = [];
var cparr = [];
var shuffledoptionrightside = [];
var uservalue;
var rig = 0;
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
    LoadData();
}

function LoadData() {
    numbers = Number(xml.find("matchthefollowingsize").text());
    var $game_table = $("#game_table");
    for (i = 0; i < numbers; i++) {
        $(xml).find('RightShowID').each(function () {
            arr = xml.find("OptionID")[i].firstChild.data;
            cparr[i] = arr;
        });

        $(xml).find('rightside').each(function () {
            $("#rightside").append("<h4 class='textofmtf '>" + cparr[i] + ".&nbsp;" + xml.find("optionrightside")[i].firstChild.data + "</h4> <hr/>");
        });

        var tr = $("<tr></tr>");
        $game_table.append(tr);
        $(xml).find('rightside').each(function () {
            tr.append("" +
                "<td><input class='form-control textboxmtf' id='textbox" + i +"' type='text' style='text-align:center;background-color:#A9E2F3' pattern='[0-9]' size='1' maxlength='1' placeholder='?' > &nbsp; &nbsp;"+xml.find("optionrightside")[i].firstChild.data +"</td>");
            /*$("#middlediv").append("<h4 class='top'><input class='form-control textboxmtf' id='textbox" + i + "'type='text' style='text-align:center;background-color:#A9E2F3' pattern='[0-9]' size='1' maxlength='1' placeholder='?' ></h4><hr/>");
            $("#rightdiv").append("<h4 class='textofmtf'>" + xml.find("optionrightside")[i].firstChild.data + "</h4> <hr/>");*/
        });

        $(xml).find('correctanswer').each(function () {
            correctanswer[i] = xml.find("answer")[i].firstChild.data;
        });

        $(xml).find('hintcollection').each(function () {
            hints[i] = xml.find("hint")[i].firstChild.data;
        });
    }

    $(xml).find('Game').each(function () {
        var ins = $(this).find('GameInstruction').text();
        $("#ins").html(ins);
    });
    $("#ins1").html("multiple question");
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function checkAnswers() {
    for (blank = 0; blank < numbers; blank++) {
        uservalue = $("#textbox" + blank).val();
        var flag = 0;
        if (uservalue == "") {
            flag = 0;
            break;
        } else {
            flag++;
        }
    }

    if (flag == 0) {
    } else {
        for (i = 0; i < numbers; i++) {
            uservalue = $("#textbox" + i).val();
            if (uservalue == correctanswer[i]) {
                console.log("All answers are correct");
                checkGameStatus(i);
            } else {
                allanswercorrect = false;
                if (sessionStorage.clickcount == 1 && anchor == "Yes") {
                    $("#hintmodal").modal('show');
                    GoBackActivity(); //call the logic common anchor js file
                } else if (sessionStorage.clickcount == 1 && anchor == "No") {
                    $("#hintmodal").modal('show');
                    ConsultToTeacher();
                } else {
                    if (hints[i].trim() != "*") {
                        $("#hintmodal").modal('show');
                        for (hit = 0; hit < numbers; hit++) {
                            $("#hintmodalbody").append(hints[hit] + "</br>");
                        }
                    } else {
                        $("#failuremodal").modal('show');
                    }
                    break;
                }
            }
        }
    }
}

function checkGameStatus(currentnumber) {
    if (currentnumber == Number(numbers - 1)) {
        $("#successmodal").modal('show');
    }
}

function failureModal() {
    $("#hintmodal").modal('hide');
    $("#failuremodal").modal('show');
    $("#ansf").html("<img src='" + pathgif + imagesArrayF[num] + "'/>");
}

function restartGame() {
    $("#failuremodal").modal('hide');
    clickCounter();
}
