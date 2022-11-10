import {BsThreeDotsVertical} from 'react-icons/bs'
import {MdOutlineCheckBoxOutlineBlank} from 'react-icons/md'
import "./ListItems.css"
import {droppable} from '../../scripts/dnd'


export default function ListItems(props) {
    const {list, setList, moveItem, handleQuantity, checkedList, setCheckedList, draggable, categoryChange, setCategoryChange, handleCategoryChange} = props

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

    function splitListsIntoCategories(list)
    {
      const categories = []
      let category = []
      for (let i = 0; i < list.length; i++) {
        if (i === 0 || list[i].category !== list[i - 1].category) {
          if (category.length !== 0) {
            categories.push(category)
          }
          category = []
        }
        category.push(list[i])
      }
      categories.push(category)
      return categories
    }

    const sortedList = listSortedByCategory()
    const categories = splitListsIntoCategories(sortedList)

    return (
    <div className="list-items">
    {droppable(
    sortedList.map((grocery, index) => {
      return (
        <div>
          {draggable(ListItem(index, list, setList, moveItem, handleQuantity, checkedList, setCheckedList, categoryChange, setCategoryChange, handleCategoryChange), index, grocery.item, "list-item")}
        </div>
      )
    }), "groceryList", "uncategorized-list-items")}
    </div>
    )
  }

  function ListItem(index, list, setList, moveItem, handleQuantity, checkedList, setCheckedList, 
                    categoryChange, setCategoryChange, handleCategoryChange) 
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

    return (
      <>
      {/* <div className='list-item-category'>{list[index].category !== "Uncategorized" ? list[index].category: null}</div> */}
      {firstOfType ? <form className="list-item-category-form" onSubmit={categoryNameChangeSubmit}>
        <input className='list-item-category' 
          type="text" 
          onChange={categoryNameOnChange} 
          value={isChanging && changeIndex === index ? value : list[index].category} 
          onFocus={() => setCategoryChange(prevCategoryChange => {
            return {...prevCategoryChange, isChanging: true, index: index, value: list[index].category}
          })}
        />
        <button className="list-item-category-button">Submit</button>
      </form> : null}
      <div className="checkbox" type="checkbox" onClick={() => moveItem(index, 0, list, checkedList, setList, setCheckedList, false)}><MdOutlineCheckBoxOutlineBlank/></div>
      <span className="list-item-text">{list[index].item}</span>
      <div className="list-item-right-div">
        <div>
          <button onClick={() => handleQuantity(index, list[index].quantity - 1, list, setList)}>-</button>
          <input type="text" className="list-quantity-input" onChange={e => quantityOnChange(e)} value={list[index].quantity} onFocus={event => event.target.select()}></input>
          <button onClick={() => handleQuantity(index, list[index].quantity - (-1), list, setList)}>+</button>
        </div>
        <span className="list-item-menu-dots"><BsThreeDotsVertical /></span>
      </div>

    </>
    )
  }