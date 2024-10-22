// Seleciona o canvas e define seu contexto 2D
const canvas = document.getElementById('screen-draw');
const ctx = canvas.getContext('2d');
let corAresta= 'yellow';
let corPreenchimento;
//cria pontos e listas
var listaPontos = [];
var listaPoli=[];
var cont = 0;
var contPoli = 0;

// Define o tamanho do canvas igual no CSS
canvas.width = 900;
canvas.height = 700;

//escolhendo a cor das arestas
document.getElementById('color-form-aresta').addEventListener('submit', function(event){
    event.preventDefault();
    var cor = document.getElementById('color-aresta').value;
    corAresta = cor;

});

//escolhendo a cor dos poligonos
document.getElementById('color-form-Poli').addEventListener('submit', function(event){
    event.preventDefault();
    var corP = document.getElementById('color-Poli').value;
    corPreenchimento = corP;
});

// Função para desenhar um ponto no canvas
function drawPoint(x, y) {
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2); 
    ctx.fillStyle = corAresta;
    ctx.fill();
 
}

// Adiciona um evento de clique ao canvas
canvas.addEventListener('click', function(event) {

    // Calcula a posição do clique no canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    //cria ponto e adiciona na lista de pontos 
    let ponto = new Object();
    ponto.x = x;
    ponto.y = y;
    listaPontos.push(ponto);
    // Desenha o ponto na posição clicada
    drawPoint(x, y);
});

//liga os pontos com arestas
canvas.addEventListener('click', function(){
    if(listaPontos.length >= 2){
        ctx.beginPath();
        ctx.moveTo(listaPontos[cont].x, listaPontos[cont].y)
        ctx.lineTo(listaPontos[cont+1].x, listaPontos[cont+1].y)
        ctx.strokeStyle = corAresta;
        ctx.stroke();
        cont++;
    }
})

//fechando o poligono e acionando as funções de calculo e pintura
document.getElementById('close-poli').addEventListener('click', function (){

    if(corPreenchimento){
        if(listaPontos.length >= 3){
            ctx.beginPath();
            ctx.moveTo(listaPontos[cont].x, listaPontos[cont].y);
            ctx.lineTo(listaPontos[0].x, listaPontos[0].y)
            ctx.stroke();
            createPoli(); // cria os poligonos e adiciona os pontos para um objeto Poli
            cont=0;
            createInf( listaPoli[contPoli-1], contPoli-1); //cria as informações na tela html
            fillPolly(listaPoli[contPoli-1]); //faz os de todos os calculos de scanline mas sem a pintura 
            paintPoli(listaPoli[contPoli-1]); // faz as pinturas do poligono caluculado 
        }else{
            alert('adicione mais um vertice')
        }
    }else{
        alert('Escolha a cor de corPreenchimento')
    }
    

})

//remove o poligono da tela
function removePoli(numero) { 
    PoligonoEmRemocao = listaPoli[numero];
    PoligonoEmRemocao.corPreenchimento = 'white';
    clearALL();
    listaPoli.splice(numero, 1)
    redrawAR();
    contPoli--;
    paintALL();
}

//criando um Poligono
function createPoli(){
    contPoli++;
    var poli = new Object();
    poli.num = contPoli;
    poli.vertices = [];
    poli.vertices = [...listaPontos];
    poli.corPreenchimento = corPreenchimento;
    poli.corAresta = corAresta;
    
    poli.Ymax = poli.vertices.reduce(function (a, b) {
        return (b.y > a.y) ? b : a;
    });
    
    poli.Ymin = poli.vertices.reduce(function (a, b) {
        return (b.y < a.y) ? b : a;
    });

    poli.Xmin = poli.vertices.reduce(function (a, b) {
        return (b.x < a.x) ? b : a;
    });

    poli.Xmax = poli.vertices.reduce(function (a, b) {
        return (b.x > a.x) ? b : a;
    });

    poli.scanlines = poli.Ymax.y - poli.Ymin.y;

    listaPoli.push(poli);
    console.log(poli);
    clearListaPontos();
    
}
//cria as informações na tela dos poligonos
function createInf(Poli, i){
    if(!document.getElementById('list-Poli')){
        var ListPoli = document.createElement('div')
        ListPoli.id = 'list-Poli';
        const contP = document.getElementById('cont-Poli')
        contP.appendChild(ListPoli)
    }
    var ListPoli = document.getElementById('list-Poli');
    var NewPoli = document.createElement('form');
    
    NewPoli.classList.add('card');
    NewPoli.id='cards-poli';

    Poli.nome = 'Poligono ' + i;
    //containers para posicionar
    const contRow       = document.createElement('div');
    const contleft      = document.createElement('div');
    const contright     = document.createElement('div'); 
    const bodyPoli      = document.createElement('div');
    //elementos do card
    const namePoli      = document.createElement('h2');
    const deletePoli    = document.createElement('button');
    const textPoli      = document.createElement('h6');
    const changeColor   = document.createElement('input');
    const okbuttonPoli  = document.createElement('button');


    contRow.classList.add('row', 'align-items-center');
    contleft.classList.add('col');
    contright.classList.add('col','align-self-center');

    bodyPoli.classList.add('card-body');
    bodyPoli.id='infos';

    namePoli.classList.add('card-title','fw-bold');
    namePoli.textContent = Poli.nome;

    textPoli.classList.add('card-subtitle','fst-italic');
    textPoli.textContent = 'vertices = '+Poli.vertices.length;

    deletePoli.id = 'remove-poli';
    deletePoli.classList.add('btn', 'btn-danger');
    deletePoli.textContent = 'remover';
    deletePoli.type='submit';

    changeColor.classList.add('color')
    changeColor.type = 'color';

    okbuttonPoli.classList.add('btn', 'btn-primary');
    okbuttonPoli.textContent ='Enviar';

    contRow.appendChild(contleft);
    contRow.appendChild(contright);

    contleft.appendChild(namePoli);
    contleft.appendChild(textPoli);
    contleft.appendChild(deletePoli);
   

    contright.appendChild(changeColor);
    contright.appendChild(okbuttonPoli);

    bodyPoli.appendChild(contRow);

    NewPoli.appendChild(bodyPoli);
    
    ListPoli.appendChild(NewPoli);



    deletePoli.addEventListener('click', function(event){
        event.preventDefault();
        const numbot = numbotao();
        removePoli(numbot);
        const elemento = document.getElementById('list-Poli')
        elemento.remove()

        for(let i=0; i<listaPoli.length; i++){
            createInf(listaPoli[i], i);
        }
    })
    function numbotao(){
        let text = namePoli.textContent;
        const number = text.match(/\d+/g);
        const numArray = number.map(Number);
        return numArray[0]
    }

    okbuttonPoli.addEventListener('click', function(event){
        event.preventDefault();
        const numbot = numbotao();
        listaPoli[numbot].corPreenchimento = changeColor.value
        clearALL()
        paintALL();
        
    }) 
}



