export default class helper {
    static getParam(variable) {
        let url = window.location.search;
        if (url == '') {
            return null;
        }
        let query = url.substring(1),
            vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] == variable && pair[1] != '') {
                return pair[1];
            }
        }
        return null;
    }

    static urlHostTopLevel() {
        let host = window.location.hostname;
        // ipv4
        if (host.match(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/)) {
            return host;
        }
        host = host.split('.');
        while (host.length > 2) {
            host.shift();
        }
        host = host.join('.');
        return host;
    }
}
