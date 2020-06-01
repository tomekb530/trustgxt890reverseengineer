var usb = require('usb')
usb.setDebugLevel(0)
var trustid = 5215
var productid = 535
var keys = JSON.parse(require("fs").readFileSync("./keys.txt","utf8"))
var canDo = true
function sendColor(dev,keyn,r,g,b){
    var key = keys[keyn]
    var pos  = key[0]
    var pos2 = key[1]
    var pos3 = key[2]

    var testbuf = new Buffer.from([
        0x04, 0x00+pos2, 0x03, 0x11, 0x03, 0x00+pos, 0x02+pos3, 0x00, // SECOND, SIXTH AND SEVENTH, PROBABLY KEY POS
        r,g,b, 0x00, 0x00, 0x00, 0x00, 0x00,//FIRST 3 BYTES IN THAT LINE - RGB
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])
    //dev.controlTransfer(0x21,0x09,0x204,0x0001,openpacket,(err,data)=>{
        //if(err){console.log("ERR:",err)}
    //})
    dev.controlTransfer(0x21,0x09,0x204,0x0001,testbuf,(err,data)=>{
        if(err){
        console.log("ERR:",err)
        canDo = false
        if(err.errno == 4){
            dev.reset()
            start()
        }}else{
            console.log("DONE",keyn)
            canDo = true
            if(pos == 116 && pos2==76 && pos3 == 1){
                canDo = false
            }
        }
    })
    //dev.controlTransfer(0x21,0x09,0x204,0x0001,closepacket,(err,data)=>{
        //if(err){console.log("ERR:",err)}
    //})
}
var interval
var timeout = 50
//TO DEL 13,17-20,75,77-79,84,85,98,99,112,114-118,122
var keyn=0
function start(){
usb.getDeviceList().forEach(dev=>{
    if(dev.deviceDescriptor.idVendor == trustid && dev.deviceDescriptor.idProduct == productid){
        dev.open()
        console.log("STARTING",keyn)
        //console.log(dev)
        var int = dev.interfaces[1]
        int.claim()
        var end = int.endpoints[0]
        end.startPoll(1,64)
        end.on("data",(data)=>{
            //console.log(data)
        })
        end.on("error",(data)=>{
            canDo = false
            console.log("ERREVENT:",data)
            if(data.errno == -4 || data.errno == 4 || data.errno == 1){
                dev.reset()
                start()
            }
        })

        canDo = true
        if(interval){clearInterval(interval)}
        interval=setInterval(()=>{
        if(canDo){
        canDo = false
        var key = keys[keyn]
        console.log("SENDING",keyn)
        var r = 255
        var g = 255
        var b = 255
        console.log(r,g,b)
        sendColor(dev,keyn,r,g,b)
        keyn = keyn + 1
        }},timeout)
        //test(pos,pos2,pos3)
        //dev.close();
        //setTimeout(()=>{},1000)
    }
})
}

start()
