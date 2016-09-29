var recherches=[];//tableau contenant des chaines de caracteres correspondant aux recherches stockees

var recherche_courante;// chaine de caracteres correspondant a la recherche courante
var recherche_courante_news=[]; // tableau d'objets de type resultats (avec titre, date et url)




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


}


function recherche_nouvelles()
{
	$('#resultats').empty();
	$('#wait').css("display","block") ;
	var data = $('#zone_saisie').val();
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
	recherche_courante_news = res; // JQuery parse automatiquement le JSON renvoyé par le serveur s'il est valide
	for(var i=0; i<recherche_courante_news.length; i++){
		$('#resultats').append(decodeEntities(
			'<p class="titre_result"><a class="titre_news" href="'+recherche_courante_news[i].url
			+'" target="_blank">'+recherche_courante_news[i].titre
			+'</a><span class="date_news">'+format(recherche_courante_news[i].date)
			+'</span><span class="action_news" onclick="sauve_news(this)"><img src="horloge15.jpg"/></span></p>')
		)
	}
}


function sauve_news(e)
{

}


function supprime_news(e)
{

}
