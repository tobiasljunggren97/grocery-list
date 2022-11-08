import {BsThreeDotsVertical} from 'react-icons/bs'
import {MdOutlineCheckBox} from 'react-icons/md'
import "./ListItems.css"


export default function CheckedListItems(props) {
    const {checkedList, setCheckedList, moveItem, handleQuantity, groceryList, setGroceryList, draggable} = props
    return checkedList.map((check, index) => {
      return (
        draggable(CheckedItem(index, checkedList, setCheckedList, moveItem, handleQuantity, groceryList, setGroceryList), index, check.item, "list-item")
      )
    })
  }

  const CheckedItem = (index, checkedList, setCheckedList, moveItem, handleQuantity, groceryList, setGroceryList) => {
    return (
      <>
        <div className="checkbox" type="checkbox" onClick={() => moveItem(index, groceryList.length, checkedList, groceryList, setCheckedList, setGroceryList)}><MdOutlineCheckBox  /></div>
      <span className="list-item-text"><s>{checkedList[index].item}</s></span>
      <div className="list-item-right-div">
        <div>
          <button onClick={() => handleQuantity(index, checkedList[index].quantity - 1, checkedList, setCheckedList)}>-</button>
          <input type="text" className="list-quantity-input" onChange={e => handleQuantity(index, e.target.value.match(new RegExp(/[^0-9]/, 'g')) ?  e.target.value : checkedList[index].quantity)} value={checkedList[index].quantity}></input>
          <button onClick={() => handleQuantity(index, checkedList[index].quantity + 1, checkedList, setCheckedList)}>+</button>
        </div>
        <span className="list-item-menu-dots"><BsThreeDotsVertical /></span>
      </div>
    </>
    )
  }