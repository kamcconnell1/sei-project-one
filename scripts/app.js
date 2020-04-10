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
      cell.textContent = i
      cells.push(cell)
      // console.log(cells)
    }
  }
  
  function positionBombs() {
    // Position the bombs
    for (let i = 0; i <= bombCount - 1; i++) {
      bombPosition = Math.floor(Math.random() * cellCount)
      cells[bombPosition].classList.add('bomb')
      console.log(`Bomb positioned in div ${bombPosition}`)
      
      bombPositions.push(bombPosition)
    }
    console.log(bombPositions)
    
    const bombHints = bombPositions.map(num => {
      return [ num - 10, num - 9, num - 8, num - 1, 
        num + 1, num + 8, num + 9, num + 10]
    } )
    console.log(bombHints)
    for (let i = 0; i <= cellCount; i++) {
      // cells[bombHints].classList.add('bomb-hint')
      
    }

    // bombHints.forEach(element => {
    //   element.classList.add('bomb-hint')
    // cells[bombHints].classList.add('bomb-hint')
    // })
    console.log(bombHints)
  }
 



  createCells()
  // * Event Listeners
  window.addEventListener('load', positionBombs)

}
window.addEventListener('DOMContentLoaded', init)