function init() {

  // * DOM Elements
  const grid = document.querySelector('.grid')
  const cells = []
  const resetBtn = document.querySelector('#reset')
  const bombCounter = document.querySelector('#bomb-count')
  const clickCounter = document.querySelector('#click-count')

  // * Grid Variables
  const width = 9
  const cellCount = width * width
  const bombCount = 10 //this will need to be updated to link to width when size increases 
  let clickCount = 0

  // * Game Variables
  let bombPosition = []
  let bombPositions = []
  // const adjCells = [cells[i - 10], cell[i - 9], cells[i - 8], cells[i - 1], cells[i + 1], cells[i + 8], cells[i + 9], cells[i + 10]]


  // *-------------------------- Functions On Page Load -------------------------------------

  //----------------------------- Create the cells ------------------------------------------
  function createCells() {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cell.textContent = i
      cells.push(cell)
    }
  }

  //----------------------------- Position the bombs ----------------------------------------
  function positionBombs() {
    bombPositions = []
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
    bombCounter.textContent = bombCount
    clickCounter.textContent = clickCount
    console.log(`Bomb in divs ${bombPositions}, (${bombPositions.length})`)
  }
  
  // -------------------------- Position the hints ------------------------------------------
  function positionHints() {
    // cells.forEach(cell => cell.textContent.replace(/[0-9]/g, ' '))
    // cells.forEach((cell) => {
    //   let hintArr = cell.textContent.split('')
    //   hintArr = []
    // })
    
    cells.forEach((cell, i) => {
      // console.log('I am the cell', cell.textContent) 
      const x = cell.textContent % width
      // console.log('x is', x)
      if (!cell.hasAttributes('.bomb')) {
        // console.log(cell,'has bomb?', !cell.hasAttributes('.bomb'))
        const value = 
        (`${(x > 0 && cells[i - 10] && cells[i - 10].hasAttributes('.bomb')) ? 1 : 0} +
        ${(cells[i - 9] && cells[i - 9].hasAttributes('.bomb')) ? 1 : 0} +
        ${(x < width - 1 && cells[i - 8] && cells[i - 8].hasAttributes('.bomb')) ? 1 : 0} +
        ${(x > 0 && cells[i - 1] && cells[i - 1].hasAttributes('.bomb')) ? 1 : 0} +
        ${(x < width - 1 && cells[i + 1] && cells[i + 1].hasAttributes('.bomb')) ? 1 : 0} +
        ${(x > 0 && cells[i + 8] && cells[i + 8].hasAttributes('.bomb')) ? 1 : 0} +
        ${(cells[i + 9] && cells[i + 9].hasAttributes('.bomb')) ? 1 : 0} +
        ${(x < width - 1 && cells[i + 10] && cells[i + 10].hasAttributes('.bomb')) ? 1 : 0}`).replace(/[^\d.-]/g, '').split('')
        
        // console.log('value is', (value))
        const hintNum = value.reduce((a, b) => {
          return a + parseInt(b)
        },0)
        cell.textContent = hintNum > 0 ? hintNum : ''
      
      }
    })
  }
  
  // --------------------------- Cover the Grid ---------------------------------------------
  function coverGrid() {
    cells.map(cell => {
      cell.classList.add('cover')
    })
  }
 
  // * -------------------- Functions for Playing the Game ----------------------------------

  // -------------------------- Reveal Cell on Click ----------------------------------------
  function revealCell(event) {
    clickCount += 1
    clickCounter.textContent = clickCount

    // console.log(`just clicked ${event.target.textContent}`)
    if (event.target.classList.contains('bomb')) {
      cells.filter(cell => {
        if (cell.classList.contains('bomb')) 
          cell.classList.remove('cover', 'flag') 
      })
    } else  {
      event.target.classList.remove('cover')
    }
  }
  

  // -------------------------- Add Flag on Right Click -------------------------------------
  function addFlag(event) {
    event.preventDefault()
    console.log(`just right clicked ${event}`)
    event.target.classList.add('flag')

    clickCount += 1
    bombCounter.textContent -= 1
    clickCounter.textContent = clickCount
  }


  // ------------------------------ Reset the Game -------------------------------------------
  function resetGame() {
    console.log('the reset button was clicked')
    cells.forEach(cell => cell.classList.remove('bomb', 'flag'))
    // cells.forEach(cell => cell.textContent.replace(/\d/g, ''))
    positionBombs()
    positionHints()
    coverGrid()
  }




  createCells()
  // *------------------------------ Event Listeners -----------------------------------------
  window.addEventListener('load', positionBombs)
  window.addEventListener('load', positionHints)
  window.addEventListener('load', coverGrid)
  cells.forEach(cell => cell.addEventListener('click', revealCell))
  cells.forEach(cell => cell.addEventListener('contextmenu', addFlag))
  resetBtn.addEventListener('click', resetGame)
}
window.addEventListener('DOMContentLoaded', init)