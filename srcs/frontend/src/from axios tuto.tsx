import React from "react";
// import axios from "axios";

// export class PersonList extends React.Component {
// 	state = {
// 	  persons: []
// 	}
  
// 	componentDidMount() {
// 	  axios.get('http://localhost:9999/api/users')//`https://jsonplaceholder.typicode.com/users`)
// 		.then(res => {
// 			const persons = res.data;
// 			this.setState({ persons });
// 		})
// 	}
  
// 	render() {
// 	  return (
// 		<ul>
// 		  {
// 			this.state.persons
// 			  .map(person =>
// 				<li key={person.id}>{person.name}</li>
// 			  )
// 		  }
// 		</ul>
// 	  )
// 	}
// }

// export default class PersonAdd extends React.Component {
// 	state = {
// 		name: ''
// 	}
  
// 	handleChange = event => {
// 		his.setState({ name: event.target.value });
// 	}
  
// 	handleSubmit = event => {
// 		event.preventDefault();
	
// 		const user = {
// 			name: this.state.name
// 		};
	
// 		axios.post(`https://jsonplaceholder.typicode.com/users`, { user })
// 			.then(res => {
// 				console.log(res);
// 				console.log(res.data);
// 			})
// 	}
  
// 	render() {
// 		return (
// 			<div>
// 				<form onSubmit={this.handleSubmit}>
// 					<label>
// 						Person Name:
// 						<input type="text" name="name" onChange={this.handleChange} />
// 					</label>
// 					<button type="submit">Add</button>
// 				</form>
// 			</div>
// 		)
// 	}
// }