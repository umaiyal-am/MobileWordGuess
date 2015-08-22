/* 
 * Student Info: Name=Umaiyal Arcot Murugesan, ID=13128
 * Subject: CS557B_HW4_Summer_2015
 * Author: Umai
 * Filename: application.js
 * Date and Time: Aug 9, 2015 2:33:40 PM
 * Project Name: MobileWordGuess
 */
$(function() {
// define the application
    var NoteTaker = {};
    
    var jumbledWords = ["PALPE",
           //     "YGAXAL",
         //       "ENTTARGAVXA",
                 "DAN",
                 "PNA",
         //       "TPIJURE",
                "ARHET"
             ];
    var words =["APPLE",
            //    "GALAXY",
           //     "EXTRAVAGANT",
                    "AND",
                    "PAN",
           //     "JUPITER",
                "HEART"
             ];

    var correctWord="";
    var timerInterval;
    var timerFunc;
    var startDate;
    var endDate;
    var startDateStr;
    var endDateStr;
    var gameOver = false;
    
    (function(app) {
        
        app.init = function() {
            // stuff in here runs first
            app.bindings();
        };
        app.bindings = function() {
            $('#btnLogin').on('click', function(e) {
                e.preventDefault();
                // save the note
                app.login();
            });

            $('#btnRegister').on('click', function(e) {
                e.preventDefault();
                // save the note
                app.addUser();
            });
            
            $('#newBt').on('click', function(e) {
                e.preventDefault();
                // save the note
                app.newGame();
            });
            
            $('#quitBt').on('click', function(e) {
                e.preventDefault();
                // save the note
                app.quitGame();
            });
            
            $('#btnContact').on('click', function(e) {
                e.preventDefault();
                // save the note
                app.contact();
            });
            
            $(document).on("pageshow","#pageLogs",function(){
              app.showLogs();
            });
            
            $(document).on("pageshow", "#pageContact", function () {
               app.showContacts(); 
            });
            
            $(document).on("pageshow","#pageChart",function(){
        
                var lineChartData = {
                        labels : ["Game 1","Game 2","Game 3","Game 4","Game 5","Game 6","Game 7"],
                        datasets : [
                                {
                                        label: "My dataset",
                                        fillColor : "rgba(0,0,0,0.8)",
                                        strokeColor : "rgba(151,187,205,1)",
                                        pointColor : "rgba(151,187,205,1)",
                                        pointStrokeColor : "#fff",
                                        pointHighlightFill : "#fff",
                                        pointHighlightStroke : "rgba(151,187,205,1)",
                                        data : app.randomScalingFactor()
                                }
                        ]

                };                
		var ctx = document.getElementById("canvas").getContext("2d");
		window.myLine = new Chart(ctx).Line(lineChartData, {
			responsive: true, scaleFontColor: "#000000", scaleFontSize: 18});
            });
            
                var letter = '';
            $(document).on('click', '.pickButton', function (e) {
                e.preventDefault();
                if (letter == '') {
                    $(this).addClass('pickElement');
                    letter = $(this).text();
                }
                else {
                    alert('Choose pick letter and then drop letter');
                }
            });

            $(document).on('click', '.dropButton', function (e) {
                e.preventDefault();
                if (letter == '') {
                    alert('Choose pick letter and then drop letter');
                }
                else {
                     $(this).text(letter);
                     var pickElem = $('.pickElement');
                     if (pickElem !== "undefined" && pickElem.length > 0) {
                         letter = '';
                         $(pickElem).html('&nbsp;');
                         $(pickElem).removeClass('pickElement');
                         app.checkIfGameOver();
                     }
                }
            });             
        };
        
        app.showContacts = function() {
                
            navigator.contacts.find(
            [navigator.contacts.fieldType.displayName],
            app.getContacts,
            errorHandler);
        };
        
        app.showContactsError = function() {
            alert('error show contacts');
        };
        
        app.getContacts = function(c) {
            
            alert("gotContacts, number of results "+ c.length);
            
            if (c != null && c.length > 0) {
                var tableBody = document.getElementById("contactTable").getElementsByTagName('tbody')[0];
                tableBody.innerHTML = "";
                
                for (var i = 0; i < c.length; i++) {
                    var row = tableBody.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
            
                    cell1.innerHTML = c[i].displayName;
                    cell2.innerHTML = c[i].email[0].value;
                }
            }            
        };
        
        app.contact = function() {

            var user= 
                   {
                     fName: document.getElementById("rtxtFirstName").value,
                     lName: document.getElementById("rtxtLastName").value
                     //,email:document.getElementById("rtxtEmail").value
                   };
                   
            var contact = navigator.contacts.create();
            //Populate the contact object with values
            contact.displayName = user.fName + ' ' + user.lName;
            contact.nickname = user.fName;    
            var tmpName = new ContactName();
            tmpName.givenName = user.fName;
            tmpName.familyName = user.lName;
            tmpName.formatted = user.fName + ' ' + user.lName;
            contact.name = tmpName;            
            
            var dt = new Date();
            user.email = dt.getHours() + dt.getMinutes() + dt.getSeconds() + '@test.com';
            
            //Populate Email Address the same way that you did the
            //phone numbers
            var emailAddresses = [1];
            emailAddresses[0] = new ContactField('home', user.email, true);
            contact.emails = emailAddresses;
            // save the contact object to the device's contact database
            contact.save(app.onContactSaveSuccess, app.onContactSaveError);            
        };
        
        app.onContactSaveSuccess = function () {
            alert('save success');
        };
        
        app.onContactSaveError = function () {
            alert('save error');
        };        
        
        app.randomScalingFactor = function(){ 
            var userLogs = JSON.parse(localStorage.getItem("logs"));
            var timerArray = [];

            if (userLogs != null) {
                for(var i = 0; i < userLogs.length; i++) {
                    timerArray.push(userLogs[i].time);
                }
            }
            return timerArray;
        };        
        
        app.showLogs = function() {
            var logs = JSON.parse(localStorage.getItem("logs"));
    
            if (logs != null) {
                var tableBody = document.getElementById("logTable").getElementsByTagName('tbody')[0];
                tableBody.innerHTML = "";
                
                for (var i = 0; i < logs.length; i++) {
                    var row = tableBody.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
            
                    cell1.innerHTML = logs[i].name;
                    cell2.innerHTML = logs[i].startDate;
                    cell3.innerHTML = logs[i].endDate;
                    cell4.innerHTML = logs[i].word;
                    cell5.innerHTML = logs[i].result;
                }
            }
        };
        
        app.clearExistingGame = function() {
            document.getElementById("picks").innerHTML = "";
            document.getElementById("drops").innerHTML = "";    
        };
        
        app.startNewGame = function() {
            var user = app.getLoggedInUser();

            if (user == null) {
                alert("You are not logged in");
                return;
            }
            $("#picks").show();
            $("#drops").show();
            app.clearExistingGame();
            gameOver = false;
            var jumbledWordIndex = Math.floor(Math.random() * words.length);
            var word = jumbledWords[jumbledWordIndex];
            correctWord = words[jumbledWordIndex];
            var wordLength = word.length;

            var divPicks = document.getElementById("picks");
            var divDrops = document.getElementById("drops");
            
            var divPick = '<fieldset id="fieldSetPick" data-role="controlgroup" data-type="horizontal" class="custom-fieldset">';
            var divDrop = '<fieldset id="fieldSetDrop" data-role="controlgroup" data-type="horizontal" class="custom-fieldset">';
            
            for (var i = 0; i < wordLength; i++) {
                divPick += '<a class="pickButton" data-role="button" id="pick' + i + '" value="'+ word[i] + '" >' + word[i] + '</a>';
                divDrop += '<a data-role="button" class="dropButton" id="drop' + i + '" value="" >&nbsp;</a>';
            }
            divPick += '</fieldset>';
            divPicks.innerHTML = divPick;
            divDrop += '</fieldset>';
            divDrops.innerHTML = divDrop;
            $('#pageGame').trigger("create");
        };
        
        
        app.checkIfGameOver = function(isTimer) {
            var won = false;

            var finalLetterEl = $('.dropButton');
            
            if (finalLetterEl.length > 0) {
                var finalWord = "";
                for(var i = 0; i < finalLetterEl.length; i++) {
                    finalWord += finalLetterEl[i].text;
                }
                
                if (correctWord == finalWord) {            
                    won = true;
                }
            }
        
            if(won) {
                endDate = new Date();
                endDateStr = app.getFormattedDate(endDate); 
                clearInterval(timerFunc);   
                alert("Won");
                var timeDiff = parseFloat(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60), 10).toFixed(2);
                app.logUser(won, correctWord, startDateStr, endDateStr, timeDiff);

            }
            else if(isTimer && !won && gameOver == false) {
                alert("Lost");
                var timeDiff = parseFloat(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60),10).toFixed(2);
                app.logUser(won, correctWord, startDateStr, endDateStr, timeDiff);
            }
        };
        
        app.getFormattedDate = function(date) {
            return (date.getMonth() + 1) + "/" + date.getDate() + "/" + 
                    date.getFullYear() + " " + 
                    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(); 
        };
        
        app.newGame = function() {
            app.startNewGame();
            timerInterval = 180000;
            timerFunc = setInterval(function(){app.updateTimerDiv()}, 1000);
            document.getElementById("timer").style.display = "inline"; 
            startDate = new Date();
            startDateStr = app.getFormattedDate(startDate);
        };
        
        app.quitGame = function() {
            clearInterval(timerFunc);
            app.clearExistingGame();
        };
        
        app.updateTimerDiv = function() {
            timerInterval = timerInterval - 1000;

            if (timerInterval <= 0 && gameOver == false) {
                clearInterval(timerFunc);
                endDate = new Date();
                endDateStr = app.getFormattedDate(endDate);        
                app.checkIfGameOver(true);
                gameOver = true;
                timerInterval = 0;
            }    

           var ms = timerInterval,
           min = (ms/1000/60) << 0,
           sec = (ms/1000) % 60;

           var timerDiv = document.getElementById("timer");
           timerDiv.value = min + ":" + sec;
           //timerDiv.visibility = "";
        };
        
        app.login = function() {
            var uName= document.getElementById("txtUserName").value;
            var pwd =  document.getElementById("txtPassword").value;

            var user= app.getUser(uName);
            if(user instanceof Object) {
                if(user.pwd == pwd) {
                    alert("Welcome "+ uName);
                    app.setLoggedInUser(uName);
                }
                else{
                    alert("Incorrect password");
                }
            }
            else {
                alert("Unauthorized User. Need to Register?");
            } 
        };
        
        app.getLoggedInUser = function() {
            var logUser=localStorage.getItem("logged_user");
            return logUser;
        };

        app.setLoggedInUser = function(uName) {
            localStorage.setItem("logged_user",uName);
        };
        
        app.logUser = function(won, word, startDateStr, endDateStr, timeTaken) {
            var loggedInUser = app.getLoggedInUser();

            var loggedInUserInfo = app.getUser(loggedInUser);

            var logs = JSON.parse(localStorage.getItem("logs"));

            if (logs == null) {
                logs = [];
            }

            var logUserInfo = {
                name: loggedInUserInfo.fName + " " + loggedInUserInfo.lName,
                startDate: startDateStr,
                endDate: endDateStr,
                word: word,
                result: won == true ? "Won" : "Lost",
                time: timeTaken
            };

            logs.push(logUserInfo);

            localStorage.setItem("logs", JSON.stringify(logs));
        };        
        
        app.getUsers = function () {
            var temp= localStorage.getItem("users");
            return JSON.parse(temp);
        };
        
        app.setUsers = function(usersArray){
            var tempUserArray = JSON.stringify(usersArray);
            localStorage.setItem("users", tempUserArray);
        };
        
        app.setUser = function (uname,userInfo) {
            var tempUserArray = JSON.stringify(userInfo);
            localStorage.setItem("user_"+uname, tempUserArray);
        };
        
        app.getUser = function (uname) {
          var temp= localStorage.getItem("user_"+uname);
          return JSON.parse(temp);
        };
        
        app.addUser = function () {
            var user= 
                   {
                     fName: document.getElementById("rtxtFirstName").value,
                     lName: document.getElementById("rtxtLastName").value,
                     pwd:document.getElementById("rtxtPassword").value,
                     email:document.getElementById("rtxtEmail").value
                   };
                   
                $("input[name*=registerGender]:checked").each(function() {
                    user.gender = $(this).val();
                });
            
                 var uName= document.getElementById("rtxtUserName").value; 

                 if(app.getUser(uName) instanceof Object) { 
                     alert("User Name already exists");
                 }
                 else {
                     app.setUser(uName,user);
                      alert("Registration Successful");
                     app.clearField();
                 }
        };
        
        app.clearField = function () {
            document.getElementById("rtxtFirstName").value="";
            document.getElementById("rtxtLastName").value="";
            document.getElementById("rtxtPassword").value="";
            document.getElementById("rtxtEmail").value="";
            document.getElementById("rtxtUserName").value="";
            var ele=document.getElementsByName("registerGender");
             for(var i=0;i<ele.length;i++) {
              ele[i].checked = false;
            }
        };
            
        app.init();
        
    })(NoteTaker);
});

