
function loadData() {

    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // get the input data
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ',' + city; 

    $greeting.text("So you want to live at " + address + '?');


    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "780f674c5b764bf0b4c3d6d7d9601033",
        'q': city,
        'sort': "newest"
    });

    $.getJSON(url, function(result){
        $nytHeaderElem.text("New York Times articles about " + city);
        articles = result.response.docs;

        for(var i = 0; i<articles.length; i++){
        var article = articles[i];
        $nytElem.append('<li class="article">'
                    + '<a href = "' + article.web_url + '">' + article.headline.main + '</a>'
                    + '<p>' +article.snippet+'</p>' +
            '</li>');
        }

    }).error( function(){
        $nytHeaderElem.text("New York Times articles could not be loaded.");
    });

    var wikiRequestTimeOut = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia Resources")
    }, 8000);

    var wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+city+"&format=json&callback=wikiCallBack";
    $.ajax({
        url:wikiURL,
        dataType: "jsonp",
        success: function(response) {
            var articles = response[1];
            for (var i = 0; i < articles.length; i++) {
                var article = articles[i];
                var url = "http://en.wikipedia.org/wiki/" + article;
                $wikiElem.append('<li><a href="'+url+'">'+article+'</a></li>');
            }
            clearTimeout(wikiRequestTimeOut);
        }
    });

    return false;
};
$('#form-container').submit(loadData);