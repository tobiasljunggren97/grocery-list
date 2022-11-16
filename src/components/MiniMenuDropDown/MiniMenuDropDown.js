import "./MiniMenuDropDown.css";
import { forwardRef } from 'react'
import {ImCross} from 'react-icons/im'
import {MdOutlineCheckBox} from 'react-icons/md'
import {BiRightArrow, BiUpArrow} from 'react-icons/bi'


export const MiniMenuDropDown = forwardRef((props,ref) => {
    const {groceryList, setGroceryList, checkedList, setCheckedList, miniMenuDroppedDown, setMiniMenuDroppedDown, checkOffItem, uncheckItem, savedGroceries, setSavedGroceries} = props


    function handleRemove(setList){
        setList(prevList => {
            const newList = [...prevList]
            newList.splice(miniMenuDroppedDown.index, 1)
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
        if(category === null){
            const categories = []
            savedGroceries.forEach(item => {
                if(!categories.includes(item.category)){
                    categories.push(item.category)
                }
            })
            if(categories.includes("New category")){
                let count = 1;
                while(categories.includes(`New category (${count})`)){
                    count++
                }
                category = `New category (${count})`
            } else {
                category = "New category"
            }
        }

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
            <div>{groceryList[miniMenuDroppedDown.index].item}</div>
            <div className="mini-menu-dropdown-item" onClick={() => handleRemove(setGroceryList)}><ImCross className="mini-menu-dropdown-cross"/> Remove item</div>
            <div className="mini-menu-dropdown-item" onClick={handleCheck}><MdOutlineCheckBox className="mini-menu-dropdown-checkbox"/> Check off item</div>
            <div className="mini-menu-dropdown-item" onClick={handleCategories}><BiUpArrow className="mini-menu-dropdown-arrow"/>Add to category</div>
            <div className="mini-menu-dropdown-item" onClick={() => setMiniMenuDroppedDown({droppedDown: false, index: null, list: "groceryList"})}>Close</div>
        </div>
        )
    }

    const CheckedMenu = () => {
        return (
            <div className="mini-menu-dropdown">
            <div><s>{checkedList[miniMenuDroppedDown.index].item}</s></div>
            <div className="mini-menu-dropdown-item" onClick={() => handleRemove(setCheckedList)}><ImCross className="mini-menu-dropdown-cross"/> Clear item</div>
            <div className="mini-menu-dropdown-item" onClick={handleUncheck}><MdOutlineCheckBox className="mini-menu-dropdown-checkbox"/> Uncheck item</div>

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
            if(categories.includes("Uncategorized")){
                categories.splice(categories.indexOf("Uncategorized"), 1)
            }
            categories.sort()
            return categories
        }

        return (
        <div className="mini-menu-dropdown">
            <div>{groceryList[miniMenuDroppedDown.index].item}</div>
            {categories().map(category => <div className="mini-menu-dropdown-item" onClick={() => handleItemCategoryChange(category)}>{category}</div>)}
            <div className="mini-menu-dropdown-item" onClick={() => handleItemCategoryChange(null)}>..New category</div>
            <div className="mini-menu-dropdown-item" onClick={handleCategories}><BiRightArrow className="mini-menu-dropdown-arrow"/>Back</div>
            <div className="mini-menu-dropdown-item" onClick={() => setMiniMenuDroppedDown({droppedDown: false, index: null, list: "groceryList"})}>Close</div>
        </div>
        )
    }

    const MiniMenu = () => {
        if(miniMenuDroppedDown.list === "groceryList"){
            return <GroceryMenu />
        } else if(miniMenuDroppedDown.list === "checkedList"){
            return <CheckedMenu />
        } else if(miniMenuDroppedDown.list === "categoriesList"){
            return <CategoriesMenu />
        }
    }

    return (
       <div ref={ref}><MiniMenu /></div>
    )
}
)