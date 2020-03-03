var pathgif = "/apps/slearn/slearntemplates/assets/gif/"		//changeG
var imagesArrayT = ["1.gif", "2.gif", "3.gif"];		//change
var imagesArrayF = ["4.gif", "5.gif", "6.gif"];		//change
var rem2opentimeoutId;

function previousQuestionLoad() {
    answermarks.pop();
    currentquestionnumber--;
    if (currentquestionnumber == 0) {
        $("#previous").hide();
    }
    displayQuestions(currentquestionnumber);
}

function countElement(item, array) {
    var count = 0;
    $.each(array, function (i, v) {
        if (v === item) count++;
    });
    return count;
}

function showhidePreviousQuesionBtn() {
    if (sessionStorage.getItem("user_role") == "teacher") {
        $("#previous").show();
        $("#previous").html("પાછા જાઓ");
    } else {
        $("#previous").hide();
    }
}

//this function is common for all slearn template start game modal
function launchLaunchModal() {    //change
    var templateid = sessionStorage.getItem("templateid"); //this session get template wise template number
    var audiopath = "/apps/slearn/slearntemplates/assets/audio/"
    $.ajax({
        type: 'GET',
        url: "/apps/slearn/slearntemplates/assets/gameInstruction.xml",
        dataType: "xml",
        success: function (data) {
            gameInsXml = $(data);
            $(gameInsXml).find('Instruction').each(function () {
                var unittitle = $(this).find('Game' + templateid).text();
                $("#launchmodal").modal('show');
                $("#unittitle").html(unittitle + "</br><audio controls id='audioIns'> <source src='" + audiopath + 'game' + templateid + ".mp3" + "' type='audio/mp3'>Your browser does not support HTML5 video.</audio>");
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Launching launch modal failed")
            console.log("Loading question failed");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        },
        timeout: 5000
    });
}

// END

/* this below function and declare variable all slearn template all question Audio Play, Pause and Hide Audio Image*/
var myAudio = document.getElementById("myAudio");
var isPlaying = false;

function togglePlay(quesionNumber) {
    if (typeof quesionNumber == "number") {
        myAudio.src = mat + "/" + quesionNumber + ".mp3";
    } else {
        myAudio.src = mat + "/" + quesionNumber;
    }
    if (isPlaying) {
        myAudio.pause();
        isPlaying = false;
        $('#audioImg').attr('src', '/apps/slearn/slearntemplates/assets/pause.png');
    } else {
        myAudio.play();
        $('#audioImg').attr('src', '/apps/slearn/slearntemplates/assets/play.png');
    }
};
myAudio.onplaying = function () {
    isPlaying = true;
};
myAudio.onpause = function () {
    isPlaying = false;
    $('#audioImg').attr('src', '/apps/slearn/slearntemplates/assets/pause.png');
};

function stopQuestionAudio() {
    myAudio.pause();
}

function hideQuesAudioImg() {
    if (sessionStorage.getItem('selectedfloor') > 4 || sessionStorage.getItem('activity_standard') > 4) {
        $('#audioImg').hide();
    }
}

function hideInsAudioImg() {
    if (sessionStorage.getItem('selectedfloor') > 4 || sessionStorage.getItem('activity_standard') > 4) {
        $('#audioImg0').hide();
    }
}

/* End function */

//this function work check how many time student has played a particular activity
function clickCounter() {
    $('body').css('pointerEvents', 'none');
    if (sessionStorage.getItem("user_role") != "reviewer" && sessionStorage.getItem("user_role") == "student") {
        console.log(sessionStorage.getItem("user_role"))
        if (typeof (Storage) !== "undefined") {
            console.log(sessionStorage.clickcount)
            if (sessionStorage.clickcount) {
                console.log("if")
                sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1; // this is count the session answer is wrong
            } else {
                console.log("else")
                sessionStorage.clickcount = 1;
            }
            sendUsageStatus("singleattempt");

            //console.log("You have clicked the button " + sessionStorage.clickcount + " time(s) in this session.");
        } else {
            console.log("Sorry, your browser does not support web storage...");
        }
    } else {
        console.log("Inside reviewer mode !!!");
        window.location.reload();
    }
    // $('body').css('pointerEvents', 'auto');
}

//this function work user role student and failed Anchor activity 
function GoBackActivity() {
    console.log("went inside the GoBackActivity function");
    var subjectid = sessionStorage.getItem("slearnsubject");
    var slearn_user_current_conceptsummary = parent.backend_api_base + "slearn/getstudents/currentflooractivitysummary/subject/" + subjectid;
    var current_concept_completion_percentage;

    var header_var = {
        "Content-Type": 'application/json',
        "accept": 'application/json',
        "Authorization": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.session_key)) : '',
        "User-Info": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.user_id)) : ''
    }

    $.ajax({
        type: 'GET',
        headers: header_var,
        url: slearn_user_current_conceptsummary,
        success: function (data) {
            // console.log("response of slearn_user_current_conceptsummary : ", data.data[sessionStorage.getItem('selectedconcept')].concept_completion_percentage);
            if (sessionStorage.getItem("user_role") != "reviewer") {
                $("#studentModel").modal('toggle');
                if (data.data[sessionStorage.getItem('selectedconcept')]) {
                    if (data.data[sessionStorage.getItem('selectedconcept')].concept_completion_percentage > 0) {
                        $("#instruction").html('<p style="font-size:18px;">પ્રવૃત્તિ ફરીથી રમો. (કારણ કે તમે આ ક્ન્સેપ્ટ્ની આગળની બધી પ્રવૃત્તિઓ પૂર્ણ કરેલ છે. આગળ વધવા માટે આ પ્રવૃત્તિ ફરીથી રમીને સફળતા પૂર્વક પૂર્ણ કરો.)</p> <button type="button" class="btn btn-primary" onClick="goBetweenFirstOfTwoAnchorActivities()">ફરીથી રમો</button>');
                    } else {
                        $("#instruction").html('<p style="font-size:18px;">મને લાગે છે કે, તમારે પુનરાવર્તન કરવાની જરૂર છે, તેથી પુનરાવર્તનના બટન પર ક્લિક કરો.</p> <button type="button" class="btn btn-primary" onClick="goBetweenFirstOfTwoAnchorActivities()">પુનરાવર્તન</button>');
                    }
                } else {
                    $("#instruction").html('<p style="font-size:18px;">મને લાગે છે કે, તમારે પુનરાવર્તન કરવાની જરૂર છે, તેથી પુનરાવર્તનના બટન પર ક્લિક કરો.</p> <button type="button" class="btn btn-primary" onClick="goBetweenFirstOfTwoAnchorActivities()">પુનરાવર્તન</button>');
                }

            } else {
                console.log("Inside reviewer mode !!!");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("error loading response of slearn_user_current_conceptsummary : ");
        }
    });
}

