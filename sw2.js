var requests = [];

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetchWithParamAddedToRequestUrl(event.request)
    );
});
function fetchWithParamAddedToRequestUrl(request) {
    console.log("url ", request.url);

    if (request.url.includes("/pixel.gif")) {
        fetchInAsync(request);
        return new Promise(function (resolve) {
            resolve(new Response());
        });
    } else {
        return fetch(request);
    }
}

function fetchInAsync(request) {
    console.log('fetching real response');
    let url = request.url;
    url = url.replace("interaction=", "event=");
    url = url.replace("client=", "customer=");
    url = url.replace("os_name=", "operating_system_name=");
    url = url.replace("x1=", "utm_source=");
    url = url.replace("x2=", "utm_medium=");
    url = url.replace("x3=", "utm_campaign=");
    url = url.replace("landing_url=", "campaign_url=");
    console.log('response', url)

    let request2 = request.clone({
        url: url
    });
    console.log(request2);

    fetch(request2).then(resp => {
        while (requests && requests.length) {
            console.log('sending pending req');
            fetchInAsync(requests.pop());
        }
    }, (err) => {
        console.log('Error in network');
        throw err;
    }).catch((err) => {
        console.log('adding pending req');
        requests.push(request2);
    })
}
