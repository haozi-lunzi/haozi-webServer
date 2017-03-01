/**
 * Created by haozi on 2017/1/22.
 */
import {Application} from './application'


const app = new Application()



app.use(async function (ctx,next){
    console.log(233)
    await next()
})





app.listen(3000,() => {
    console.log('qwq')
})


