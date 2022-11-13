import {BsThreeDotsVertical} from 'react-icons/bs'
import {MdOutlineCheckBoxOutlineBlank} from 'react-icons/md'
import "./ListItems.css"
import {droppable} from '../../scripts/dnd'
import {Draggable} from '@hello-pangea/dnd'


export default function ListItems(props) {
    const {list, setList, moveItem, handleQuantity, checkedList, setCheckedList, categoryChange, setCategoryChange, handleCategoryChange, dragging, miniMenuDroppedDown, setMiniMenuDroppedDown} = props

    function listSortedByCategory() {
      const sortedList = list.sort((a, b) => {
        if (a.category < b.category) {
          return -1
        }
        if (a.category > b.category) {
          return 1
        }
        return 0
      })
      setList(sortedList)
      return sortedList
    }

    return (
    <div className="list-items">
    {droppable(
    listSortedByCategory().map((grocery, index) => {
      return (
        <div>
          <Draggable key={grocery.item} draggableId={grocery.item.toString()} index={index}>
          {(provided) => (
              <div 
              key={grocery.item} 
              className={"list-item"}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              >
                {ListItem(index, list, setList, moveItem, handleQuantity, checkedList, setCheckedList, categoryChange, setCategoryChange, handleCategoryChange, dragging, miniMenuDroppedDown, setMiniMenuDroppedDown)}
              </div>
          )}
          </Draggable>
        </div>
      )
    }), "groceryList", "uncategorized-list-items")}
    </div>
    )
  }

  function ListItem(index, list, setList, moveItem, handleQuantity, checkedList, setCheckedList, categoryChange, setCategoryChange, handleCategoryChange, dragging, miniMenuDroppedDown, setMiniMenuDroppedDown) 
  {
    const {isChanging, value} = categoryChange
    const changeIndex = categoryChange.index
    function quantityOnChange(e) {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        handleQuantity(index, !e.target.value ? 1 : e.target.value, list, setList)
      }
    }

    function categoryNameOnChange(e) {
      setCategoryChange(prevCategoryChange => {
        return {
          ...prevCategoryChange,
          value: e.target.value
        }
      })
    }

    function categoryNameChangeSubmit(e) {
      e.preventDefault()
      handleCategoryChange(changeIndex, value, list, setList)
    }

    const firstOfType = index === 0 || list[index].category !== list[index - 1].category
    const lastOfType = index === list.length - 1 || list[index].category !== list[index + 1].category

    function checkOffItem() {
      moveItem(index, 0, list, checkedList, setList, setCheckedList, false)
    }

    return (
      <>
      {firstOfType ? <>
      {!dragging ? <div className="first-vertical-line"></div> : null}
      {!dragging ? <div className="first-horizontal-line"></div> : null}
      <form className="list-item-category-form" onSubmit={categoryNameChangeSubmit}>
        <input className='list-item-category' 
          type="text" 
          onChange={categoryNameOnChange} 
          value={isChanging && changeIndex === index ? value : list[index].category} 
          onFocus={event => {
            event.target.select()
            setCategoryChange(prevCategoryChange => {
            return {...prevCategoryChange, isChanging: true, index: index, value: list[index].category}
          })}}
        />
      </form>
      </> : !dragging ? <div className="vertical-line"></div> : null}

      {lastOfType ? !dragging ? <div className="last-horizontal-line"></div> : null : null}
      <div className="checkbox" type="checkbox" onClick={checkOffItem}><MdOutlineCheckBoxOutlineBlank/></div>
      <span className="list-item-text">{list[index].item}</span>
      <div className="list-item-right-div">
        <div>
          <button onClick={() => handleQuantity(index, list[index].quantity - 1, list, setList)}>-</button>
          <input type="text" className="list-quantity-input" onChange={e => quantityOnChange(e)} value={list[index].quantity} onFocus={event => event.target.select()}></input>
          <button onClick={() => handleQuantity(index, list[index].quantity - (-1), list, setList)}>+</button>
        </div>

        <span className="list-item-menu-dots" onClick={() => setMiniMenuDroppedDown(prevMiniMenuDropdown => !prevMiniMenuDropdown.droppedDown || prevMiniMenuDropdown.index !== index ? {droppedDown: true, index: index, list: "groceryList"} : {droppedDown: false, index: null, list: "groceryList"})}>
          <BsThreeDotsVertical />
        </span>
      </div>


    </>
    )
  }