const userLogin=(req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect('/')
    }
}

const userLogout=(req,res,next)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        next()
    }
}

module.exports={
    userLogin,
    userLogout
}