var recherches=[];//tableau contenant des chaines de caracteres correspondant aux recherches stockees

var recherche_courante;// chaine de caracteres correspondant a la recherche courante
var recherche_courante_news=[]; // tableau d'objets de type resultats (avec titre, date et url)
var recherche_history=[]; //Tableau contenant des chaines de caracteres correspondant aux recherches déja effectuée par l'utilisateur //Autocomplétion

//$(function(){

//});


function ajouter_recherche()
{

	var e_text = $('#zone_saisie').val() ;


	if(recherches.indexOf(e_text) == -1){
		recherches.push(e_text); // On ajoute la recherche dans le tableau de recherches stockées
		// On ajoute une balise html correspondant à la nouvelle recherche à stocker dans la div associée
		$('#recherches-stockees').append('<p class= "titre-recherche"><label>'+e_text+'</label><img src="croix30.jpg" class ="icone-croix"/></p>');
		// On set les attributs "onclick" du label et de l'image croix30.jpg
		$('#recherches-stockees').children().last().children().first().attr("onclick","selectionner_recherche(this)");
		$('#recherches-stockees p:last-child').children().last().attr("onclick","supprimer_recherche(this)");
		var e_textJson = JSON.stringify(recherches); // On convertit le tableau en objet JSON
		$.cookie("recherches",e_textJson, {expires : 1000}); // On actualise le cookie
	}

}

// Au clic sur l'icon croix30.jpg
function supprimer_recherche(e)
{
	var e_text = e.parentElement.firstChild.innerHTML; // on get le texte de la recherche stockée
	e.parentElement.remove(); // on supprime la balise <p> associée à la recherche stockée
	recherches.splice(recherches.indexOf(e_text),1); // on supprime la recherche stockée du tableau
	var e_textJson = JSON.stringify(recherches); // On convertit le nouveau tableau de recherches stockées (sans la recherche que l'on vient de supprimer)
	$.cookie("recherches",e_textJson, {expires : 1000}); // On actualise le cookie
}


function selectionner_recherche(e)
{
	var e_text = e.parentElement.firstChild.innerHTML; // on get le texte de la recherche stockée
	$('#zone_saisie').val(e_text); // On remplace la valeur de la zone de saisie par le texte de la recherche
	recherche_courante = e_text ; // on actualise la recherche courante
	var cookie = $.cookie(e_text);
	$('#resultats').empty(); // On vide la div de résultats
	recherche_courante_news=[]; // On vide le tableau de resultats enregistrés
	if (cookie!=null){

		recherche_courante_news = $.parseJSON(cookie); // On réinitialise le tableau de résultats avec le cookie des resultats enregistrés

		// On affiche les résultats enregistrés
		for (var i=0; i<recherche_courante_news.length; i++){
			$('#resultats').append(decodeEntities(
				'<p class="titre_result"><a class="titre_news" href="'+recherche_courante_news[i].url
				+'" target="_blank">'+recherche_courante_news[i].titre
				+'</a><span class="date_news">'+recherche_courante_news[i].date
				+'</span><span class="action_news" onclick="supprime_news(this)"><img id ="icon_save" src="disk15.jpg"/></span></p>')
			)
		}
	}
}


function init()
{
	var cookie = $.cookie("recherches");

	if (cookie!=null){
		recherches = $.parseJSON(cookie);
		for (var i=0; i<recherches.length; i++){
			$('#recherches-stockees').append('<p class= "titre-recherche"><label>'+recherches[i]+'</label><img src="croix30.jpg" class ="icone-croix"/></p>');
			$('#recherches-stockees').children().last().children().first().attr("onclick","selectionner_recherche(this)");
			$('#recherches-stockees p:last-child').children().last().attr("onclick","supprimer_recherche(this)");
		}
	}

	var cookie_history = $.cookie("recherche_history");
	if(cookie_history!=null){
		recherche_history = $.parseJSON(cookie_history);
		$("#zone_saisie").autocomplete({
			source : recherche_history
		});
	}

	//OnClick sur Entrer ==> Lancer la recherche
	$("#zone_saisie").keypress(function(event){
		var keycode = (event.keycode ? event.keycode : event.which);
		if(keycode== '13'){
			recherche_nouvelles();
		}

	})

	$(".icone-disk").tooltip();
	$("#zone_saisie").tooltip();
	$("#icon_horloge").tooltip();
	$("#icon_save").tooltip();

}


