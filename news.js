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
		recherches.push(e_text);
		$('#recherches-stockees').append('<p class= "titre-recherche"><label>'+e_text+'</label><img src="croix30.jpg" class ="icone-croix"/></p>');
		$('#recherches-stockees').children().last().children().first().attr("onclick","selectionner_recherche(this)");
		//alert($('#recherches-stockees').children().last().children().last().attr("src")) ;
		$('#recherches-stockees p:last-child').children().last().attr("onclick","supprimer_recherche(this)");
		var e_textJson = JSON.stringify(recherches);
		$.cookie("recherches",e_textJson, {expires : 1000});
	}

}

function supprimer_recherche(e)
{
	var e_text = e.parentElement.firstChild.innerHTML;
	e.parentElement.remove();
	recherches.splice(recherches.indexOf(e_text),1);
	var e_textJson = JSON.stringify(recherches);
	$.cookie("recherches",e_textJson, {expires : 1000});
}


function selectionner_recherche(e)
{
	var e_text = e.parentElement.firstChild.innerHTML;
	$('#zone_saisie').val(e_text);
	recherche_courante = e_text ;
	var cookie = $.cookie(e_text);
	$('#resultats').empty();
	recherche_courante_news=[];
	if (cookie!=null){

		recherche_courante_news = $.parseJSON(cookie);

		for (var i=0; i<recherche_courante_news.length; i++){
			$('#resultats').append(decodeEntities(
				'<p class="titre_result"><a class="titre_news" href="'+recherche_courante_news[i].url
				+'" target="_blank">'+recherche_courante_news[i].titre
				+'</a><span class="date_news">'+recherche_courante_news[i].date
				+'</span><span class="action_news" onclick="supprime_news(this)"><img src="disk15.jpg"/></span></p>')
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
}


function recherche_nouvelles()
{
	$('#resultats').empty();
	$('#wait').css("display","block") ;
	var data = $('#zone_saisie').val();
	recherche_courante = data;
	if(indexOf(recherche_history,data) == -1){
		recherche_history.push(data); //On ajoute la recherche à son historique
	}
	$.cookie("recherche_history",JSON.stringify(recherche_history), {expires : 1000});
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
				console.log(recherche_courante_news[j].date + " = " + resJSON[i].date);
				if (recherche_courante_news[j].titre==resJSON[i].titre && recherche_courante_news[j].date==format(resJSON[i].date))	{

					present = true;
				}
				j++;
			}
			if (present){
				text_html+='</span><span class="action_news" onclick="supprime_news(this)"><img src="disk15.jpg"/></span></p>';
			}
			else text_html+='</span><span class="action_news" onclick="sauve_news(this)"><img src="horloge15.jpg"/></span></p>';
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
	if (indexOf(news, recherche_courante_news)==-1){
		recherche_courante_news.push(news);
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
