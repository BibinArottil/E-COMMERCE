const express=require("express")
const adminRouter=require('../Controllers/admin/adminController')
const admin_router=express.Router()
const upload=require('../Utils/multer')
const auth=require('../Middleware/admin/adminsession')

admin_router.get('/admin',auth.adminLogout,adminRouter.adminLogin)
admin_router.post('/admin',adminRouter.adminVerification)
admin_router.get('/adminhome',auth.adminLogin,adminRouter.loadAdminHome)
admin_router.get('/errorAdmin',adminRouter.error404)
admin_router.get('/admin-error',adminRouter.error500)

admin_router.get('/user-manage',auth.adminLogin,adminRouter.loadUser)
admin_router.get('/admin-panel',auth.adminLogin,adminRouter.updateUser)

admin_router.get('/category',auth.adminLogin,adminRouter.category)
admin_router.post('/insert-category',adminRouter.insertCategory)
admin_router.get('/action-category',auth.adminLogin,adminRouter.listUnlistCategory)
admin_router.get('/edit-category',auth.adminLogin,adminRouter.editCategory)
admin_router.post('/edit-category',adminRouter.updateCategory)

admin_router.get('/product',auth.adminLogin,adminRouter.product)
admin_router.post('/insert-product',upload.single('image'),adminRouter.insertProduct)
admin_router.get('/action-product',auth.adminLogin,adminRouter.listUnlistProduct)
admin_router.get('/edit-product',auth.adminLogin,adminRouter.editProduct)
admin_router.post('/edit-product',upload.single('image'),adminRouter.updateProduct)

const order=require('../Controllers/admin/orderManagement')
admin_router.get('/order-manage',auth.adminLogin,order.loadOrder)
admin_router.post('/status',order.statusUpdate)
admin_router.get('/view',auth.adminLogin,order.orederView)
admin_router.post('/sales',order.pdfData)

const banner=require('../Controllers/admin/banner')
admin_router.get('/banner',auth.adminLogin,banner.bannerView)
admin_router.post('/insert-banner',upload.single('image'),banner.insertBanner)
admin_router.get('/action-banner',auth.adminLogin,banner.bannerAction)
admin_router.get('/edit-banner',auth.adminLogin,banner.editBanner)
admin_router.post('/update-banner',upload.single('image'),banner.updateBanner)

const coupen=require('../Controllers/admin/coupen')
admin_router.get('/coupen',auth.adminLogin,coupen.viewCoupen)
admin_router.post('/add-coupen',coupen.addCoupen)
admin_router.get('/action-coupen',auth.adminLogin,coupen.blockUnblock)
admin_router.get('/edit-coupen',auth.adminLogin,coupen.editCoupen)
admin_router.post('/update-coupen',coupen.updateCoupen)

admin_router.get('/admin-logout',adminRouter.adminLogout)

module.exports=admin_router