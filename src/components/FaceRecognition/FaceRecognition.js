import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrlProxy, boxProxy }) => {
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputimage' alt='' src={imageUrlProxy} width='500px' heigh='auto'/>
				<div className='bounding-box' style={{top: boxProxy.topRow, right: boxProxy.rightCol, bottom: boxProxy.bottomRow, left: boxProxy.leftCol}}></div>
			</div>
		</div>
		);
	}

	export default FaceRecognition;