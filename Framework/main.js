// Canvas with Pixi.JS
let canvasWrap = document.getElementById('canvas'),
	compStyles = window.getComputedStyle(canvasWrap),
	// canvasPadding = parseInt(compStyles.getPropertyValue('padding')) * 2,
	canvasBorder = parseInt(compStyles.getPropertyValue('border')) * 2,
	canvasWidth = canvasWrap.offsetWidth - parseInt(canvasBorder),
	canvasHeight = canvasWrap.offsetHeight - parseInt(canvasBorder);
let sectionTitlesNodes = document.querySelectorAll('[data-title]'),
	sectionTitles = Array.prototype.slice.call(sectionTitlesNodes,0); 


console.log('canvasWidth: ' + canvasWidth, 'canvasHeight: ' + canvasHeight);

// PIXI starting stage, creating containers for the image, and then add them to stage
let renderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight, {backgroundColor : 0x1099bb, antialias: true});
canvasWrap.appendChild(renderer.view);

let loader = PIXI.loader;
// make the root 
let stage = new PIXI.Container();

let container = new PIXI.Container();
let container2= new PIXI.Container();

container.position.x = renderer.width / 2;
container2.position.x = renderer.width / 2;
container.position.y = renderer.height / 2;
container2.position.y = renderer.height / 2;

let textures = [],
	current, next;
let canGo = true;
let delay = 1400;
let activeSlide = 1;
//load the pictures, we do this by adding them to queue them up
loader
	.add('a', 'watch.jpg')
	.add('b', 'tshirts.jpg');
loader.load((loader, resources) => {
	console.log('all images was load');

	Object.keys(resources).forEach(function(key,index) {
		textures.push(resources[key].texture);
	});

	// THE OLD IMAGE
	current = new PIXI.Sprite(textures[0]);
	
	let winprop = canvasWidth / canvasHeight;
	let imageprop = current.width / current.height;

	if (winprop > imageprop) {
		current.width = canvasWidth;
		current.height = canvasWidth / imageprop;
	} else {
		current.height = canvasHeight;
		current.width = canvasHeight * imageprop;
	}
	current.anchor.x = 0.5;
	current.anchor.y = 0.5;

	// THE NEW IMAGE
	next = new PIXI.Sprite(textures[1]);
	imageprop = next.width / next.height;

	if (winprop > imageprop) {
		next.width = canvasWidth;
		next.height = canvasWidth / imageprop;
	} else {
		next.height = canvasHeight;
		next.width = canvasHeight * imageprop;
	}
	next.anchor.x = 0.5;
	next.anchor.y = 0.5;

	next.rotation = Math.PI; // rotating next image to 180 deg thats behind the picture, can show demo if needed

	container.addChild(next);
	container2.addChild(current);

	stage.addChild(container);
	stage.addChild(container2);
    //sending them to the webpage


	renderer.render(stage);
});
//now with pixi can make this cover effect possible
//

function draw(){
	renderer.render(stage);
	window.requestAnimationFrame(draw);
}
function moveForward(currentElem, nextElem) {
	let tl = new TimelineMax();
	tl
		.to(canvasWrap, 1, {rotation: '+= 180', transformOrigin:"center center"}) // rotate Wrap for canvas
		.fromTo(currentElem.position, 1, {x: 0}, {x: `-=${canvasWidth}`}, 0) // move current img to left
		.fromTo(nextElem.position, 1, {x: canvasWidth}, {x: `-=${canvasWidth}`}, 0) // move next img from right
		// move titles up
		.to(sectionTitles[0], 0.8, {y: '-=100'}, 0)
		.to(sectionTitles[1], 0.8, {y: '-=100'}, 0);
}
function moveBack(currentElem, nextElem) {
	let tl = new TimelineMax();
	tl
		.to(canvasWrap, 1, {rotation: '-= 180', transformOrigin:"center center"}) // rotate Wrap for canvas
		.fromTo(currentElem.position, 1, {x: `=-${canvasWidth}`}, {x: 0}, 0) // move current img from left
		.fromTo(nextElem.position, 1, {x: 0}, {x: `+=${canvasWidth}`}, 0) // move next img to right
		// move titles down
		.to(sectionTitles[1], 0.8, {y: '+=100'}, 0)
		.to(sectionTitles[0], 0.8, {y: '+=100'}, 0);
}


// window.addEventListener('click', function (event) {
// 	console.log('click');

// 	let tl = new TimelineMax();

// 	tl
// 		.to(sectionTitles[0], 1, {y: '-=100'})
// 		.to(sectionTitles[1], 1, {y: '-=100'}, 0);

// 	draw();
// });

window.addEventListener('wheel', function (e) {
	console.log(activeSlide);
	if (!canGo) return;
	let direction = e.deltaY > 0 ? 1 : -1;
	if ((activeSlide + direction) < 1 || (activeSlide + direction) > 2) return;
	canGo = false;
	PubSub.publish( 'gotoSlide', {from: activeSlide, to: (activeSlide + direction), direction: direction} );
	activeSlide = (activeSlide + direction);
	setTimeout(function () {
		canGo = true;
		console.log('you can scroll again');
	}, delay)
});
PubSub.subscribe('gotoSlide', function (msg, data) {
	console.log(msg, data);

	if (data.direction === 1) {
		moveForward(current, next);
		draw();
		} else {
			moveBack(current, next);
			draw();
		}


});

