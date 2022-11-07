import './App.css'
import {useState, useEffect, useRef, React } from 'react'
import {DragDropContext} from '@hello-pangea/dnd'
import {draggable, droppable} from './scripts/dnd'
import {handleDelete} from './handleLists'
import {MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank} from 'react-icons/md'
import {ImCross} from 'react-icons/im'

function App() {
  const [groceryList, setGroceryList] = useState(JSON.parse(localStorage.getItem('groceryList')) || [])
  const [savedGroceries, setSavedGroceries] = useState(JSON.parse(localStorage.getItem('savedGroceries')) || [])
  const [checkedList, setCheckedList] = useState(JSON.parse(localStorage.getItem('checkedList')) || [])
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

      const newGroceryList = [...groceryList, {item: capitalizedItem, quantity: quantity || 1, category: 'undefined'}]
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
    newList[index] = {item: newList[index].item, quantity: value}
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

  const CheckedListItems = () => {
    return checkedList.map((check, index) => {
      return (
        draggable(CheckedItem(index), index, check.item, "list-item")
      )
    })
  }

  const CheckedItem = (index) => {
    return (
      <>
      <div>
        <button onClick={() => handleQuantity(index, checkedList[index].quantity - 1, checkedList, setCheckedList)}>-</button>
        <input type="text" className="list-quantity-input" onChange={e => handleQuantity(index, e.target.value.match(new RegExp(/[^0-9]/, 'g')) ?  e.target.value : checkedList[index].quantity)} value={checkedList[index].quantity}></input>
        <button onClick={() => handleQuantity(index, checkedList[index].quantity + 1, checkedList, setCheckedList)}>+</button>
      </div>
      <span className="list-item-text"><s>{checkedList[index].item}</s></span>
        <div className="checkbox" type="checkbox" onClick={() => moveItem(index, groceryList.length, checkedList, groceryList, setCheckedList, setGroceryList)}><MdOutlineCheckBox  /></div>
    </>
    )
  }

  function ListItems(props) {
    const {list, setList} = props
    return (
     list.map((grocery, index) => {
      return (
        draggable(ListItem(index, list, setList), index, grocery.item, "list-item")
      )
    }))
  }

  function ListItem(index, list, setList) {
    return (
      <>
      <div>
        <button onClick={() => handleQuantity(index, list[index].quantity - 1, list, setList)}>-</button>
        <input type="text" className="list-quantity-input" onChange={e => handleQuantity(index, e.target.value.match(new RegExp(/[^0-9]/, 'g')) ?  e.target.value : list[index].quantity)} value={list[index].quantity}></input>
        <button onClick={() => handleQuantity(index, list[index].quantity + 1, list, setList)}>+</button>
      </div>
      <span className="list-item-text">{list[index].item}</span>
        <div className="checkbox" type="checkbox" onClick={() => moveItem(index, 0, list, checkedList, setList, setCheckedList)}><MdOutlineCheckBoxOutlineBlank/></div>
    </>
    )
  }

  const dropDownDiv = (item, index) => { 
    return (
      <div key={index} className="dropdown-item" onClick={() => dropDownClick(item)}>
        <span className="dropdown-item-text">{item}</span>
        <span 
          onClick={(e) => {
          e.stopPropagation()
          return setSavedGroceries(prevSavedGroceries => {
          const newSavedGroceries = [...prevSavedGroceries]
          newSavedGroceries.splice(index, 1)
          return newSavedGroceries
        })}} className="cross">
          <ImCross /> 
        </span> 
        {groceryList.some(grocery => grocery.item === item) ? <div className="dropdown-item-onlist-text">Already on list</div> : null}
      </div>
      )
  }

  const DropDownList = () => {
    const filterItems = savedGroceries.filter(savedGrocery => savedGrocery.toLowerCase().includes(newItem.toLowerCase())).map(
      (savedGrocery, index) => dropDownDiv(savedGrocery, index))
    return (
      <div className="dropdown" ref={wrapperRef}>
        <div className="dropdown-content">
          {newItem.length < 1 ? savedGroceries.map((savedGrocery, index) => dropDownDiv(savedGrocery, index))
          : <span>{filterItems.length > 0 ? filterItems : dropDownDiv(newItem.charAt(0).toUpperCase() + newItem.slice(1).toLowerCase(), 999)}</span>
            }
          </div>
      </div>
    )
  }

  function dropDownClick(item){
    handleSubmit(null, item)
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
      {displayAutoComplete && (newItem.length > 0 || savedGroceries.length > 0) ? <DropDownList />: null}
      </div>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setDragging(true)}>
        <div className="list-items">
        {groceryList.length > 0 ? droppable(<p>{dragging ? "Drop here to add category" : ""}</p>, "setCategory", "set-category"):null}
        {groceryList.length > 0 ? <div className="category"><span className="line-1"></span><h4>Uncategorized</h4><span className="line-2"></span></div> : null}
        {droppable(<ListItems list={groceryList} setList={setGroceryList} />, "groceryList", "uncategorized-list-items")}
        </div>

        
        <div className="list-items">
        {checkedList.length > 0 ? 
          <div className="checked-title"><span className="line-3"/><h4>Checked Off</h4><span className="line-4"/><button onClick={() => setCheckedList([])}>Clear</button><span className="line-5"/></div>
          : null}
        {droppable(<CheckedListItems/>, "checkedList", "checked-list-items")}
        </div>
      </DragDropContext>
    </div>
  )
}

export default App
