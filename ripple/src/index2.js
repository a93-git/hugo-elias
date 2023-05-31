"use strict"

const H = 480
const W = 720
const SIZE = 2 // Cell size
const R = Math.floor(H / SIZE) // row count
const C = Math.floor(W / SIZE) // col count
const INTERVAL = 100

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.height = H
canvas.width = W

const bStop = document.getElementById("stop")
bStop.addEventListener("click", () => {
    if (intervalId) {
	clearInterval(intervalId)
    }
    intervalId = null
})

const bStart = document.getElementById("start")
bStart.addEventListener("click", () => {
    if (!intervalId) {
	intervalId = setInterval(ripple, INTERVAL)
    }
})

const bNext = document.getElementById("next")
bNext.addEventListener("click", () => {
    if (!intervalId) ripple()
})

const dampSlider = document.getElementById("damping")
console.log(dampSlider)

const dampOut = document.getElementById("damp-out")
dampOut.innerHTML = dampSlider.value

dampSlider.addEventListener("input", () => {
    dampOut.innerHTML = dampSlider.value
    damping = dampSlider.value
})
			    
canvas.addEventListener("mousemove", (e) => {
    const x = e.clientX
    const y = e.clientY

    document.getElementById("info").innerHTML = `X: ${x}, Y: ${y}`
    const n = 4 * ((W * (y-1)) + x)
    buffer1.setAt(n, 255)
    buffer1.setAt(n+1, 255)
    buffer1.setAt(n+2, 255)
    buffer1.setAt(n+3, 255)

//    buffer1.draw()
})

canvas.addEventListener("click", (e) => {
    const x = e.clientX
    const y = e.clientY

    const n = 4 * ((W * (y-1)) + x)
    buffer1.setAt(n, 255)
    buffer1.setAt(n+1, 255)
    buffer1.setAt(n+2, 255)
    buffer1.setAt(n+3, 255)

})

let damping = 0.9999
class Buffer {
    constructor(x, y) {
	this.buffer = new Uint8ClampedArray(4 * W * H);

	this.x = x
	this.y = y
    }

    initialize() {
	const count = 4 * W * H
	for (let i = 0; i < count-3; i += 4) {
	    this.buffer[i] = 0
	    this.buffer[i+ 1] = 0
	    this.buffer[i+ 2] = 0
	    this.buffer[i+ 3] = 255
	}
    }

    draw() {
	const imageData = new ImageData(this.buffer, W, H)
	ctx.putImageData(imageData, 0, 0, 0, 0, W, H)
    }

    getLength() { return this.buffer.length }

    getAt(i) {return this.buffer[i] }
    setAt(i, v) {this.buffer[i] = v}
}

let buffer1 = new Buffer(C, R)
let buffer2 = new Buffer(C, R)
buffer1.initialize()
buffer2.initialize()

const ripple = () => {
    for (let pixRow = 1; pixRow < W; pixRow++) {
	for (let pixCol = 1; pixCol < H; pixCol++) {

	    const n = 4 * ((W * (pixCol - 1)) + (pixRow))
	    const arr = [n, (n)+1, (n)+2]

	    const n1 =  4 * ((W * (pixCol - 1)) + (pixRow + 1))
	    const arr1 = [n1, (n1)+1, (n1)+2]

	    const n2 =  4 * ((W * (pixCol - 1)) + (pixRow - 1))
	    const arr2 = [n2, (n2)+1, (n2)+2]

	    const n3 =  4 * ((W * ((pixCol + 1) - 1)) + (pixRow))
	    const arr3 = [n3, (n3)+1, (n3)+2]

	    const n4 =  4 * ((W * ((pixCol - 1) - 1)) + (pixRow)) 
	    const arr4 = [n4, (n4)+1, (n4)+2]

	    for (let i = 0; i < 3; i++) {
		const v  = buffer2.getAt(arr[i])
		const v1 = buffer1.getAt(arr1[i])
		const v2 = buffer1.getAt(arr2[i])
		const v3 = buffer1.getAt(arr3[i])
		const v4 = buffer1.getAt(arr4[i])

		const newVal = ((v1 + v2 + v3 + v4) / 2) - v
		buffer2.setAt(arr[i], newVal)
		buffer2.setAt(arr[i], buffer2.getAt(arr[i]) * damping)
	    }
	}
    }
    buffer2.draw()
    const t = buffer2
    buffer2 = buffer1
    buffer1 = t
}

let intervalId = setInterval(ripple, INTERVAL)
