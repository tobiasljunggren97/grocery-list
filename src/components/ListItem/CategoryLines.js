import "./ListItems.css"

export default function CategoryLines(props) {
    const {categories} = props
    console.log(categories)
    return (
        categories.map((category) => {
            return (<div className="category-container">
                {/* <b>{category[0].category}</b> */}
                {category.map((item) => {
                    return (
                        <div className="category-vertical-line">
                            {item.item}
                        </div>
                    )
                })}
            </div>
            )
        })
    )
}