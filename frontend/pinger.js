function sleep(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

self.addEventListener('message', function(e)
{
    var data = e.data;
    switch (data.cmd)
    {
        case 'start':
            self.postMessage({type: "log", text: 'Pinging ' + data.num_pings + " times every " + data.ping_interval + "ms."});
            for(i=0; i<data.num_pings; i++)
            {
                sleep(data.ping_interval);
                d = new Date();
                self.postMessage({type: "log", text: 'PING #' + i +' @ '+ d.toLocaleTimeString()});
                self.postMessage({type: "ping"});
            }
            break;

        default:
            self.postMessage('Unknown command: ' + data.msg);
    };
}, false);