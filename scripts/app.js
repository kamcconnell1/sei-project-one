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
      if (cells[bombPosition].id === 'bomb') {
        bombPosition = Math.floor(Math.random() * cellCount)
        cells[bombPosition].id = 'bomb' 
      } else {
        cells[bombPosition].id = 'bomb' 
      }
      console.log(`Bomb in div ${bombPosition}`
      
    
        
      )
        
      bombPositions.push(bombPosition)
    }
    console.log(bombPositions)
  }



  function positionHints() {
    const x = bombPosition % width
    const y = Math.floor(bombPosition / width)


    const bombHint = bombPositions.map(num => {
      if (x < width - 1) return num + 1  // cell to right
      if (x > 0) return num - 1  // cell to left
      if (y > 0) return num + 9  // cell to south
      if (y < width - 1) return num - 9  // cell to north 
      
      
      
      
      return ([ num - 10, num - 9, num - 8, num - 1, 
        num + 1, num + 8, num + 9, num + 10])
    } )

    // const x = bombPosition % width
    // const y = Math.floor(bombPosition / width)
      
    // switch (bombPosition) {
    //   // *this will calculate the new index
    //   case 39: 
    //     // console.log('should move right')
    //     if (x < width - 1) pikaPosition++
    //     break
    //   case 37: 
    //     // console.log('should move left')
    //     if (x > 0) pikaPosition--
    //     break
    //   case 38: 
    //     // console.log('should move up') 
    //     if ( y > 0) pikaPosition -= width
    //     break
    //   case 40:
    //     // console.log('should move down')
    //     if (y < width - 1) pikaPosition += width
    //     break
    //   default:
    //     console.log('invalid key do nothing')







    bombHints = bombHint.flat().filter(num => num >= 0 && num < cellCount)
    console.log(bombHints)

    bombHints.forEach(item => {
      cells[item].classList.add('bomb-hint')
    })
  // } 
  }







  createCells()
  // * Event Listeners
  window.addEventListener('load', positionBombs)
  window.addEventListener('load', positionHints)
}
window.addEventListener('DOMContentLoaded', init)