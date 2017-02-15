angular.module('app.controllers', [])
  
.controller('pageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    window.localStorage.setItem("globalScore", 0);


}])

.controller('flappybirdCtrl', ['$scope', '$stateParams', '$ionicPopup', '$timeout' , '$location',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicPopup, $timeout, $location) {


$scope.showPopup = function() {
  $scope.data = {};
  var scoreNow =  window.localStorage.getItem("globalScore");


  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: 'Voce ganhou '+ scoreNow + ' bitcoins',
    title: 'Fim da coleta!',
    scope: $scope,
    buttons: [
      {
        text: '<b>Ir para curso</b>',
        type: 'button-assertive',
        onTap: function(e) {
         
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          	$location.path('/homeCourse');
          	myPopup.close();
        }
      }
    ]
  });

 

 };







var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {

    preload: function() {
        game.stage.backgroundColor = '#71c5cf';

        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');

        // Load the jump sound
        game.load.audio('jump', 'assets/jump.wav');

        game.load.image('jumpbutton', 'assets/jump.png');
    },

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        // New anchor position
        this.bird.anchor.setTo(-0.2, 0.5);

        var jumpbutton = game.add.button(game.world.centerX - 40, 420, 'jumpbutton', this.jump, this, 2, 1, 0);

        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

        // Add the jump sound
        this.jumpSound = this.game.add.audio('jump');
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        // Slowly rotate the bird downward, up to a certain point.
        if (this.bird.angle < 20)
            this.bird.angle += 1;
    },

    jump: function() {
        // If the bird is dead, he can't jump
        if (this.bird.alive == false)
            return;

        this.bird.body.velocity.y = -350;

        // Jump animation
        game.add.tween(this.bird).to({angle: -20}, 100).start();

        // Play sound
        this.jumpSound.play();
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restartGame: function() {
    	if(this.score==0){

    		game.state.start('main');
    	}else{
    		game.destroy();
    		$scope.showPopup();
    	}
    	
        
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        var aux = 0;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1)
                this.addOnePipe(400, i*60+10);

        this.score += 1;
        // RDNS
        aux = parseInt(window.localStorage.getItem("globalScore")) + 1;
        window.localStorage.setItem("globalScore", aux);
        this.labelScore.text = this.score + " b$";
    },
};

game.state.add('main', mainState);
game.state.start('main');



}])


.controller('page2Ctrl', ['$scope', '$stateParams', '$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $location) {


    $scope.bitcoinsTotal = window.localStorage.getItem("globalScore") + ' b$';
    var allCourses = JSON.parse(window.localStorage.getItem("courses"));
    var currentProgress = JSON.parse(window.localStorage.getItem("progress"));
    var currentCourse = allCourses[currentProgress["course"]];
    var currentClass = currentCourse["questions"][currentProgress["class"]];
    
    $scope.currentCourse = currentCourse["name"];
    $scope.currentQuestion = currentClass["question"];
    $scope.allAnswers = currentClass["answers"];
    console.log(currentClass);
    $scope.answer0 = currentClass["answers"][0];
    $scope.answer1 = currentClass["answers"][1];
    $scope.answer2 = currentClass["answers"][2];
    $scope.answer3 = currentClass["answers"][3];

    $scope.settings = {};
      $scope.submitForm = function(){

        if($scope.settings.id==undefined){
            alert("selecione uma alternativa");
        }else{
            if($scope.settings.id != currentClass["rightAnswer"]){
                window.localStorage.setItem("respostaCerta", 0);
                $location.path('/acertoPage');
            }else{
                
                currentProgress["class"] +=1;
                window.localStorage.setItem("progress", JSON.stringify(currentProgress));
                var test = JSON.parse(window.localStorage.getItem("progress"));
                console.log(test);
                window.localStorage.setItem("respostaCerta", 1);
                // window.location.reload(true);
                 $location.path('/acertoPage');

            }
        }

       
   };




}])
 

.controller('acertoPageCtrl', ['$scope', '$stateParams', '$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $location) {


    var flag = parseInt(window.localStorage.getItem("respostaCerta"));
    var goToQuestionPage = true;
    var currentScore = parseInt(window.localStorage.getItem("globalScore")); 
    var statusResposta ="";
    var descResposta ="";
    var buttonText ="";
    if(flag==1){
        statusResposta = "Acertou!";
        currentScore +=1;
        window.localStorage.setItem("globalScore", currentScore);
        descResposta = "Ganhe um bitcoin e avance para a proxima pergunta! Seu saldo agora é de: "+ currentScore + "b$";
        buttonText = "Proxima pergunta";
    }else{
        statusResposta = "Errou!";
        if(currentScore>0){
            currentScore = currentScore -1;
            window.localStorage.setItem("globalScore", currentScore);
            descResposta = "Voce perdeu um bitcoin por causa da resposta errada. Seu saldo agora é de: "+ currentScore + "b$";
            buttonText = "Tentar novamente";

        }else{
            descResposta = "Você não tem mais bitcoins! Por favor minere mais com o flappybit para dar continuidade ao curso.";
            buttonText = "Mineirar";
            goToQuestionPage = false;
        }
    }

    $scope.statusResposta = statusResposta;
    $scope.descResposta = descResposta;
    $scope.buttonText = buttonText;


    


        $scope.nextQuestion = function(){

            if(goToQuestionPage){
                $location.path('/page2');
            }else{
                $location.path('/flappybird');
            }
            
         
      }



}]) 


.controller('homeCourseCtrl', ['$scope', '$stateParams','$ionicPopup', '$location',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicPopup, $location) {



    // var div = document.getElementById('bitcoinsTotal');

    // div.innerHTML = window.localStorage.getItem("globalScore") + ' b$';
    $scope.bitcoinsTotal = window.localStorage.getItem("globalScore") + ' b$';
    var allCourses = JSON.parse(window.localStorage.getItem("courses"));
    var currentProgress = JSON.parse(window.localStorage.getItem("progress"));
    var currentCourse = allCourses[currentProgress["course"]];
    console.log(allCourses);
    $scope.allCourses = allCourses;
    $scope.className = currentCourse["name"];
    $scope.short_description = currentCourse["short_description"];
    // this.bitcoinsTotal  = window.localStorage.getItem("globalScore") + ' b$';

$scope.showPopupCourse = function() {

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: 'Você hoje esta no level ' + currentProgress["course"] + ', aula ' + currentProgress["class"],
    title: 'Faça as aulas anteriores! ',
    scope: $scope,
    buttons: [
      {
        text: '<b>Ok</b>',
        type: 'button-assertive',
        onTap: function(e) {
         
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
            myPopup.close();
        }
      }
    ]
  });

 

 };


        $scope.courseManager = function(i){
        
        console.log(i);
        if(currentProgress["course"] != i){
            $scope.showPopupCourse();
        }else{
            $location.path('/page2');

        }
         
      }


}])
 