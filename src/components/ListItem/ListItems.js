import {BsThreeDotsVertical} from 'react-icons/bs'
import {MdOutlineCheckBoxOutlineBlank} from 'react-icons/md'
import "./ListItems.css"


export default function ListItems(props) {
    const {list, setList, moveItem, handleQuantity, checkedList, setCheckedList, draggable} = props
    return (
     list.map((grocery, index) => {
      return (
        <div>
          {draggable(ListItem(index, list, setList, moveItem, handleQuantity, checkedList, setCheckedList), index, grocery.item, "list-item")}
        </div>
      )
    }))
  }

  function ListItem(index, list, setList, moveItem, handleQuantity, checkedList, setCheckedList) {
    return (
      <>
      {/* <div className='list-item-category'>{list[index].category !== "Uncategorized" ? list[index].category: null}</div> */}
      <div className='list-item-category'>{list[index].category}</div>

      <div className="checkbox" type="checkbox" onClick={() => moveItem(index, 0, list, checkedList, setList, setCheckedList)}><MdOutlineCheckBoxOutlineBlank/></div>
      <span className="list-item-text">{list[index].item}</span>
      <div className="list-item-right-div">
        <div>
          <button onClick={() => handleQuantity(index, list[index].quantity - 1, list, setList)}>-</button>
          <input type="text" className="list-quantity-input" onChange={e => handleQuantity(index, e.target.value.match(new RegExp(/[^0-9]/, 'g')) ?  e.target.value : list[index].quantity)} value={list[index].quantity}></input>
          <button onClick={() => handleQuantity(index, list[index].quantity + 1, list, setList)}>+</button>
        </div>
        <span className="list-item-menu-dots"><BsThreeDotsVertical /></span>
      </div>

    </>
    )
  }