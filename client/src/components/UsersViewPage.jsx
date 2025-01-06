import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminNav from "./AdminNav";
import Breadcrumb from "./Breadcrumb";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import BlockProductForm from "./BlockProductForm";


const UserViewPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const userId = id;
    const [userDetails, setUserDetails] = useState(null);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBlockFormVisible, setIsBlockFormVisible] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [showUserBlockForm, setShowUserBlockForm] = useState(false);



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const authToken = localStorage.getItem("authToken");

                const userResponse = await axios.get(`http://localhost:3003/getsingleuser/${userId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setUserDetails(userResponse.data.data);

                const productsResponse = await axios.get(`http://localhost:3003/sellerproducts/${userId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setSellerProducts(productsResponse.data.data);

                // const commentsCount = blogsResponse.data.data.reduce((acc, blog) => acc + blog.comments.length, 0);
                // setTotalComments(commentsCount);

            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleBlockButtonClick = (e, productId) => {
        e.stopPropagation();
        setCurrentProductId(productId);
        setIsBlockFormVisible(true);
    };

    const handleCloseBlockForm = () => {
        setIsBlockFormVisible(false);
        setCurrentProductId(null);
    };

    console.log("userdetails :", userDetails);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;



    return (
        <>
            <AdminNav />
            {/* <div className="mt-28 px-7 text-xs space-x-3">
               <Breadcrumb />
            </div> */}

            <div className="user-view-page mt-28 p-6  min-h-screen">
                {userDetails && (
                    <div className="user-info-box p-6 bg-white shadow-lg rounded-lg mb-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-white shadow-md text-white p-2 rounded-full text-4xl">
                                <img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/user.png" alt="user" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">{userDetails.name}</h2>
                                <p className="text-gray-500">User ID: {userDetails._id}</p>
                            </div>
                        </div>

                        <div className="grid py-3 grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="flex items-center text-white space-x-2 p-4 hover:-translate-y-1 duration-300 hover:bg-black  bg-gradient-to-r from-orange-200 to-orange-400 rounded-lg">
                                <ion-icon name="mail-outline" className="text-blue-500 text-2xl"></ion-icon>
                                <p className="text-white">{userDetails.email}</p>
                            </div>
                            <div className="flex cursor-pointer text-white  items-center space-x-2 p-4 hover:-translate-y-1 duration-300 bg-gradient-to-r  from-orange-200 to-orange-400  rounded-lg">
                                <ion-icon name="document-text-outline" className="text-green-500 text-2xl"></ion-icon>
                                <p className="text-white">userType: {userDetails.user_type.user_type}</p>
                            </div>
                            {/* <div className="flex cursor-pointer text-white  items-center space-x-2 hover:-translate-y-1 duration-300 p-5 bg-gradient-to-r  from-orange-200 to-orange-400 rounded-lg">
                                <p className="text-white">Orders </p>
                            </div> */}
                            <div onClick={()=>setShowUserBlockForm(!showUserBlockForm)} className="flex cursor-pointer text-white  items-center space-x-2 hover:-translate-y-1 duration-300 p-5 bg-gradient-to-r from-red-400 to-red-600 rounded-lg">
                                <ion-icon name="warning-outline"></ion-icon>
                                <p  className="text-white">Block User</p>
                            </div>

                        </div>
                        {/* block userform */}
                        {showUserBlockForm &&
                        <div className="p-5 border">
                            <form action="" className="flex flex-col">
                                <textarea rows={5} name="reason" id="reason" placeholder="Enter reason to block" className="border border-orange-400 rounded-md p-4">
                                </textarea>
                                <button className="bg-orange-500 p-3 mt-4 rounded-md w-[20%]">Block user</button>
                            </form>
                        </div>
                        }
                    </div>
                )}

                {/* Products */}
                <div className="newin-section grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  justify-center items-center  gap-4  w-11/12">
                    {sellerProducts?.map((product) => (
                        <div
                            className="product-card"
                            onClick={() => {
                                navigate(`/singleproduct/${product._id}`);
                            }}
                        >
                            <div className="product-image">
                                {product.product_images?.length > 0 ? (
                                    <img
                                        src={`http://localhost:3003/${product.product_images[0]}`}
                                        alt="Product Image"
                                    />
                                ) : (
                                    <p>No Image Available</p>
                                )}

                            </div>

                            <div className="product-details h-36">
                                <h3
                                    className="product-name cursor-pointer"

                                >
                                    {product.name.slice(0, 35)}...
                                </h3>
                                <span className="line-through text-xs">{product.mrp}</span>
                                <p className="font-mono text-orange-500">₹{product.price}</p>
                            </div>

                            <div className="product-actions">
                                <button className="font-mono border  "> stock :{product.stock}</button>
                                <button
                                    onClick={(e) => handleBlockButtonClick(e, product._id)}
                                    className="w-full bg-red-500 text-white text-md tracking-wide"
                                >
                                    Block Item
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isBlockFormVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <BlockProductForm productId={currentProductId} onClose={handleCloseBlockForm} />
                    </div>
                </div>
            )}
        </>
    );
};

export default UserViewPage;