function goBetweenFirstOfTwoAnchorActivities() {
    $("#studentModel").modal('toggle');
    sendUsageStatus("fail");
}

//this function work user role student and failed Non-Anchor activity after 2 or 3 attempt
function ConsultToTeacher() {
    $('body').css('pointerEvents', 'none');
    if (sessionStorage.getItem("user_role") != "reviewer") {
        console.log("Inside 3");
        sendUsageStatus("remedial");
    } else {
        console.log("Inside reviewer mode !!");
    }
}

// below function is added to show remedial 2 reminder message and force student to go to remedial 2 after 3.5 minutes
function openrem2reminderModal() {
    $("#remedial2button").trigger('click');
        
    // console.log("called openrem2reminderModalBody");
    // $("#corouselbody").html('<div id="myCarousel" class="carousel slide" data-ride="carousel"> તમે વિડિયો જોવા માટે <b>વધુ શીખો</b> પર ક્લિક કરો.</div>');
    // $("#remedial2button").addClass('blinkinganimation'); // this class is declared in bootstrap.min.css to add blinking animation to the button
}

function openRemedial() {
    rem2opentimeoutId = window.setTimeout(openrem2reminderModal, 210000); // remove comment for 3.5 minutes timeout  This timeout is added to remove remedial 1 after 3.5 minutes and show reminder to open remedial 2
    // rem2opentimeoutId = window.setTimeout(openrem2reminderModal, 4000); // This is just a test timeout of four seconds. comment it after testing

    /*	var corouselmodalvar = '<div id="courouselmodal" class="modal fade" data-backdrop="static" role="dialog">'
        + '<div class="modal-dialog modal-lg">'
        + '<div class="modal-content>'
        + '<div class="modal-header">'
        + '<h4 class="modal-title">પુનરાવર્તન કરો</h4>'
        + '</div>'
        + '<div class="modal-body" id="corouselbody" style="height:60vh">'
        + '</div>'
        + '<div class="modal-footer">'
        + '<button type="button" id="remedial2button" class="btn btn-success" onClick="loadNextRemedial()">Learn More</button>'
        + '<button type="button" class="btn btn-warining" onClick="playAgain()" data-dismiss="modal">ફરીથી રમવું</button>'
        + '</div>'
        + '</div></div></div>'
        $('body').append(corouselmodalvar);*/

    var baseurl = window.location.href;
    baseurl = baseurl.split("/");
    baseurl = baseurl[0] + "//" + baseurl[2];
    baseurl = baseurl.slice(0, baseurl.length - 4);
    var userinput = {};
    var pdfreferencenumber = "";
    var baseurl1 = baseurl + "9999/slearn/remedial/";
    pdfreferencenumber = sessionStorage.getItem("remedial_1");

    var loadhtml = baseurl1 + sessionStorage.getItem("subject") + "/" + pdfreferencenumber + "/index.html";
    $("#corouselbody").html('<object type="text/html" style="width:100%; height:100%" data="' + loadhtml + '"></object>');
    $("#myCarousel").attr("data-interval", "false");
    $("#courouselmodal").modal('toggle');
    parent.document.getElementById('backbutton').style.display = 'none';
    document.getElementById('playagainbtn').style.display = 'none';

    var header_var = {
        "Content-Type": 'application/json',
        "accept": 'application/json',
        "Authorization": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.session_key)) : '',
        "User-Info": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.user_id)) : ''
    }

    var baseurl = parent.backend_api_base + "slcore/util/timestamp";
    $.ajax({
        type: 'GET',
        headers: header_var,
        url: baseurl,
        success: function (data) {
            var servertime_start = Number(data.data.timestamp);
            sessionStorage.setItem("remedial1_duration", servertime_start);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('status' + xhr.status + " status text " + xhr.statusText + " response text " + xhr.responseText);
            // alert("Unable to get time stamp from server");
            //$("#goout",parent.document).click();
        },
        timeout: 5000
    });
    // $('body').css('pointerEvents', 'auto');
}

