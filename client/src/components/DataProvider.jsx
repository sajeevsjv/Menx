import { createContext, useState } from "react"

export const DataContext = createContext();

const  DataProvider = ({children}) => {
    const [userData, setUserData] = useState(null);
    const [showShippingForm, setShowShippingForm] = useState(false);
    const [cartItems, setCartedItems] = useState([]);
    const [showLoginForm, setShowLoginForm] = useState(false);

    return(
        <>
        <DataContext.Provider value={{userData, setUserData, showShippingForm, setShowShippingForm, showLoginForm, setShowLoginForm}}>
        {children}
        </DataContext.Provider>
        </>
    )
}
export default DataProvider;