const express=require("express")
const adminRouter=require('../Controllers/admin/adminController')
const admin_router=express.Router()
const upload=require('../Utils/multer')
const auth=require('../Middleware/admin/adminsession')

admin_router.get('/admin',auth.adminLogout,adminRouter.adminLogin)
admin_router.post('/admin',adminRouter.adminVerification)
admin_router.get('/adminhome',auth.adminLogin,adminRouter.loadAdminHome)

admin_router.get('/user-manage',auth.adminLogin,adminRouter.loadUser)
admin_router.get('/admin-panel',adminRouter.updateUser)

admin_router.get('/category',auth.adminLogin,adminRouter.category)
admin_router.post('/insert-category',adminRouter.insertCategory)
admin_router.get('/action-category',adminRouter.listUnlistCategory)
admin_router.get('/edit-category',auth.adminLogin,adminRouter.editCategory)
admin_router.post('/edit-category',adminRouter.updateCategory)

admin_router.get('/product',auth.adminLogin,adminRouter.product)
admin_router.post('/insert-product',upload.single('image'),adminRouter.insertProduct)
admin_router.get('/action-product',adminRouter.listUnlistProduct)
admin_router.get('/edit-product',adminRouter.editProduct)
admin_router.post('/edit-product',upload.single('image'),adminRouter.updateProduct)

const order=require('../Controllers/admin/orderManagement')
admin_router.get('/order-manage',order.loadOrder)
admin_router.post('/status',order.statusUpdate)               

admin_router.get('/admin-logout',adminRouter.adminLogout)

module.exports=admin_router