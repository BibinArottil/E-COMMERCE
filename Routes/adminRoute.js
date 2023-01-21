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
admin_router.get('/view',order.orederView)
admin_router.post('/sales',order.pdfData)
// admin_router.get('/download',order.exportPdf)

const banner=require('../Controllers/admin/banner')
admin_router.get('/banner',banner.bannerView)
admin_router.post('/insert-banner',upload.single('image'),banner.insertBanner)
admin_router.get('/action-banner',banner.bannerAction)
admin_router.get('/edit-banner',banner.editBanner)
admin_router.post('/update-banner',upload.single('image'),banner.updateBanner)

const coupen=require('../Controllers/admin/coupen')
admin_router.get('/coupen',coupen.viewCoupen)
admin_router.post('/add-coupen',coupen.addCoupen)
admin_router.get('/action-coupen',coupen.blockUnblock)
admin_router.get('/edit-coupen',coupen.editCoupen)
admin_router.post('/update-coupen',coupen.updateCoupen)

admin_router.get('/admin-logout',adminRouter.adminLogout)

module.exports=admin_router