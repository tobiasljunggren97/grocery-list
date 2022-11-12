import "./MiniMenuDropDown.css";
import {ImCross} from 'react-icons/im'
import {MdOutlineCheckBox} from 'react-icons/md'
import {BiRightArrow, BiDownArrow} from 'react-icons/bi'


export default function MiniMenuDropDown(props) {
    const {index, groceryList, setGroceryList, miniMenuDroppedDown, setMiniMenuDroppedDown, checkOffItem, uncheckItem, savedGroceries, setSavedGroceries} = props


    function handleRemove(){
        setGroceryList(prevList => {
            const newList = [...prevList]
            newList.splice(index, 1)
            return newList
        })
        setMiniMenuDroppedDown({droppedDown: false, index: null, list: "groceryList"})
    }

    function handleCheck(){
        checkOffItem(miniMenuDroppedDown.index)
        setMiniMenuDroppedDown({droppedDown: false, index: null, list: "groceryList"})
    }

    function handleCategories(){
        miniMenuDroppedDown.list === "groceryList" ? 
        setMiniMenuDroppedDown(prevMiniMenuDroppedDown => ({droppedDown: true, index: prevMiniMenuDroppedDown.index, list: "categoriesList"}))
        :
        setMiniMenuDroppedDown(prevMiniMenuDroppedDown => ({droppedDown: true, index: prevMiniMenuDroppedDown.index, list: "groceryList"}))
    }

    function handleUncheck(){
        uncheckItem(miniMenuDroppedDown.index)
        setMiniMenuDroppedDown({droppedDown: false, index: null, list: "checkedList"})
    }

    function handleItemCategoryChange(category){
        const newList = [...groceryList]
        newList[miniMenuDroppedDown.index].category = category
        setGroceryList(newList)

        setSavedGroceries(prevSavedGroceries => {
            const groceryListItem = groceryList[miniMenuDroppedDown.index].item
            const i = prevSavedGroceries.findIndex(e => e.item === groceryListItem)
            const newSavedGroceries = prevSavedGroceries
            newSavedGroceries[i] = {item: groceryListItem, category: category}
            return newSavedGroceries})

        setMiniMenuDroppedDown({droppedDown: false, index: null, list: "groceryList"})
    }


    const GroceryMenu = () => {
        return (
            <div className="mini-menu-dropdown">
            <div className="mini-menu-dropdown-item" onClick={handleCheck}><MdOutlineCheckBox className="mini-menu-dropdown-checkbox"/> Check off list</div>
            <div className="mini-menu-dropdown-item" onClick={handleRemove}><ImCross className="mini-menu-dropdown-cross"/> Remove item</div>
            <div className="mini-menu-dropdown-item" onClick={handleCategories}><BiRightArrow className="mini-menu-dropdown-arrow"/>Add to category</div>
            <div className="mini-menu-dropdown-item" onClick={() => setMiniMenuDroppedDown({droppedDown: false, index: null, list: "groceryList"})}>Close</div>
        </div>
        )
    }

    const CategoriesMenu = () => {
        const categories = () => {
            const categories = []
            savedGroceries.forEach(item => {
                if(!categories.includes(item.category)){
                    categories.push(item.category)
                }
            })
            return categories
        }

        return (
        <div className="mini-menu-dropdown">
            {categories().map(category => <div className="mini-menu-dropdown-item" onClick={() => handleItemCategoryChange(category)}>{category}</div>)}
            <div className="mini-menu-dropdown-item">..New category</div>
            <div className="mini-menu-dropdown-item" onClick={handleCategories}><BiDownArrow className="mini-menu-dropdown-arrow"/>Back</div>
            <div className="mini-menu-dropdown-item" onClick={() => setMiniMenuDroppedDown({droppedDown: false, index: null, list: "groceryList"})}>Close</div>
        </div>
        )
    }

    return (
        miniMenuDroppedDown.list === "groceryList" ? <GroceryMenu /> : <CategoriesMenu/>
    )
}