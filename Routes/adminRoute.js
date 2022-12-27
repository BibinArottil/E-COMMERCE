const express=require("express")
const adminRouter=require('../Controllers/adminController')
const admin_router=express.Router()
const upload=require('../Utils/multer')

admin_router.get('/admin',adminRouter.adminLogin)

admin_router.post('/admin',adminRouter.adminVerification)

admin_router.get('/adminhome',adminRouter.loadAdminHome)

admin_router.get('/user_manage',adminRouter.loadUser)

admin_router.get('/admin_panel',adminRouter.updateUser)

admin_router.get('/category',adminRouter.category)

admin_router.post('/insert_category',adminRouter.insertCategory)

admin_router.get('/action_category',adminRouter.listUnlistCategory)

admin_router.get('/edit_category',adminRouter.editCategory)

admin_router.post('/edit_category',adminRouter.updateCategory)

admin_router.get('/delete_category',adminRouter.deleteCategory)

admin_router.get('/product',adminRouter.product)

admin_router.post('/insert_product',upload.single('image'),adminRouter.insertProduct)

admin_router.get('/admin_logout',adminRouter.adminLogout)

module.exports=admin_router