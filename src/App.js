import './App.css'
import {useState, useEffect, useRef, React } from 'react'
import {DragDropContext} from '@hello-pangea/dnd'
import {draggable, droppable} from './scripts/dnd'
import {handleDelete} from './scripts/handleLists'
import ListItems from './components/ListItem/ListItems'
import CheckedListItems from './components/ListItem/CheckedListItems'
import {DropDownList} from './components/DropDownList/DropDownList'

function App() {
  const [groceryList, setGroceryList] = useState(JSON.parse(localStorage.getItem('groceryList')) || [])
  const [savedGroceries, setSavedGroceries] = useState(JSON.parse(localStorage.getItem('savedGroceries')) || [])
  const [checkedList, setCheckedList] = useState(JSON.parse(localStorage.getItem('checkedList')) || [])
  const firstCategory = "Uncategorized"
  const [displayAutoComplete, setDisplayAutoComplete] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [dragging, setDragging] = useState(false)
  const [categoryChange, setCategoryChange] = useState({isChanging: false, index: null, value: ""})
  const wrapperRef = useRef();

  useEffect(() => {
    localStorage.setItem('groceryList', JSON.stringify(groceryList))
    localStorage.setItem('checkedList', JSON.stringify(checkedList))
    localStorage.setItem('savedGroceries', JSON.stringify(savedGroceries))
  }, [groceryList, checkedList, savedGroceries])
  

  function handleSubmit(event, item) {
    setDisplayAutoComplete(false)
    const itemToAdd = item || newItem
    if(event !== null){
      event.preventDefault()
    }
    // if the input is empty, do nothing
    if(itemToAdd !== '') {
      const capitalizedItem = itemToAdd.charAt(0).toUpperCase() + itemToAdd.slice(1).toLowerCase()
      //Set category to first category if it is empty, and sort dropdownlist (savedGroceries) so that new item appears first
      const category = checkIfSaved(capitalizedItem, firstCategory)
      // if the input is not already in the grocery list, add it
      if(groceryList.some(e => e.item === capitalizedItem)) {
        //Item already exists, put it on top
        const oldIndex = groceryList.findIndex(e => e.item === capitalizedItem)
        const itemToMove = groceryList[oldIndex]
        itemToMove.quantity++
        const newList = groceryList.filter(e => e.item !== capitalizedItem)
        newList.unshift(itemToMove)
        setGroceryList(newList)
        setNewItem('')
        return
      }
      let quantity
      //Check if item is checked off
      if(checkedList.some(e => e.item === capitalizedItem)) {
        const index = checkedList.findIndex(e => e.item === capitalizedItem)
        quantity = checkedList[index].quantity
        handleDelete(index, checkedList, setCheckedList)
      }
      const newGroceryList = [...groceryList, {item: capitalizedItem, quantity: quantity || 1, category: category}]
      setGroceryList(newGroceryList)
      setNewItem('')
    }
  }

  function handleDragEnd(result) {
    setDragging(false)
    if (!result.destination) return
    if(result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return
    if(result.destination.droppableId === result.source.droppableId){
      if(result.destination.droppableId === 'groceryList'){
        moveItem(result.source.index, result.destination.index, groceryList, null, setGroceryList, null, true)
        return
      }
      if(result.destination.droppableId === 'checkedList'){
        moveItem(result.source.index, result.destination.index, checkedList, null, setCheckedList, null, false)
        return
      }
    }
    if(result.destination.droppableId === 'checkedList'){
      moveItem(result.source.index, result.destination.index, groceryList, checkedList, setGroceryList, setCheckedList, false)
      return
    }
    if(result.destination.droppableId === 'groceryList'){
      moveItem(result.source.index, result.destination.index, checkedList, groceryList, setCheckedList, setGroceryList, true)
      return
    }
  }

  function checkIfSaved(groceryItem, category){
      // Check if item is added to savedGroceries
      if(!savedGroceries.some(e => e.item === groceryItem)) { 
        setSavedGroceries(prevSavedGroceries => [{item: groceryItem, category: category}, ...prevSavedGroceries])
        return category
      } else {
        // if the input is already in the saved groceries, move it to the top
        const index = savedGroceries.findIndex(e => e.item === groceryItem)
        const newSavedGroceries = savedGroceries
        const savedItem = newSavedGroceries[index]
        newSavedGroceries.splice(index, 1)
        setSavedGroceries([{item: savedItem.item, category: savedItem.category}, ...newSavedGroceries])
        return savedItem.category
      }    
  }

  function handleQuantity(index, value, list, setList) {
    if(value <= 0){
      handleDelete(index, list, setList)  
      return
    }
    const newList = [...list]
    newList[index] = {item: newList[index].item, quantity: value, category: newList[index].category}
    setList(newList)
    }

  function handleCategoryChange(index, newCategory, list, setList) {
    const oldCategory = list[index].category

    const newList = [...list]
    list.forEach((item, i) => {
      if(item.category === oldCategory){
        newList[i] = {item: newList[i].item, quantity: newList[i].quantity, category: newCategory}
      }
    })

    const newSavedGroceries = [...savedGroceries]
    savedGroceries.forEach((item, i) => {
      if(item.category === oldCategory){
        newSavedGroceries[i] = {item: newSavedGroceries[i].item, category: newCategory}
      }
    })

    const newCheckedList = [...checkedList]
    checkedList.forEach((item, i) => {
      if(item.category === oldCategory){
        newCheckedList[i] = {item: newCheckedList[i].item, quantity: newCheckedList[i].quantity, category: newCategory}
      }
    })

    setList(newList)
    setSavedGroceries(newSavedGroceries)
    setCheckedList(newCheckedList)
    setCategoryChange({isChanging: false, index: null, value: ""})
  }



  function moveItem(fromIndex, toIndex, fromList, toList, setFromList, setToList, changeCategory) {
    function findCategory(){
      //Dont change category
      if((fromIndex === toIndex && toList === null) || !changeCategory){ 
        console.log("Line 150")
        return fromList[fromIndex].category
      }
      //Change category
      if(toList === null || toList.length === 0 ){
        if(fromIndex > toIndex){
          console.log("Line 156")
          return fromList[toIndex-1].category
        }
        console.log("Line 159")
        return fromList[toIndex].category
      }
      if(toIndex === 0) return toList[0].category
      console.log("Line 163")
      return toList[toIndex-1].category
    }

    const categoryToChangeTo = findCategory()

    if(categoryToChangeTo !== fromList[fromIndex].category) {
      setSavedGroceries(prevSavedGroceries => {
        const i = prevSavedGroceries.findIndex(e => e.item === fromList[fromIndex].item)
        const newSavedGroceries = prevSavedGroceries
        newSavedGroceries[i] = {item: fromList[fromIndex].item, category: categoryToChangeTo}
        return newSavedGroceries
      })
    }

    if(!setToList){
      const items = Array.from(fromList)
      const [reorderedItem] = items.splice(fromIndex, 1)
      reorderedItem.category = categoryToChangeTo
      items.splice(toIndex, 0, reorderedItem)
      setFromList(items)
      return
    }
    const newFromList = [...fromList]
    const newToList = [...toList]
    const [reorderedItem] = newFromList.splice(fromIndex, 1)
    reorderedItem.category = categoryToChangeTo
    newToList.splice(toIndex, 0, reorderedItem)
    setFromList(newFromList)
    setToList(newToList)
  }

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    }
  })

  const handleClickOutside = event => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplayAutoComplete(false);
    }
  }

  return (
    <div className="App">
      <h3>My Groceries</h3>
      <div className="input-form">
      <form onSubmit={handleSubmit}>
        <input className="grocery-input" type="text" placeholder="Add an item..." value={newItem} onChange={event => {setDisplayAutoComplete(true); return setNewItem(event.target.value)}} onClick={() => setDisplayAutoComplete(prev => !prev)} />
        <button type="submit">+</button>
      </form>
      {displayAutoComplete && (newItem.length > 0 || savedGroceries.length > 0) ? 
      <DropDownList
        savedGroceries={savedGroceries}
        setSavedGroceries={setSavedGroceries}
        newItem={newItem}
        handleSubmit={handleSubmit}
        groceryList={groceryList}
        checkedList={checkedList}
        ref={wrapperRef}
      />: null}
      </div>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setDragging(true)}>
      <ListItems 
                    list={groceryList} 
                    setList={setGroceryList}
                    checkedList={checkedList}
                    setCheckedList={setCheckedList}
                    handleQuantity={handleQuantity}
                    moveItem={moveItem}
                    draggable={draggable}
                    categoryChange={categoryChange}
                    setCategoryChange={setCategoryChange}
                    handleCategoryChange={handleCategoryChange} 
                    dragging={dragging} 
      />
      <CheckedListItems
                    checkedList={checkedList}
                    setCheckedList={setCheckedList}
                    moveItem={moveItem}
                    handleQuantity={handleQuantity}
                    groceryList={groceryList}
                    setGroceryList={setGroceryList}
                    draggable={draggable}
      />
      </DragDropContext>
    </div>
  )
}

export default App
