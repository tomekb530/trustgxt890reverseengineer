var newint 
var keys = []
var pos = 0x00
var pos2 = 0x00
var pos3 = 0x00
var todel = [13,17,18,19,20,75,77,78,79,83,85,96,98,99,112,114,115,116,117,118,122]
function prepKeys(){
    keys.push([pos,pos2,pos3])
    pos = pos + 0x03
        pos2= pos2 + 0x02
        if(pos>255){
            pos=0x02
            pos2=0x00
            pos3=pos3+0x01
        }
       
    //console.log(pos,pos2,pos3)
    if(pos == 116 && pos2==76 && pos3 == 1){
        clearInterval(newint)
        keys.push([pos,pos2,pos3])
        console.log(keys.length)
        todel.forEach((a)=>{
            keys[a] = undefined
        })
        keys = keys.filter(a=>{
            if(a){
                return true
            }else{
                return false
            }
        })
        
        console.log(keys.length)
        var data = JSON.stringify(keys)

        require("fs").writeFileSync("./keys.txt",data)

    }
}
function prepareKeys(){
    newint= setInterval(prepKeys,1)
}
prepareKeys()
