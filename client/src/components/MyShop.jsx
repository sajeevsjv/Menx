import React from "react";
import { useEffect } from "react";

function MyShop(){


useEffect(()=>{
  loadMyProducts = async ()=>{
    const user_id = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("authToken");
    try {
      let response = await axios({
        method: "GET",
        url: `http://localhost:3003/getsingleuser/${user_id}`,
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      })

      console.log("response from 2nd useefect :", response);
      let data = response.data.data;
      console.log("response data :", data);
      let cartWithQuantities = data.cart.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));
      setCartItems(cartWithQuantities);
    }
    catch (error) {
      if (error.response) {
        console.log("eror response :", error.response);
      }
      console.log("error :", error);
    }
  }
  loadMyProducts();
},[])
return(
    <>
    <div className="main-grid-container mb-8 pb-10 pt-2 bg-[#cc7f3c] w-full flex flex-col items-center  justify-center">
                <div className="newin-text w-11/12 my-4">
                    <span className="text-2xl newin text-white">
                        NEW IN
                    </span>
                </div>
                <div className="newin-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  gap-4 w-11/12">
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fda%2Fea%2Fdaea0e239cfb458343f87a8b8ff0e9d2a4c4c25e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVEDETAIL%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Slim Fit Easy-iron shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://m.media-amazon.com/images/I/61GtS6IrR7L._SX569_.jpg" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Stylish Shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1 ">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://m.media-amazon.com/images/I/61GtS6IrR7L._SX569_.jpg" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Stylish Shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1 ">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://m.media-amazon.com/images/I/61GtS6IrR7L._SX569_.jpg" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Stylish Shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://m.media-amazon.com/images/I/61GtS6IrR7L._SX569_.jpg" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Stylish Shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    </>
)
}
export default MyShop;