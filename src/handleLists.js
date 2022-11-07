export function handleDelete(index, list, setList) {
    const newList = [...list]
    newList.splice(index, 1)
    setList(newList)
  }