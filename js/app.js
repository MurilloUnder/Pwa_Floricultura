/*

Variáveis Globais

*/
let web_service = "floricultura.json";
let data_json;
let index_floricultura = 0;
let floriculturas = document.getElementById("floriculturas");
let flores = document.getElementById("flores");
let flores_content = document.getElementById("flores_content");
let btnVoltar = document.getElementById("btnVoltar");
let title_floricultura = document.getElementById("title_floricultura");
let btInstall = document.getElementById("btInstall");
let celular_compra = "31997222874";     
let nome_floricultura;
/*

Funções Principais

*/

//Trazer dado do servidor
function loadData(){

    let ajax = new XMLHttpRequest();

    ajax.open("GET", web_service, true);
    ajax.send();

    ajax.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            data_json = JSON.parse(this.responseText);
            //console.log(data_json);
            printFloriculturas();
            cacheDinamico();
        }
        
    }

}

loadData();

//Montar o card de floriculturas
function printFloriculturas(){

    let html_floricultura = '<div class="row">';

    if(data_json.length > 0){

        for(let i = 0; i<data_json.length; i++){
            html_floricultura += card_floriculturas(i, data_json[i].name, data_json[i].address, data_json[i].image, data_json[i].site,data_json[i].bio);
        }

    }else{
        html_floricultura = msg_alert("Não há floriculturas cadastradas", "warning");
    }

    html_floricultura += '</div>';

    floriculturas.innerHTML = html_floricultura;

}

function printflor(id, nome){
    window.scrollTo(0,0);
    nome_floricultura = nome;
    title_floricultura.innerHTML = nome;
    floriculturas.style.display = "none";
    flores.style.display = "block";

    let html_flores = '<div class="row">';

    if(data_json[id].flowershop.length > 0){

        for(let i = 0; i<data_json[id].flowershop.length; i++){
            html_flores += card_flores(data_json[id].flowershop[i].active, data_json[id].flowershop[i].category, data_json[id].flowershop[i].description, data_json[id].flowershop[i].flower, data_json[id].flowershop[i].image, data_json[id].flowershop[i].name, data_json[id].flowershop[i].seasonal, data_json[id].flowershop[i].style);
        }

    }else{
        html_flores = msg_alert("Não há flores cadastradas para esta floriculturas", "warning");
    }

    flores_content.innerHTML = html_flores;
}

function changeModal(name,active,category,flower,style,description,){

    document.getElementById("nome_flor").innerHTML = name;
    document.getElementById("estilo_flor").innerHTML = "<strong>Nome Cíentifico:</strong>&nbsp;"+style;
    document.getElementById("desc_flor").innerHTML =  "<strong>Descrição:</strong>&nbsp;"+description;
    document.getElementById("Categoria_flor").innerHTML = "<strong>Categoria:</strong>&nbsp;"+category;
    document.getElementById("flor_flor").innerHTML =  "<strong>Floração:</strong>&nbsp;"+flower;
    document.getElementById("venda_flor").innerHTML = "<strong>Em venda:</strong>&nbsp;"+active;
    
}

function voltarTela(){    
    floriculturas.style.display = "block";
    flores.style.display = "none";
}

const CACHE_DINAMICO = "DesertRose_dinamico";

let cacheDinamico = function(){

    if('caches' in window){

        let ARQUIVOS_DINAMICOS = [web_service];
        
        caches.delete(CACHE_DINAMICO).then(function(){

            if(data_json.length > 0){

                for(let i = 0; i < data_json.length; i++){

                    if(ARQUIVOS_DINAMICOS.indexOf(data_json[i].image) == -1){
                        ARQUIVOS_DINAMICOS.push(data_json[i].image);
                    }

                    for(let j = 0; j < data_json[i].flowershop.length; j++){
                    
                        if(ARQUIVOS_DINAMICOS.indexOf(data_json[i].flowershop[j].image) == -1){
                            ARQUIVOS_DINAMICOS.push(data_json[i].flowershop[j].image);
                        }                        
                    }
                }

                caches.open(CACHE_DINAMICO).then(function(cache){

                    cache.addAll(ARQUIVOS_DINAMICOS).then(function(){

                        console.log("Cache dinâmico realizado com sucesso!");

                    });

                });

            }

        })

    }

}

