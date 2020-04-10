import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const particlesOptions = {
	particles: {
		number: {
			value: 30,
			density: {
				enable: true,
				value_area: 800
			}
		}
	}
}

const initialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}

class App extends Component {
	constructor() {
		super(); 	//to enable 'this'
		this.state = initialState;
	}

	// componentDidMount() {
	// 	fetch('http://localhost:3000/users')
	// 		.then(response => response.json())
	// 		.then(console.log);
	// }

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined
			}
		})
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}

	displayFaceBox = (box) => {
		this.setState({ box: box });
	}

	onInputChange = (event) => {
		this.setState({
			input: event.target.value
		})
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		fetch('http://localhost:3000/imageurl', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				input: this.state.input
			})
		})
		.then(response => response.json())
		.then(response => {
			if (response) {
				fetch('http://localhost:3000/image', {
					method: 'put',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						id: this.state.user.id
					})
				})
				.then(response => response.json())
				.then(count => {
					this.setState(Object.assign(this.state.user, { entries: count}))
				})
				.catch(console.log)
			}
			this.displayFaceBox(this.calculateFaceLocation(response))
		})
		.catch(err => console.log(err));
	}

	onRouteChange = (route) => {
		if(route === 'signout') {
			this.setState(initialState)
		} else if(route === 'home') {
			this.setState({
				isSignedIn: true
			})
		}
		this.setState({
			route: route
		})
	}

	

	render() {
		const { isSignedIn, imageUrl, route, box } = this.state;
		return (
			<div className="App">
				<Particles className='particles'
						params={particlesOptions}
				/>
				<Navigation isSignedInProxy={isSignedIn} onRouteChangeProxy={this.onRouteChange} />
				{ 
					route === 'home'
					? <div>
						<Logo />
						<Rank
						nameProxy={this.state.user.name}
						entriesProxy={this.state.user.entries}
						/>
						<ImageLinkForm
						onInputChangeProxy={this.onInputChange}
						onButtonSubmitProxy={this.onButtonSubmit}
						/>
						<FaceRecognition boxProxy={box} imageUrlProxy={imageUrl} />
					 </div>
					: (
						route === 'signin' || route === 'signout'
						? <Signin loadUserProxy={this.loadUser} onRouteChangeProxy={this.onRouteChange}/>
						: <Register loadUserProxy={this.loadUser} onRouteChangeProxy={this.onRouteChange}/>
					  )
				}
			</div>
		);
	}
}

export default App;