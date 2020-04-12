function init() {

  // * DOM Elements
  const grid = document.querySelector('.grid')
  const cells = []


  // * Grid Variables
  const width = 9
  const cellCount = width * width
  const bombCount = 10 //this will need to be updated to link to width when size increases 

  // * Game Variables
  let bombPosition = []
  const bombPositions = []


  // * Functions 
  function createCells() {
    // Create the cells
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      // cell.textContent = i
      cells.push(cell)
    }
  }

  function positionBombs() {
    // Position the bombs
    for (let i = 0; i <= bombCount - 1; i++) {
      bombPosition = Math.floor(Math.random() * cellCount)
      if (cells[bombPosition].classList.contains('bomb')) {
        bombPosition = Math.floor(Math.random() * cellCount)
        cells[bombPosition].classList.add('bomb')
      } else {
        cells[bombPosition].classList.add('bomb')
      }
      bombPositions.push(bombPosition)
    }
    console.log(`Bomb in divs ${bombPositions}`)
  }

  function positionHints() {
    
    cells.forEach((cell, i) => {
      // console.log('I am the cell', cell)
        
      if (!cell.hasAttributes('.bomb')) {
        // console.log(cell,'has bomb?', !cell.hasAttributes('.bomb'))
        const value = 
        (`${(cells[i - 10] && cells[i - 10].hasAttributes('.bomb')) ? 1 : 0}
        +
        ${(cells[i - 9] && cells[i - 9].hasAttributes('.bomb')) ? 1 : 0}
        +
        ${(cells[i - 8] && cells[i - 8].hasAttributes('.bomb')) ? 1 : 0} 
        +
        ${(cells[i - 1] && cells[i - 1].hasAttributes('.bomb')) ? 1 : 0} 
        +
        ${(cells[i + 1] && cells[i + 1].hasAttributes('.bomb')) ? 1 : 0} 
        +
        ${(cells[i + 8] && cells[i + 8].hasAttributes('.bomb')) ? 1 : 0} 
        +
        ${(cells[i + 9] && cells[i + 9].hasAttributes('.bomb')) ? 1 : 0} 
        +
        ${(cells[i + 10] && cells[i + 10].hasAttributes('.bomb')) ? 1 : 0}`).replace(/[^\d.-]/g, '').split('')
        

        // console.log('value is', (value))
        const hintNum = value.reduce((a, b) => {
          return a + parseInt(b)
        },0)
        cell.textContent = hintNum > 0 ? hintNum : ''
      }
    })
  }

  function coverGrid() {
    cells.map(cell => {
      cell.classList.add('cover')
    })
  }

  function revealCell(event) {
    // console.log(`just clicked ${event.target.textContent}`)
    if (event.target.classList.contains('bomb')) {
      cells.map(cell => {
        cell.classList.remove('cover')
      })
    } else {
      event.target.classList.remove('cover')
    }
  }



  createCells()
  // * Event Listeners
  window.addEventListener('load', positionBombs)
  window.addEventListener('load', positionHints)
  window.addEventListener('load', coverGrid)
  cells.forEach(cell => cell.addEventListener('click', revealCell))
}
window.addEventListener('DOMContentLoaded', init)