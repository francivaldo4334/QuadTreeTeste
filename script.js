const my_canva = document.getElementById("my_canva");
const my_content = document.getElementById("my_content")
const context = my_canva.getContext('2d');
const scalex = 0.3
const scaley = 0.09
const rectCTX = my_content.getBoundingClientRect();
class Rect{
    x = 0
    y = 0
    w = 0
    h = 0
    constructor(x,y,w,h){
        this.x = x
        this.y = y
        this.h = h
        this.w = w
    }
}
function isClick(x,y,rect){
    return x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h
}
function repeatString(str, times) {
    return new Array(times + 1).join(str);
}
function getIntercection(n0,n1){
    var resp = n1 - n0
    if(resp < 0){
        resp = resp * -1
    }
    return resp
}
function isColision(rect,outSizeRect){
    const mediaW = (rect.w + outSizeRect.w)/2
    const mediaH = (rect.h + outSizeRect.h)/2
    const distanceW = getIntercection(rect.x,outSizeRect.x)
    const distanceH = getIntercection(rect.y,outSizeRect.y)
    return distanceH < mediaH && distanceW < mediaW
}
class QuadTre{
    geracao = 0
    its = []
    rect = null
    subs = null
    constructor(rect,geracao){
        this.rect = rect
        this.geracao = geracao
        console.log(this.rect)
    }
    addIt(it){
        if(this.its.length < 4){
            this.its.push(it);
        }
        else{
            if(this.subs == null){
                const w = this.rect.w/2
                const h = this.rect.h/2
                this.subs = [
                    new QuadTre(new Rect(this.rect.x,this.rect.y,w,h),this.geracao + 1),
                    new QuadTre(new Rect(this.rect.x + w,this.rect.y,w,h),this.geracao + 1),
                    new QuadTre(new Rect(this.rect.x,this.rect.y + h,w,h),this.geracao + 1),
                    new QuadTre(new Rect(this.rect.x + w,this.rect.y + h,w,h), this.geracao + 1)
                ]
            }
            console.log(this.subs)
            this.subs.forEach(element => {
                if(isClick(it.x,it.y, element.rect)){
                    element.addIt(it)
                    return;
                }
            });
        }
        const space = repeatString(' ',this.geracao)
        console.log(`${space}${this.its}`)
    }
    getItMany(rect){
        var resp = []
        if(isColision(rect,this.rect)){
            resp += this.its
        }
        if(this.subs !== null){
            this.subs.forEach(item => {
                resp += item.getItMany(rect)
            });
        }
        return resp
    }
}
class controller {
    static quadTre = null
    static getInstance(){
        if (controller.quadTre == null){
            controller.quadTre = new QuadTre(new Rect(rectCTX.x,rectCTX.y,rectCTX.width,rectCTX.height),0)
        }
        return controller.quadTre
    }

}

function drawRect(newRect){
    window.setInterval(()=>{
        context.fillStyle = 'yellow';
        context.fillRect(newRect.x * scalex,newRect.y * scaley,newRect.w,newRect.h)
    },1)
}
my_content.addEventListener('mousedown',function(event){
    const x = parseInt(event.pageX - rectCTX.left);
    const y = parseInt(event.pageY - rectCTX.top);
    if (event.button === 0){
        const newRect = new Rect(x,y,10,10)
        controller.getInstance().addIt(newRect)
        drawRect(newRect)
    }
});