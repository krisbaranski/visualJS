const canvasSketch = require("canvas-sketch")
const random = require("canvas-sketch-util/random")
const math = require("canvas-sketch-util/math")
const tweakpane = require("tweakpane")

const settings = {
  dimensions: [1080, 1080],
  animate: true,
}
const params = {
  cols: 10,
  rows: 10,
  scaleMin: 0.1,
  scaleMax: 1,
  freq: 0.001,
  amp: 0.2,
  animate: true,
  frame: 0,
  lineCap: "butt",
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = "white"
    context.fillRect(0, 0, width, height)

    const cols = params.cols
    const rows = params.rows
    const numCells = cols * rows

    const gridWidth = width * 0.95
    const gridHeight = height * 0.95
    const cellWidth = gridWidth / cols
    const cellHeight = gridHeight / rows
    const marginWidth = (width - gridWidth) / 2
    const marginHeight = (height - gridHeight) / 2

    for (let i = 0; i < numCells; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)

      const x = col * cellWidth
      const y = row * cellHeight
      const width = cellWidth * 0.9
      const height = cellHeight * 0.9

      const f = params.animate ? frame : params.frame

      // const noise = random.noise2D(x + frame * 10, y, params.freq)
      const noise = random.noise3D(x, y, f * 10, params.freq)

      const angle = noise * Math.PI * params.amp

      // const scale = (noise + 1) / 2 * 30
      // const scale = (noise * 0.5 + 0.5) * 30
      const scale = math.mapRange(
        noise,
        -1,
        1,
        params.scaleMin,
        params.scaleMax
      )

      context.save()
      context.translate(x, y)
      context.translate(marginWidth, marginHeight)
      context.translate(width / 2, height / 2)
      context.rotate(angle)

      context.lineWidth = scale
      context.lineCap = params.lineCap

      context.beginPath()
      context.moveTo(width * -0.5, 0)
      context.lineTo(width * 0.5, 0)
      context.stroke()

      context.restore()
    }
  }
}

const createPane = () => {
  const pane = new tweakpane.Pane()
  let folder

  folder = pane.addFolder({ title: "Grid" })
  folder.addInput(params, "lineCap", {
    options: { butt: "butt", round: "round", square: "square" },
  })
  folder.addInput(params, "cols", { min: 2, max: 60, step: 1 })
  folder.addInput(params, "rows", { min: 2, max: 60, step: 1 })
  folder.addInput(params, "scaleMin", { min: 1, max: 100 })
  folder.addInput(params, "scaleMax", { min: 1, max: 100 })

  folder = pane.addFolder({ title: "Noise" })
  folder.addInput(params, "freq", { min: -0.01, max: 0.01 })
  folder.addInput(params, "amp", { min: 0, max: 1 })
  folder.addInput(params, "animate")
  folder.addInput(params, "frame", { min: 0, max: 100 })
}

createPane()
canvasSketch(sketch, settings)
