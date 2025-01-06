import { createContext, useState } from "react"

export const DataContext = createContext();

const  DataProvider = ({children}) => {
    const [userData, setUserData] = useState(null);
    const [cartItems, setCartedItems] = useState([]);
    const [searchContent, setSearchContent] = useState("");
    const [isAdminPanelVisible, setIsAdminPanelVisible] = useState(true);
    const [totalProductsCount, setTotalProductsCount] = useState(1);
    const [visibleBlockingForm,setvisibleBlockingForm] = useState(false);
    const [currentView, setCurrentView] = useState("allusers");
    


    return(
        <>
        <DataContext.Provider value={{userData, setUserData, currentView, setCurrentView, searchContent, setSearchContent, isAdminPanelVisible, setIsAdminPanelVisible, totalProductsCount, setTotalProductsCount, visibleBlockingForm, setvisibleBlockingForm}}>
        {children}
        </DataContext.Provider>
        </>
    )
}
export default DataProvider;