function loadNextRemedial() {
    window.clearTimeout(rem2opentimeoutId);
    $("#remedial2button").remove();
    var baseurl = window.location.href;
    baseurl = baseurl.split("/");
    baseurl = baseurl[0] + "//" + baseurl[2];
    baseurl = baseurl.slice(0, baseurl.length - 4);
    var userinput = {};
    var pdfreferencenumber = "";
    var baseurl1 = baseurl + "9999/slearn/remedial/";
    var video_link = baseurl1 + sessionStorage.getItem("subject") + "/" + sessionStorage.getItem("remedial_2") + ".mp4";

    var header_var = {
        "Content-Type": 'application/json',
        "accept": 'application/json',
        "Authorization": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.session_key)) : '',
        "User-Info": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.user_id)) : ''
    }

    var baseurl = parent.backend_api_base + "slcore/util/timestamp";
    $.ajax({
        type: 'GET',
        headers: header_var,
        url: baseurl,
        success: function (data) {
            var remedial1Usage = Number(data.data.timestamp) - Number(sessionStorage.getItem("remedial1_duration"));

            var remedialusagedata = JSON.stringify({
                "subject_id": Number(sessionStorage.getItem("slearnsubject")),
                "remedial_id": Number(sessionStorage.getItem("remedial_1")),
                "activity_id": Number(sessionStorage.getItem("selectedactivity")),
                "duration": remedial1Usage
            });
            var remedialUrl = parent.backend_api_base + "slearn/submit/student/remedialusage";
            $.ajax({
                type: 'POST',
                headers: header_var,
                url: remedialUrl,
                data: remedialusagedata,
                success: function (data1) {
                    sessionStorage.setItem("clickremedial2", "yes");
                    $("#corouselbody").html('<center><video id="rem_2_vid" style="width:60vw" controls disablePictureInPicture autoplay controlsList="nodownload"><source src="' + video_link + '" type="video/mp4" /></video></center>');
                    sessionStorage.setItem("remedial2_duration", data.data.timestamp);
                    sessionStorage.removeItem("remedial1_duration");

                    document.getElementById('rem_2_vid').addEventListener('ended', showplaybtnaftervideocompleted, false);

                    // below function is used to show play again(ફરીથી રમવું) button when remedial 2 video is completed playing.
                    function showplaybtnaftervideocompleted(e) {
                        document.getElementById('playagainbtn').style.display = 'block';
                        document.getElementById('playagainbtn').style.color = 'white';
                        document.getElementById('playagainbtn').style.animation = 'glowing 1500ms infinite';
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('status' + xhr.status + " status text " + xhr.statusText + " response text " + xhr.responseText);
                },
                timeout: 5000
            });

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('status' + xhr.status + " status text " + xhr.statusText + " response text " + xhr.responseText);
        },
        timeout: 5000
    });
}