//função para os calculos sem a pintura;
function fillPolly (Poli) {
    let aux = 0;
    let dx, dy;
    let YminAR, YmaxAR;
    let ScanP2P;
    Poli.ListaScan=[];
    Poli.Tx=[];

    for(let i = 0; i<Poli.scanlines;i++){
        const linha = [];
        Poli.ListaScan.push(linha);
    }
    //console.log(Poli);
    while(aux < Poli.vertices.length){
        //testando para ver se chegou no ultimo elemento do array;
        if(aux == Poli.vertices.length-1){
            if(Poli.vertices[aux].y > Poli.vertices[0].y){
                YminAR = 0;
                YmaxAR = aux;
            }else{
                YminAR = aux;
                YmaxAR = 0;
            }
        }else if(aux != Poli.vertices.length-1 && Poli.vertices[aux+1].y > Poli.vertices[aux].y){
            YminAR = aux;
            YmaxAR = aux+1;
        }else if(aux != Poli.vertices.length-1 && Poli.vertices[aux+1].y < Poli.vertices[aux].y){
            YminAR = aux + 1;
            YmaxAR = aux;
        }  
        //calculo TX
        dx =  Poli.vertices[YmaxAR].x - Poli.vertices[YminAR].x ;
        dy =  Poli.vertices[YmaxAR].y - Poli.vertices[YminAR].y ;
        Poli.Tx.push(dx/dy);

        ScanP2P = (Poli.vertices[YmaxAR].y - Poli.vertices[YminAR].y); 
        
        for(let i = 0 ; i< ScanP2P; i++) {
            //
            let xinc = Poli.vertices[YminAR].x + Poli.Tx[aux]*i;
            Poli.ListaScan[Poli.vertices[YminAR].y-Poli.Ymin.y + i].push(xinc);   
        }
        aux++;   
    }
    for(let i = 0; i<Poli.scanlines;i++){
        Poli.ListaScan[i].sort((a, b) => a - b);
    }
}

//paintura de todos novamente
function paintALL(){
    redrawAR();
    for(let i=0;i <listaPoli.length;i++){
        paintPoli(listaPoli[i])
    }
}

//pintura do Poligono 
function paintPoli(Poli4paint){
    for(let i=0; i< Poli4paint.ListaScan.length; i++){
        for(let j=0; j+1 < Poli4paint.ListaScan[i].length; j+=2){
            let Ytemp = Poli4paint.Ymin.y + i;
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.moveTo(Math.ceil(Poli4paint.ListaScan[i][j]), Ytemp )
            ctx.lineTo(Math.floor(Poli4paint.ListaScan[i][j+1]),Ytemp )
            ctx.strokeStyle = Poli4paint.corPreenchimento;
            ctx.stroke();
        }
        
    }
}

function clearALL(){
    ctx.clearRect(0, 0, 899, 699); // apaga a tela toda
}
function redrawAR(){
    for(let i=0; i<listaPoli.length; i++){
        for(let j=0; j<listaPoli[i].vertices.length-1; j++){
            ctx.beginPath();
            ctx.moveTo(listaPoli[i].vertices[j].x, listaPoli[i].vertices[j].y)
            ctx.lineTo(listaPoli[i].vertices[j+1].x, listaPoli[i].vertices[j+1].y)
            ctx.strokeStyle = listaPoli[i].corAresta;
            ctx.stroke();
        }
            let g = listaPoli[i].vertices.length-1;
            ctx.beginPath();
            ctx.moveTo(listaPoli[i].vertices[g].x, listaPoli[i].vertices[g].y)
            ctx.lineTo(listaPoli[i].vertices[0].x, listaPoli[i].vertices[0].y)
            ctx.stroke();
    }
}

function clearListaPontos(){
    while(listaPontos.length > 0){
        listaPontos.pop();
    }
}


