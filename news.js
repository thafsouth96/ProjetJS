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
		alert(e_textJson);
		$.cookie("recherches",e_textJson, {expires : 1000});
	}

}

function supprimer_recherche(e)
{
	var e_text = e.parentElement.firstChild.innerHTML;
	e.parentElement.remove();
	recherches.splice(recherches.indexOf(e_text),1);


}


function selectionner_recherche(e)
{
	var e_text = e.parentElement.firstChild.innerHTML;
	$('#zone_saisie').val(e_text);
	recherche_courante = e_text ;

}


function init()
{

}


function recherche_nouvelles()
{


}


function maj_resultats(res)
{


}


function sauve_news(e)
{

}


function supprime_news(e)
{

}
