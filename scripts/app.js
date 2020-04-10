function init() {

  // * DOM Elements
  const grid = document.querySelector('.grid')
  const cells = []


  // * Grid Variables
  const width = 9
  const cellCount = width * width
  const bombCount = 3 //this will need to be updated to link to width when size increases 

  // * Game Variables
  let bombPosition = []
  const bombPositions = []
  let bombHints = []

  // * Functions 
  function createCells() {
    // Create the cells
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cell.textContent = i
      cells.push(cell)
    }
  }
  
  function positionBombs() {
    // Position the bombs
    for (let i = 0; i <= bombCount - 1; i++) {
      bombPosition = Math.floor(Math.random() * cellCount)
      cells[bombPosition].id = 'bomb'
      console.log(`Bomb positioned in div ${bombPosition}`)
      
      bombPositions.push(bombPosition)
    }
    console.log(bombPositions)
    
    const bombHint = bombPositions.map(num => {
      return ([ num - 10, num - 9, num - 8, num - 1, 
        num + 1, num + 8, num + 9, num + 10])
    } )
  
    bombHints = bombHint.flat().filter(num => num >= 0 && num < cellCount)
    
    console.log(bombHints)

    


    // if (!cells[item].classList.contains('bomb')
    bombHints.forEach(item => {
      cells[item].classList.add('bomb-hint')
    })
    // function removeHints() {
    //   for (let i = 0; i <= cellCount; i++) {
    //     if (cells[i].classList.contains('bomb' && 'bomb-hint') === true) {
    //       cells[i].classList.remove('bomb-hint')
    //     } 
    //   }
    // }
    
  }
 



  createCells()
  // * Event Listeners
  window.addEventListener('load', positionBombs)

}
window.addEventListener('DOMContentLoaded', init)