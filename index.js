// solutions here
//i used the latest version of rand-token
let {asyncOp, RandStream} = require('./lib/lib');
const EventEmitter = require('events').EventEmitter;

function doAsync(arr){
	let p;
	for (let i of arr){
		if (Array.isArray(i))
			p = p ? p.then( ()=>parallel(i) ) : parallel(i) ;
		else p = p ? p.then( ()=>asyncOp(i) ) : asyncOp(i) ;
	}

	function parallel(arr){
		return new Promise(resolve=>{
			for (let i of arr)
				asyncOp(i).then( ()=>tick() )

			function tick(){
				if ( !arr.pop() || arr.length == 0 )
					resolve()
			}

		})
	}
}

class RandStringSource extends EventEmitter{
	constructor (stream) {
		super()
		this.stack = ''
		stream.on('data',chunk=>{
			this.stack += chunk
			while (this.stack.includes(".")){
				let data = this.stack.slice(0, this.stack.indexOf("."))
				this.stack = this.stack.slice(this.stack.indexOf(".") + 1)
				if (data.length > 0)
					this.emit('data',data)
		})
	}
}

class ResourceManager{

			}
	constructor(count){
		this.resources = [];
		this.reserve = null
		while (count > 0){
			count--;
			this.resources.push(this.resource());
		}
	}

	borrow(callback){
		if (callback){
			if (!this.reserve){
				this.reserve = this.resource();
				callback(this.reserve);
			}else if ( ! this.reserve.acquired ){
				new Promise( resolve=>{
					let timer = setInterval( ()=>{
						if (this.reserve.acquired){
							clearInterval(timer);
							resolve();
						}
					},1	)
				} ).then( ()=>callback( this.resources.pop() ) ) 
			}
		}
	}

	resource(){
		return {
			acquired: false,
			release(){
				this.acquired = true;
			}
		}
	}
}


/*
//##################
//PROBLEM 1
//##################
let input = [
  'A',
  [ 'B', 'C' ],
  'D'
]
doAsync(input)
*/

/*
//##################################################
//PROBLEM 2
//##################################################
let source = new RandStringSource(new RandStream());

source.on('data', (data) => {
  console.log(data);
})
*/

/*
//###############################
//PROBLEM 3
//###############################
let pool = new ResourceManager(2);
console.log('START');

let timestamp = Date.now();

pool.borrow((res) => {
  console.log('RES: 1');

  setTimeout(() => {
    res.release();
  }, 500);
});

pool.borrow((res) => {
  console.log('RES: 2');
});

pool.borrow((res) => {
  console.log('RES: 3');
  console.log('DURATION: ' + (Date.now() - timestamp));
});
*/



