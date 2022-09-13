function start(){
   
    $("#inicio").hide();

    $("#fundo-game").append("<div id='jogador' class='anima1'></div>")
    $("#fundo-game").append("<div id='inimigo1' class='anima2'></div>")
    $("#fundo-game").append("<div id='inimigo2'></div>")
    $("#fundo-game").append("<div id='amigo' class='anima3'></div>")
    $("#fundo-game").append("<div id='placar'></div>");
    $("#fundo-game").append("<div id='energia'></div>");

    var jogo = {}; // principais variáveis do jogo
    var fimdeJogo = false;
    var energiaAtual = 3;
    var pontos = 0;
    var salvos = 0;
    var perdidos =0;
    var podeAtirar = true;
    var velocidade = 5;
    var posicaoY = parseInt(Math.random()*334)
    var TECLA = {
        W:87,
        S:83,
        L:76
    }

    jogo.pressionou = []; //verifica se o jogador pressionou alguma tecla

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameOver = document.getElementById("somGameOver");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //Música continua
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();
   
    $(document).keydown(function(e){
        jogo.pressionou[e.which]=true;
    });
   
    $(document).keyup(function(e){
        jogo.pressionou[e.which]=false;
    });

    jogo.timer = setInterval(loop,30); // game loop

    function loop() {

        moveFundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();

    } //fim função loop

    function moveFundo(){
        esquerda = parseInt($("#fundo-game").css("background-position"));
        $("#fundo-game").css("background-position", esquerda - 1);
    }

    function moveJogador(){
        if(jogo.pressionou[TECLA.W]){                       //helicoptero sobe
            var topo = parseInt($("#jogador").css("top"));
            if(topo >= 10){
                $("#jogador").css("top",topo - 10);
            }
        }
        if(jogo.pressionou[TECLA.S]){                       //helicoptero desce
            var topo = parseInt($("#jogador").css("top"));
            if(topo <= 400){
                $("#jogador").css("top",topo + 10);
            }
        }
        if(jogo.pressionou[TECLA.L]){                       //helicoptero atira
            disparo();
        }
    }

    function moveInimigo1(){
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX-velocidade);
        $("#inimigo1").css("top",posicaoY);

        if(posicaoX <= 0){
            posicaoY = parseInt(Math.random()*334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }    
    }

    function moveInimigo2(){
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",posicaoX - 3);
    
        if(posicaoX <= 0){
            $("#inimigo2").css("left",775);
        }
    }

    function moveAmigo(){
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX + 1);

        if(posicaoX > 906){
            $("#amigo").css("left",0);
        }
    }

    function disparo(){

        if(podeAtirar == true){
            
            somDisparo.play();
            podeAtirar = false;

            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundo-game").append("<div id='disparo'></div>");
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);

            var tempoDisparo = window.setInterval(executaDisparo,30);
        }

        function executaDisparo(){
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX + 15);

            if(posicaoX > 900){
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    function colisao(){
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#amigo").collision($("#jogador")));
        var colisao6 = ($("#amigo").collision($("#inimigo2")));

        if (colisao1.length > 0){

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);

            posicaoY = parseInt(Math.random()* 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);

            energiaAtual--;
            somExplosao.play();
        }

        if (colisao2.length > 0){

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);

            $("#inimigo2").remove();
            reposicionaInimigo2();

            energiaAtual -= 2;
            somExplosao.play();
        }

        if (colisao3.length > 0){

            pontos += 100;
            velocidade += 0.3;

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950);

            posicaoY = parseInt(Math.random()* 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);

            somExplosao.play();
        }

        if (colisao4.length > 0){

            pontos += 100;

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);

            $("#disparo").css("left",950);
            $("#inimigo2").remove();
            reposicionaInimigo2();

            somExplosao.play();
        }

        if (colisao5.length > 0){

            salvos++;

            reposicionaAmigo();
            $("#amigo").remove();

            somResgate.play();
        }

        if (colisao6.length > 0){

            perdidos++;

            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            
            reposicionaAmigo();
            $("#amigo").remove();

            somPerdido.play();
        }
    }

    function explosao1(inimigo1X,inimigo1Y){
        
        $("#fundo-game").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image","url(/imgs/explosao.png");
        var div = $("#explosao1");
        div.css("left", inimigo1X);
        div.css("top", inimigo1Y);
        div.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

            function removeExplosao() {
                div.remove();
                window.clearInterval(tempoExplosao);
                tempoExplosao = null;
            }
    }

    function explosao2(inimigo2X,inimigo2Y){
        
        $("#fundo-game").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image","url(/imgs/explosao.png");
        var div2 = $("#explosao2");
        div2.css("left", inimigo2X);
        div2.css("top", inimigo2Y);
        div2.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

            function removeExplosao2() {
                div2.remove();
                window.clearInterval(tempoExplosao2);
                tempoExplosao2 = null;
            }
    }

    function explosao3(amigoX,amigoY){
        
        $("#fundo-game").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3").css("left",amigoX);
        $("#explosao3").css("top",amigoY);
        
        var tempoExplosao3 = window.setInterval(removeExplosao3, 1000);

            function removeExplosao3() {
                $("#explosao3").remove();
                window.clearInterval(tempoExplosao3);
                tempoExplosao3 = null;
            }
    }

    function reposicionaInimigo2(){

        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;
            
            if (fimdeJogo == false){
                $("#fundo-game").append("<div id='inimigo2'></div>");
            }
        }
    }

    function reposicionaAmigo(){

        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6(){
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
        
            if (fimdeJogo == false){
                $("#fundo-game").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }

    function placar(){

        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    function energia(){

        if(energiaAtual == 3){
            $("#energia").css("background-image","url(/imgs/energia3.png)");
        } else if(energiaAtual == 2) {
            $("#energia").css("background-image","url(/imgs/energia2.png)");
        } else if(energiaAtual == 1) {
            $("#energia").css("background-image","url(/imgs/energia1.png)");
        } else {
            $("#energia").css("background-image","url(/imgs/energia0.png)");
            gameOver();
        }
    }

    function gameOver(){
        fimdeJogo = true;
        musica.pause();
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        $("#fundo-game").append("<div id='fim'></div>");
        $("#fim").html("<h1>Game Over</h1><p>Pontuação final: " + pontos + "</p>"
        + "<p>Amigos salvos: " + salvos + "</p><p>Amigos perdidos: " + perdidos + "</p>"
        + "<p>&nbsp;</p><div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>")
    }

} // fim função start

function reiniciaJogo(){
    somGameOver.pause();
    $("#fim").remove();
    start();
}