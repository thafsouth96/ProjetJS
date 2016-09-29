// encode(decode) html text into html entity
function decodeHtmlEntity(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

function twodigits(v)
{
	var v2 = v > 9 ? v : '0' + v;
	return(v2);
}


function format(cdate)
{	
		var date = new Date(cdate);
        var day = twodigits(date.getDate());
        var month = twodigits(date.getMonth() + 1);
        var year = date.getFullYear();
        var hours = twodigits(date.getHours());
		var minutes = twodigits(date.getMinutes());
		return(" "+day+"/"+month+" "+hours+"h"+minutes);
}

function decodeEntities(encodedString) 
{
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return decodeHtmlEntity(textArea.value);
}

// retourne l'index de l'objet o dans le tableau t si présent et -1 sinon
function indexOf(t,o)
{
		var limit = t.length;
		var trouve=false;
		var i=0;
		while( (!trouve) && (i<limit)) 
		{
			var c=t[i];
			if ((c.titre == o.titre) && (c.date==o.date))
			{
				trouve=true;
			}
			i++;
		}
		if (trouve) {return (i-1);}
		else { return -1; }
}
