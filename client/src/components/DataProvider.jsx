import { createContext, useState } from "react"

export const DataContext = createContext();

const  DataProvider = ({children}) => {
    const [userData, setUserData] = useState(null);
    const [showShippingForm, setShowShippingForm] = useState(false);
    const [cartItems, setCartedItems] = useState([]);

    return(
        <>
        <DataContext.Provider value={{userData, setUserData, showShippingForm, setShowShippingForm}}>
        {children}
        </DataContext.Provider>
        </>
    )
}
export default DataProvider;