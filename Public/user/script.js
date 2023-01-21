function incqty(productId,i){
    $.ajax({
        url:'/cart-incQty',
        method:'put',
        data:{id:productId},
        success: (res) =>{
            // $(`#cartQty${i}`).html(res.data.existProduct.qty)
            // $(`#cartPrice${i}`).html(res.data.existProduct.price)
            location.reload()
        }
    })
}

function decqty(productId,i){
    $.ajax({
        url:'/cart-decQty',
        method:'put',
        data:{id:productId},
        success: (res) =>{
            // $(`#cartQty${i}`).html(res.data.existProduct.qty)
            // $(`#cartPrice${i}`).html(res.data.existProduct.price)
            location.reload()
        }
    })
}

function chooseaddress(address){
    $.ajax({
        url:'/checkout',
        method:'put',
        data:{id:address},
        success: (res)=>{
            $("#type").val(res.data[0].address.addresstype)
            $("#name").val(res.data[0].address.name)
            $("#address").val(res.data[0].address.address)
            $("#district").val(res.data[0].address.district)
            $("#state").val(res.data[0].address.state)
            $("#country").val(res.data[0].address.country)
            $("#pin").val(res.data[0].address.pin)
            $("#mobile").val(res.data[0].address.mobile)
        }
    })
}

function couponCheck(){
    event.preventDefault()

var inputValue=$("#couponCode").val()

        $.ajax({
        type:"post",
        url:"/coupon-check",
        data:{ input:inputValue,total:$("#subtotal").html() },
        success: function(response){
            if(response.couponApplied){
                $("#message").html('Coupon Applied').css('color','green');
                let discount=response.couponApplied.discount
                let code=response.couponApplied.code
                let couponId=response.couponApplied._id
                let subtotal=$('#subtotal').html()
                discount=parseInt(discount)
                subtotal=parseInt(subtotal)
                // let discountedPrice=(discount*subtotal)/100
                subtotal=subtotal-discount
                $('#total').html(subtotal)
                $('#coupon_code').html(code)
                $('#coupon_discount').html(discount)
                $('#couponId').val(couponId)
                $('#total_amount').val(subtotal)
                }
                if(response.notExist){
                    $('#message').html('Coupon not found!').css('color','red')
                }
                if(response.expired){
                    $('#message').html('Coupon Expired!').css('color','red')
                }
                if(response.userUsed){
                    $('#message').html('This coupon already used').css('color','red')
                }
                if(response.minpurchaseamount){
                    let minAmount=response.minpurchaseamount
                    $('#message').html('Minimum amount '+minAmount+' required!').css('color','red')
                }
            }
        })
    }

    function addToWish(id){
        $.ajax({
            url:'/add-towishlist',
            method:'get',
            data : {
                 id
            },
           
            success:(res)=>{
                if(res.wish){
                    Swal.fire({
                        position: 'center',
                            icon: 'warning',
                            title: 'Product Already in Wishlist..!',
                            showConfirmButton: false,
                            timer: 1500
                      });             
                    }
                    if(res.success){
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'product add successfully',
                            showConfirmButton: false,
                            timer: 1500
                          })
                          let count=res.count
                          $("#wish_count").html(count)
    
                    }
            }
        })
    }

