function getParams(){
    var apiKey = "4c4d26171d572e84bc95df028d383749";
    var privateKey = ;
    var ts= Math.floor(new Date()/1000);
    var hash= md5(`${ts}${privateKey}${apiKey}`);

    return {
        ts, 
        apiKey, 
        hash
    };
}

function getApi(params, id=null){
    var xhr = new XMLHttpRequest();
    var url = `https://gateway.marvel.com:443/v1/public/characters${id==null ? '?nameStartsWith=SPIDER-MAN&limit=12&' : `/${id}?`}ts=${params.ts}&apikey=${params.apiKey}&hash=${params.hash}`;
    console.log(url);
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
    result.forEach(element => {
        const divPrincipal = document.querySelector("#div-principal");
        
        const divContent = document.createElement("div");
        const img = document.createElement("img");
        const nomePersonagem = document.createElement("h2");
        const link = document.createElement('a');

        divContent.classList.add("d-flex", "flex-column","w-25")
        divPrincipal.classList.add("d-flex", "flex-row","justify-content-center")
        img.classList.add("img-fluir","mt-2", "imagens", "rounded")
        let id = element.resourceURI.split("/"); id=id[id.length-1]; img.id = id;
        nomePersonagem.classList.add("fs-6","text-center")
        
        link.href= `./characters.html?${element.id}`;
        img.src = `${element.thumbnail.path}.${element.thumbnail.extension}`;
        nomePersonagem.innerHTML = element.name;

        link.append(img);
        divContent.append(link);
        divContent.append(nomePersonagem);
        divPrincipal.append(divContent);
    })
}

function createCharacter(result){
    console.log(result);
    result.forEach(element => {

        const divPrincipal = document.querySelector("#div-principal");

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
        divConteudo.classList.add("col-8","mt-4","fs-5");
        img.classList.add("img-fluid", "w-100");
        divTabelaHistoria.classList.add("text-center","mt-3");
        tbody.classList.add("tbody-historia")
        table.classList.add("table", "table-bordered", "border-dark", "mt-3", "table-responsive-sm","text-center");
        thTipo.classList.add("w-25")

        tituloSecundario.innerHTML="Personagem Marvel";
        titulo.innerHTML = element.name;
        descricao.innerHTML = element.description;
        img.src = `${element.thumbnail.path}.${element.thumbnail.extension}`;
        tituloTabela.innerHTML = "Histórias";
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
    
            var id = element.stories.items[i].resourceURI.split("/"); id=id[id.length-1];
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

        //div lista de aparições
        const divLista = document.createElement("div");
        const tituloLista = document.createElement("h4");
        const lista = document.createElement("ul");

        divLista.classList.add("col-4", "cor-vermelho-secundario", "cor-white");
        tituloLista.classList.add("fs-5", "p-2", "pt-4");

        tamList= element.comics.items.length - 1;
        for(let i=0; i<=tamList; i++){
            const conteudo = document.createElement("li");
            conteudo.innerHTML = element.stories.items[i].name;
            lista.append(conteudo);
        }

        tituloLista.innerHTML = "Lista de Aparições (comics)";

        divLista.append(tituloLista);
        divLista.append(lista);
        divPrincipal.append(divLista);

    });
}

function start(){
    const params =  getParams();
    var idPersonagem = window.location.href.split("?")[1]
    if(idPersonagem != null){
        getApi(params,idPersonagem);
    }
    else{
        getApi(params);
    }
}

start();
