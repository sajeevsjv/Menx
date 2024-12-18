import { createContext, useState } from "react"

export const DataContext = createContext();

const  DataProvider = ({children}) => {
    const [userData, setUserData] = useState(null);
    const [cartItems, setCartedItems] = useState([]);
    const [searchContent, setSearchContent] = useState("");

    return(
        <>
        <DataContext.Provider value={{userData, setUserData, searchContent, setSearchContent}}>
        {children}
        </DataContext.Provider>
        </>
    )
}
export default DataProvider;