function playAgain() {
    parent.document.getElementById('backbutton').style.display = 'block';
    var header_var = {
        "Content-Type": 'application/json',
        "accept": 'application/json',
        "Authorization": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.session_key)) : '',
        "User-Info": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.user_id)) : ''
    }


    var baseurl = parent.backend_api_base + "slcore/util/timestamp";
    $.ajax({
        type: 'GET',
        headers: header_var,
        url: baseurl,
        success: function (data) {

            if (sessionStorage.getItem("clickremedial2") == "yes") {
                // console.log("remedial2 send data")
                var remedial2Usage = Number(data.data.timestamp) - Number(sessionStorage.getItem("remedial2_duration"));

                var remedialusagedata = JSON.stringify({
                    "subject_id": Number(sessionStorage.getItem("slearnsubject")),
                    "remedial_id": Number(sessionStorage.getItem("remedial_2")),
                    "activity_id": Number(sessionStorage.getItem("selectedactivity")),
                    "duration": remedial2Usage
                });
                sessionStorage.removeItem("clickremedial2");
            } else {
                // console.log("remedial1 send data")
                var remedial1Usage = Number(data.data.timestamp) - Number(sessionStorage.getItem("remedial1_duration"));

                var remedialusagedata = JSON.stringify({
                    "subject_id": Number(sessionStorage.getItem("slearnsubject")),
                    "remedial_id": Number(sessionStorage.getItem("remedial_1")),
                    "activity_id": Number(sessionStorage.getItem("selectedactivity")),
                    "duration": remedial1Usage
                });
            }

            var remedialUrl = parent.backend_api_base + "slearn/submit/student/remedialusage";
            $.ajax({
                type: 'POST',
                headers: header_var,
                url: remedialUrl,
                data: remedialusagedata,
                success: function (data1) {
                    sessionStorage.removeItem("remedial1_duration");
                    sessionStorage.removeItem("remedial2_duration");
                    $("#courouselmodal").modal('toggle');
                    $("#courouselmodal").remove();
                    window.location.reload();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('status' + xhr.status + " status text " + xhr.statusText + " response text " + xhr.responseText);
                },
                timeout: 5000
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('status' + xhr.status + " status text " + xhr.statusText + " response text " + xhr.responseText);
        },
        timeout: 5000
    });
}

function NextLevelCouterReset() {
    sessionStorage.clickcount1 = 0;
    sessionStorage.clickcount = 0;
}

function proceedToNextLevel() {
    if (sessionStorage.getItem("user_role") != "reviewer" && sessionStorage.getItem("user_role") == "student") {
        console.log("Inside 4");
        $('#loadingNextActivity').html('<img src="../assets/loading_slearn.gif">');
        $('.modal-footer').hide();
        sendUsageStatus("pass");
    } else {
        window.location.reload();
    }
}


//this function send back-end student status pass, failed , remedial
function sendUsageStatus(statusoflevel) {
    sessionStorage.removeItem('anchor_pass');
    console.log("is anchor or not :", JSON.parse(sessionStorage.getItem("requestors_next_activity")).is_anchor);
    sessionStorage.setItem("current_activity_is_anchor", JSON.parse(sessionStorage.getItem("requestors_next_activity")).is_anchor);
    
    //this variable send ajax header Authorization, session_key
    var header_var = {
        "Content-Type": 'application/json',
        "accept": 'application/json',
        "Authorization": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.session_key)) : '',
        "User-Info": (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.user_id)) : ''
    }

    var getSubjectTime = parent.slearn_backend_api + "getstudents/weeklysubjectusagesummary";
    $.ajax({
        type: 'GET',
        headers: header_var,
        url: getSubjectTime,
        success: function (data2) {
            var slearn_config = JSON.parse(sessionStorage.getItem("slearn_config"));
            var subject_usage_limitation = slearn_config.subject_usage_limitation;
            var student_standard = String(JSON.parse(localStorage.getItem('loginresponse')).student_detail.standard_id);
            var subjectid = sessionStorage.getItem("slearnsubject");
            var weekely_subject_usage_limit = Number(subject_usage_limitation[subjectid][student_standard].duration_usage_limit);
            var actual_usage = (data2.data.hasOwnProperty(subjectid) == true) ? Number(data2.data[subjectid].duration) : 0;
            if (actual_usage < weekely_subject_usage_limit) {

                var baseurl = parent.backend_api_base + "slcore/util/timestamp";
                $.ajax({
                    type: 'GET',
                    headers: header_var,
                    url: baseurl,
                    success: function (data) {
                        var stoptime = Number(data.data.timestamp);
                        var duration = stoptime - Number(sessionStorage.getItem("activity_start_time"));
                        var usagedata = {};
                        if (statusoflevel == "pass") {
                            usagedata = JSON.stringify({
                                "subject_id": Number(sessionStorage.getItem("slearnsubject")),
                                "activity_id": Number(sessionStorage.getItem("selectedactivity")),
                                "duration": duration,
                                "status": "pass",
                                "is_repeat": sessionStorage.getItem("activity_is_repeat")
                            });
                        } else if (statusoflevel == "fail" || statusoflevel == "singleattempt" || statusoflevel == "remedial") {
                            usagedata = JSON.stringify({
                                "subject_id": Number(sessionStorage.getItem("slearnsubject")),
                                "activity_id": Number(sessionStorage.getItem("selectedactivity")),
                                "duration": duration,
                                "status": "fail",
                                "is_repeat": sessionStorage.getItem("activity_is_repeat")
                            });
                        }

                        console.log(usagedata);

                        var send_usage_data = parent.slearn_backend_api + "submit/student/activityusage";
                        $.ajax({
                            type: 'POST',
                            headers: header_var,
                            url: send_usage_data,
                            data: usagedata,
                            contentType: "application/json;charset=utf-8",
                            success: function (data1) {
                                if (statusoflevel == "pass" || statusoflevel == "fail") {
                                    sessionStorage.setItem('anchor_pass_or_not', statusoflevel);
                                    NextLevelCouterReset();
                                    $("#backbutton", parent.document).click();
                                } else if (statusoflevel == "singleattempt") {
                                    sessionStorage.setItem("activity_start_time", stoptime);
                                    console.log("User failed first time !!");
                                    window.location.reload();
                                } else if (statusoflevel == "remedial") {
                                    sessionStorage.setItem("activity_start_time", stoptime);
                                    console.log("user opened remedial!!");
                                    openRemedial();
                                    NextLevelCouterReset();
                                }
                                $("#successmodal").modal('hide');
                                $('body').css('pointerEvents', 'auto');
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                console.log('status' + xhr.status + " status text " + xhr.statusText + " response text " + xhr.responseText);
                                console.log("Unable to send activity usage data to server");
                                //$("#goout",parent.document).click();
                                console.log("Unable to send activity usage data to server");
                                $("#successmodal").modal('hide');
                                // window.alert("unable to connect to wifi so unable to send data");
                                window.location.reload();
                            },
                            timeout: 5000
                        });

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log('status' + xhr.status + " status text " + xhr.statusText + " response text " + xhr.responseText);
                        alert("Unable to get time stamp from server");
                        //$("#goout",parent.document).click();
                        console.log("Unable to get time stamp from server");
                        $("#successmodal").modal('hide');
                    },
                    timeout: 5000
                });


            } else {
                alert("Your weekly usage limit for the subject is over. Please select other subject.");
                $("#gotosubject", parent.document).click();
                $("#successmodal").modal('hide');
            }


        }, error: function (xhr, ajaxOptions, thrownError) {
            console.log('status' + xhr.status + " status text " + xhr.statusText + " response text " + xhr.responseText);
            alert("Unable to get weekly usage data");
            //$("#goout",parent.document).click();
            $("#successmodal").modal('hide');
            console.log("Unable to get weekly usage data");
            window.location.reload();
        },
        timeout: 5000
    });
}



