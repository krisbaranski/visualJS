const canvasSketch = require("canvas-sketch")
const random = require("canvas-sketch-util/random")
const math = require("canvas-sketch-util/math")

const settings = {
  dimensions: [1080, 1080],
  animate: true,
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = "white"
    context.fillRect(0, 0, width, height)

    const cols = 10
    const rows = 10
    const numCells = cols * rows

    const gridWidth = width * 0.8
    const gridHeight = height * 0.8
    const cellWidth = gridWidth / cols
    const cellHeight = gridHeight / rows
    const marginWidth = (width - gridWidth) / 2
    const marginHeight = (height - gridHeight) / 2

    for (let i = 0; i < numCells; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)

      const x = col * cellWidth
      const y = row * cellHeight
      const width = cellWidth * 0.8
      const height = cellHeight * 0.8

      const noise = random.noise2D(x + frame * 10, y, 0.001)
      const angle = noise * Math.PI * 0.2

      // const scale = (noise + 1) / 2 * 30
      // const scale = (noise * 0.5 + 0.5) * 30
      const scale = math.mapRange(noise, -1, 1, 1, 30)

      context.save()
      context.translate(x, y)
      context.translate(marginWidth, marginHeight)
      context.translate(width / 2, height / 2)
      context.rotate(angle)

      context.lineWidth = scale

      context.beginPath()
      context.moveTo(width * -0.5, 0)
      context.lineTo(width * 0.5, 0)
      context.stroke()

      context.restore()
    }
  }
}

canvasSketch(sketch, settings)