/*

Botão de Instalação

*/

let janelaInstalacao = null;

window.addEventListener('beforeinstallprompt', gravarJanela);

function gravarJanela(evt){
    janelaInstalacao = evt;
}

let inicializarInstalacao = function(){

    setTimeout(function(){

        if(janelaInstalacao != null){
            btInstall.removeAttribute("hidden");
        }

    },500);

    btInstall.addEventListener("click", function(){

        btInstall.setAttribute("hidden", true);
        btInstall.hidden = true;

        janelaInstalacao.prompt();

        janelaInstalacao.userChoice.then((choice) => {

            if(choice.outcome === "accepted"){

                console.log("Usuário instalou o app!");

            }else{
                console.log("Usuário NÃO instalou o app!");
                btInstall.hidden = false;
                btInstall.removeAttribute("hidden");
            }

        });

    });

}

/*

Primitive Template Engines

*/

msg_alert = function(texto, style){
    return '<div class="alert alert-'+style+'" role="alert">'+texto+'</div>';
}

card_floriculturas = function(id, nome, descricao, imagem, site,bio){
    return `<div class="col-12 col-lg-6">            
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-4">
                                <div class="d-flex align-items-center justify-content-center" style="height: %;">
                                <img src="${imagem}" class="logo_floricultura">
                                </div>                      
                            </div>
                            <div class="col-8">   
                                <h5 class="card-title">${nome}</h5>
                                <p class="card-text">${descricao}</p>
                                <p class="card-text">${bio}</p>                                
                                            
                            </div>
                        </div>              
                    </div>
                    <div class="card-footer">
                    <div class="btn-group w-100" role="group" aria-label="Ações">
                        <a href="${site}" target="_blank" class="btn btn-warning w-50">Site</a>
                        <button onClick="javascript:printflor(${id},'${nome}')" class="btn btn-primary btn-purple w-50">Ver Flores</button>
                    </div>
                    </div>
                </div>
            </div> `;
}

card_flores = function(active, alcohol, description, flower, image, name, seasonal, style){

    return `<div class="col col-lg-4">            
                <div class="card h-100">
                <div class="card-body">
                    <span class="container_flor"><img src="${image}" class=".image_flores"></span>
                    <h5 class="card-title">${name}</h5>                                                            
                </div>
                <div class="card-footer">
                    <div class="btn-group w-100" role="group" aria-label="Ações">
                    <a href="#" class="btn btn-warning w-50" data-bs-toggle="modal" data-bs-target="#modalflor" onClick="javascript:changeModal('${name}','${active}','${alcohol}','${flower}','${style}','${description.replace(/(\r\n|\n|\r)/gm, "")}')">Ver Informações</a>
                    <a href="#" onClick="javascript:formataMensagem('${name}')" class="btn btn-success w-50 btn-whatsapp">Comprar</a>
                    </div>
                </div>
                </div>
            </div>`;

}

/*

Funções Extras

*/

function formataMensagem(flor){

    var mensagem = "Olá *DesertRose*, gostaria de informações para compra da flor *"+flor+"* da floricultura *"+nome_floricultura+"*,.\n\nPoderia por favor me retornar.\n\nObrigado(a)";
    
    enviarWhatsApp(mensagem,celular_compra);

}


function enviarWhatsApp(mensagem,celular){    
  
    if(celular.length < 13){
        celular = "55" + celular;
    }
  
    var texto = mensagem;
    texto = window.encodeURIComponent(texto);
    
    let urlApi = "https://api.whatsapp.com/send";
    
    window.open(urlApi + "?phone=" + celular + "&text=" + texto, "_self");
}
