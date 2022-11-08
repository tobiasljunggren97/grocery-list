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
  const [categories, setCategories] = useState(JSON.parse(localStorage.getItem('categories')) || ["Uncategorized"])
  const [displayAutoComplete, setDisplayAutoComplete] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [dragging, setDragging] = useState(false)
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
      checkIfSaved(capitalizedItem)
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

      const newGroceryList = [...groceryList, {item: capitalizedItem, quantity: quantity || 1, category: 'Uncategorized'}]
      setGroceryList(newGroceryList)
      setNewItem('')
    }
  }


  function checkIfSaved(groceryItem){
      // Check if item is added to savedGroceries
      if(!savedGroceries.some(item => item === groceryItem)) { 
        setSavedGroceries(prevSavedGroceries => [groceryItem, ...prevSavedGroceries])
      } else {
        // if the input is already in the saved groceries, move it to the top
        const index = savedGroceries.indexOf(groceryItem)
        const newSavedGroceries = savedGroceries
        newSavedGroceries.splice(index, 1)
        setSavedGroceries([groceryItem, ...newSavedGroceries])
      }    
  }


  function handleQuantity(index, value, list, setList) {
    if(value === 0){
      handleDelete(index, list, setList)  
      return
    }
    const newList = [...list]
    newList[index] = {item: newList[index].item, quantity: value, category: newList[index].category}
    setList(newList)
    }

  function handleDragEnd(result) {
    setDragging(false)
    if (!result.destination) return
    if(result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return
    if(result.destination.droppableId === result.source.droppableId){
      if(result.destination.droppableId === 'groceryList'){
        moveItem(result.source.index, result.destination.index, groceryList, null, setGroceryList, null)
        return
      }
      if(result.destination.droppableId === 'checkedList'){
        moveItem(result.source.index, result.destination.index, checkedList, null, setCheckedList, null)
        return
      }
    }
    if(result.destination.droppableId === 'checkedList'){
      moveItem(result.source.index, result.destination.index, groceryList, checkedList, setGroceryList, setCheckedList)
      return
    }
    if(result.destination.droppableId === 'groceryList'){
      moveItem(result.source.index, result.destination.index, checkedList, groceryList, setCheckedList, setGroceryList)
      return
    }
  }

  function moveItem(fromIndex, toIndex, fromList, toList, setFromList, setToList) {
    if(!setToList){
      const items = Array.from(fromList)
      const [reorderedItem] = items.splice(fromIndex, 1)
      items.splice(toIndex, 0, reorderedItem)
      setFromList(items)
      return
    }
    const newFromList = [...fromList]
    const newToList = [...toList]
    const [reorderedItem] = newFromList.splice(fromIndex, 1)
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
        <div className="list-items">
        {/* {droppable(<p>Drop here to add category</p>, "setCategory", "set-category")} */}
        {droppable(<ListItems 
                    list={groceryList} 
                    setList={setGroceryList}
                    checkedList={checkedList}
                    setCheckedList={setCheckedList}
                    handleQuantity={handleQuantity}
                    moveItem={moveItem}
                    draggable={draggable}  
        />, "groceryList", "uncategorized-list-items")}
        </div>
        <div className="list-items">
        {checkedList.length > 0 ? 
          <div className="checked-title"><span className="line-4"/><button onClick={() => setCheckedList([])}>Clear</button><span className="line-5"/><h4>Checked Off</h4><span className="line-3"/></div>
        : null
        }
        {droppable(<CheckedListItems
                    checkedList={checkedList}
                    setCheckedList={setCheckedList}
                    moveItem={moveItem}
                    handleQuantity={handleQuantity}
                    groceryList={groceryList}
                    setGroceryList={setGroceryList}
                    draggable={draggable}
        />, "checkedList", "checked-list-items")}
        </div>
      </DragDropContext>
    </div>
  )
}

export default App
