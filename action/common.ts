'use server'

export const randarError=(error:unknown)=>{
    if(error){
        const message = error instanceof Error ? error.message :'Something went wrong'
        return {message: message, error:true}
    }
}

export const randarSuccess=(msg:string)=>{
    if(msg){     
        return {message: msg, error:false}
    }
}