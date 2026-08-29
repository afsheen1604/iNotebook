import Notes from './Notes';
import TodoList from "./todolist";


export const Home = (props) => { 

  return (
    
        <Notes showAlert={props.showAlert} />
  )
}

export default Home