function recherche_nouvelles()
{
	$('#resultats').empty();
	$('#wait').css("display","block") ;
	var data = $('#zone_saisie').val();
	recherche_courante = data;
	//console.log(recherche_history);
	//console.log(recherche_history.indexOf(data));
	if(recherche_history.indexOf(data) == -1){

		recherche_history.push(data); //On ajoute la recherche à son historique
		$.cookie("recherche_history",JSON.stringify(recherche_history), {expires : 1000});

	}
	var cookie = $.cookie(data);
	recherche_courante_news=[];
	if(cookie != null){
		recherche_courante_news = $.parseJSON(cookie);
	}
	$.ajax({
		url : 'search.php?data='+data,
		type : 'GET',
		//async : false, //Demander à M. Brouard
		dataType : 'json',
		success : maj_resultats
	});

}


function maj_resultats(res)
{
	$('#wait').css("display","none");
	var resJSON = res; // JQuery parse automatiquement le JSON renvoyé par le serveur s'il est valide
	for(var i=0; i<resJSON.length; i++){
			var text_html = decodeEntities('<p class="titre_result"><a class="titre_news" href="'+resJSON[i].url
			+'" target="_blank">'+resJSON[i].titre
			+'</a><span class="date_news">'+format(resJSON[i].date));
			var present = false;
			var j=0;
			while (j<recherche_courante_news.length && !present){
				if (recherche_courante_news[j].titre==resJSON[i].titre && recherche_courante_news[j].date==format(resJSON[i].date))	{

					present = true;
				}
				j++;
			}
			if (present){
				text_html+='</span><span class="action_news" onclick="supprime_news(this)"><img id ="icon_save" title="Cliquez pour supprimer le résultat"src="disk15.jpg"/></span></p>';
			}
			else text_html+='</span><span class="action_news" onclick="sauve_news(this)"><img id ="icon_horloge" src="horloge15.jpg" title ="Enregister ce résultat"/></span></p>';
			$('#resultats').append(text_html);
	}
}


function sauve_news(e)
{
	e.querySelector("img").setAttribute("src","disk15.jpg"); // querySelector() retourne le premier élement qui correspond au selecteur CSS
	e.setAttribute("onclick","supprime_news(this)");
	var e_html = e.parentElement;
	var news = new Object() ;
	news.titre = e_html.getElementsByClassName("titre_news")[0].innerHTML;
	news.date = e_html.getElementsByClassName("date_news")[0].innerHTML;
	news.url = e_html.getElementsByClassName("titre_news")[0].getAttribute("href");
	//
	if (indexOf(news, recherche_courante_news)==-1){
		recherche_courante_news.push(news);
		console.log(recherche_courante_news);
		var e_textJson = JSON.stringify(recherche_courante_news);
		$.cookie(recherche_courante,e_textJson, {expires : 1000});
	}
}


function supprime_news(e)
{
	e.querySelector("img").setAttribute("src","horloge15.jpg"); // querySelector() retourne le premier élement qui correspond au selecteur CSS
	e.setAttribute("onclick","sauve_news(this)");
	var e_html = e.parentElement;
	var news = new Object() ;
	news.titre = e_html.getElementsByClassName("titre_news")[0].innerHTML;
	news.date = e_html.getElementsByClassName("date_news")[0].innerHTML;
	news.url = e_html.getElementsByClassName("titre_news")[0].getAttribute("href");
	var index = indexOf(news, recherche_courante_news);
	if (index==-1){
		recherche_courante_news.splice(index,1);
		var e_textJson = JSON.stringify(recherche_courante_news);
		$.cookie(recherche_courante,e_textJson, {expires : 1000});
	}
}
