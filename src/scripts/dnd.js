import {Droppable, Draggable} from '@hello-pangea/dnd'
export function draggable(input, index, id, className){
    return (
      <Draggable key={id} draggableId={id.toString()} index={index}>
        {(provided) => (
            <div 
            key={id} 
            className={className}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            >
              {input}
            </div>
        )}
      </Draggable>
    )
  }

  export function droppable(input, id, className){
    return (
      <Droppable droppableId={id}>
        {(provided) => (
          <div className={className} ref={provided.innerRef} {...provided.droppableProps}>
            {input}
            {provided.placeholder}
            
          </div>
        )}
      </Droppable>
    )
  }