import { forwardRef } from 'react'
import {ImCross} from 'react-icons/im'
import './DropDownList.css'

export const DropDownList = forwardRef((props,ref) => {
    const {savedGroceries, setSavedGroceries, newItem, handleSubmit, groceryList, checkedList, setDisplayAddItems, setNewItem, setMiniMenuDroppedDown} = props

    const filterItems = savedGroceries.filter(savedGrocery => savedGrocery.item.toLowerCase().includes(newItem.toLowerCase())).map(
      (savedGrocery, index) => dropDownDiv(savedGrocery.item, index, setSavedGroceries, groceryList, checkedList, handleSubmit))


      

    return (
      <div ref={ref}>
        <form onSubmit={handleSubmit} className="dropdown-form">
        <input className="dropdown-item" type="text" placeholder="Add an item..." value={newItem} 
        onChange={event => {setDisplayAddItems(true); return setNewItem(event.target.value)}} 
        onClick={() => {
        setMiniMenuDroppedDown({droppedDown: false, index: null, list: "groceryList"})}} 
        autoFocus
      />
        </form>
        {filterItems.length > 0 || newItem.length > 0 ?
      <div className="dropdown">
        <div className="dropdown-content">
        <div className="dropdown-items">
          {newItem.length < 1 ? savedGroceries.map((savedGrocery, index) => dropDownDiv(savedGrocery.item, index, setSavedGroceries, groceryList, checkedList, handleSubmit))
          : <span>{filterItems.length > 0 ? filterItems : dropDownDiv(newItem.charAt(0).toUpperCase() + newItem.slice(1).toLowerCase(), 999, setSavedGroceries, groceryList, checkedList, handleSubmit)}</span>
            }
          </div>
          </div>
      </div> : null}
      
      </div>
    )
  }
  )

const dropDownDiv = (item, index, setSavedGroceries, groceryList, checkedList, handleSubmit) => { 
    return (
      <div key={index} className="dropdown-item" onClick={() => handleSubmit(null, item)}>
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
        {checkedList.some(grocery => grocery.item === item) ? <div className="dropdown-item-checked-text">Checked Off</div> : null}
      </div>
      )
  }

  

