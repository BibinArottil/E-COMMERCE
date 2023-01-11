const adminLogin=(req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/admin')
    }
}

const adminLogout=(req,res,next)=>{
    if(req.session.admin){
        res.redirect('/adminhome')
    }else{
        next()
    }
}

module.exports={
    adminLogin,
    adminLogout
}