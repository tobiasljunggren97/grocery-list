import {BsThreeDotsVertical} from 'react-icons/bs'
import {MdOutlineCheckBox} from 'react-icons/md'
import "./ListItems.css"
import {droppable} from '../../scripts/dnd'


export default function CheckedListItems(props) {
    const {checkedList, setCheckedList, moveItem, handleQuantity, groceryList, setGroceryList, draggable, setMiniMenuDroppedDown} = props
    return <div className="list-items">
      {checkedList.length > 0 ? 
        <div className="checked-title"><span className="line-4"/><button onClick={() => setCheckedList([])}>Clear</button><span className="line-5"/><h4>Checked Off</h4><span className="line-3"/></div>
        : null
      }
      {droppable(checkedList.map((check, index) => {
      return (
        draggable(CheckedItem(index, checkedList, setCheckedList, moveItem, handleQuantity, groceryList, setGroceryList, setMiniMenuDroppedDown), index, check.item, "list-item")
      )
    }), "checkedList", "checked-list-items")}</div>
  }

  const CheckedItem = (index, checkedList, setCheckedList, moveItem, handleQuantity, groceryList, setGroceryList, setMiniMenuDroppedDown) => {
    function quantityOnChange(e) {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        handleQuantity(index, !e.target.value ? 1 : e.target.value, checkedList, setCheckedList)
      }
    }

    return (
      <>
        <div className="checkbox" type="checkbox" onClick={() => moveItem(index, groceryList.length, checkedList, groceryList, setCheckedList, setGroceryList, false)}><MdOutlineCheckBox  /></div>
      <span className="list-item-text"><s>{checkedList[index].item}</s></span>
      <div className="list-item-right-div">
        <div>
          <button onClick={() => handleQuantity(index, checkedList[index].quantity - 1, checkedList, setCheckedList)}>-</button>
          <input type="text" className="list-quantity-input" onChange={e => quantityOnChange(e)} value={checkedList[index].quantity} onFocus={event => event.target.select()}></input>
          <button onClick={() => handleQuantity(index, checkedList[index].quantity - (-1), checkedList, setCheckedList)}>+</button>
        </div>
        <span className="list-item-menu-dots" onClick={() => setMiniMenuDroppedDown(prevMiniMenuDropdown => !prevMiniMenuDropdown.droppedDown || prevMiniMenuDropdown.index !== index ? {droppedDown: true, index: index, list: "checkedList"} : {droppedDown: false, index: null, list: "groceryList"})}><BsThreeDotsVertical /></span>
      </div>
    </>
    )
  }