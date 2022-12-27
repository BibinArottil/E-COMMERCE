const multer=require("multer");
const path=require('path');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../Public/admin/productimage'))
    },
    filename:(req,file,cb)=>{
        const name=file.originalname
        cb(null,name)
    }
})

const upload=multer({storage:storage})

module.exports=upload