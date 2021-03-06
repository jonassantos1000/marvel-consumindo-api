function getParams(){
    let apiKey = "4c4d26171d572e84bc95df028d383749";
    let privateKey = "bbcc858dda000b330752f9e1cccbff844094a2ff";
    let ts= Math.floor(new Date()/1000);
    let hash= md5(`${ts}${privateKey}${apiKey}`);

    return {
        ts, 
        apiKey, 
        hash
    };
}

function getApi(params, id=null){
    let xhr = new XMLHttpRequest();
    let url = `https://gateway.marvel.com:443/v1/public/characters${id==null ? getInputFilter () : `/${id}?`}ts=${params.ts}&apikey=${params.apiKey}&hash=${params.hash}`;
    
    xhr.onreadystatechange = function() { 
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhr.responseText);
            
            if(!id){
                createCard(response.data.results);
            }else{
                createCharacter(response.data.results);
            }
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

function createCard(result){
    cardsEmHtml = result.map(element =>  `
    <div class="d-flex flex-column col-10 col-md-4 col-lg-3 conteudo float-sm-right flex-wrap" id="card">
        <a href="./characters.html?${element.id}"><img src="${element.thumbnail.path}.${element.thumbnail.extension}" class="mt-2 imagens borda"></a>
        <h2 class="fs-6 text-center">${element.name}</h2>
    </div>
    `);
    let htmlConcatenado = cardsEmHtml.join('');
    document.querySelector("#div-principal").innerHTML  = htmlConcatenado;
}

function createCharacter(result){

        element = result[0]

        const divPrincipal = document.querySelector("#div-principal");
        divPrincipal.innerHTML=""

        //div conteudo
        const divConteudo = document.createElement("div");
        const divTabelaHistoria = document.createElement("div");
        const titulo = document.createElement("h2");
        const tituloSecundario = document.createElement("h4");
        const descricao = document.createElement("p");
        const img = document.createElement("img");
        const table = document.createElement("table");
        const tituloTabela = document.createElement("h3");
        const tbody = document.createElement("tbody");
        const trCabecalho = document.createElement("tr");
        const thID = document.createElement("th");
        const thTitulo = document.createElement("th");
        const thTipo = document.createElement("th");
      
        descricao.classList.add("text-justify")
        divConteudo.classList.add("col-12", "col-sm-8","mt-4","fs-5");
        img.classList.add("img-fluid", "w-100");
        divTabelaHistoria.classList.add("text-center","mt-3");
        tbody.classList.add("tbody-historia")
        table.classList.add("table", "table-bordered", "border-dark", "mt-3", "table-responsive-sm","text-center");
        thTipo.classList.add("w-25")

        tituloSecundario.innerHTML="Personagem Marvel";
        titulo.innerHTML = element.name;
        descricao.innerHTML = element.description;
        img.src = `${element.thumbnail.path}.${element.thumbnail.extension}`;
        tituloTabela.innerHTML = "Hist??rias";
        thID.innerHTML="ID"
        thTitulo.innerHTML="TITULO"
        thTipo.innerHTML="TIPO"

        divConteudo.append(tituloSecundario);
        divConteudo.append(titulo);
        divConteudo.append(descricao);
        divConteudo.append(img);

        trCabecalho.append(thID);
        trCabecalho.append(thTitulo);
        trCabecalho.append(thTipo);
        tbody.append(trCabecalho);

        tamList= element.stories.items.length - 1;
        for(let i=0; i<=tamList; i++){
            const trConteudo = document.createElement("tr");
            const tdID = document.createElement("td");
            const tdTitulo = document.createElement("td");
            const tdTipo = document.createElement("td");
    
            let id = element.stories.items[i].resourceURI.split("/"); id=id[id.length-1];
            tdID.innerHTML = id;
            tdTitulo.innerHTML = element.stories.items[i].name;
            tdTipo.innerHTML = element.stories.items[i].type;
    
            trConteudo.append(tdID);
            trConteudo.append(tdTitulo);
            trConteudo.append(tdTipo);
    
            tbody.append(trConteudo);
        }

        table.append(tbody);
        divTabelaHistoria.append(tituloTabela);
        divTabelaHistoria.append(table);
        divConteudo.append(divTabelaHistoria);
        divPrincipal.append(divConteudo);

        //div lista de apari????es
        const divLista = document.createElement("div");
        const tituloLista = document.createElement("h4");
        const lista = document.createElement("ul");

        divLista.classList.add("col-12", "col-sm-4", "cor-vermelho-secundario", "cor-white");
        tituloLista.classList.add("fs-5", "p-2", "pt-4");

        tamList= element.comics.items.length - 1;
        for(let i=0; i<=tamList; i++){
            const conteudo = document.createElement("li");
            conteudo.innerHTML = element.stories.items[i].name;
            lista.append(conteudo);
        }

        tituloLista.innerHTML = "Lista de Apari????es (comics)";

        divLista.append(tituloLista);
        divLista.append(lista);
        divPrincipal.append(divLista);
}

function start(){
    const params =  getParams();
    let idPersonagem = window.location.href.split("?")[1]
    if(idPersonagem != null){
        getApi(params,idPersonagem);
    }
    else{
        getApi(params);
    }
}

function getInputFilter () {
    let pesquisa = document.querySelector("#barra")
    let text = pesquisa.value
    if (text==""){
        text= "?limit=12&"
    }else{
        text = `?nameStartsWith=${text}&limit=52&`;
    }
    return text;
}

start()

let botao = document.querySelector("#botao");
botao.addEventListener("click", function(){
    start();
 });

document.addEventListener('keydown', function(e) {
    if(e.key == "Enter"){
        e.preventDefault();
        start();
    }
});