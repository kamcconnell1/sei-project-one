function init() {

  // * DOM Elements
  const grid = document.querySelector('.grid')
  const gameSize = document.querySelector('.game-board')
  const resetBtn = document.querySelector('#reset')
  const newGameBtn = document.querySelector('#new-game')
  const bombCounter = document.querySelector('#bomb-count')
  const clickCounter = document.querySelector('#click-count')
  const minutesLabel = document.querySelector('#minutes')
  const secondsLabel = document.querySelector('#seconds')
  const overlay = document.querySelector('#overlay')
  const overlayTime = document.querySelector('#time')
  const overlayClicks = document.querySelector('#clicks')
  const audio = document.querySelector('.audio')
  const face = document.querySelector('#smiley-face')
  const chooseLevel = document.querySelector('#level') 
  
  // * Grid Variables
  let cells = []
  let width = 9
  grid.style.width = '270px'
  grid.style.height = '270px'
  gameSize.style.width = '400px'






  
  // * Game Variables
  let bombCount = 10 //this will need to be updated to link to width when size increases 
  let bombPositions = []
  let flagPositions = []
  let clickCount = 0
  let totalSeconds = 0
  let t
  
  
  // *-------------------------- Functions On Page Load -------------------------------------
  
  //----------------------------- Create the cells ------------------------------------------
  
  function createCells(width) {
    
    for (let i = 0; i < (width * width); i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cell.textContent = i
      cells.push(cell)
      cell.style.width = '30px'
      cell.style.height = '30px'
    }
  }

  
  //----------------------------- Position the bombs ----------------------------------------
  function positionBombs() {
    bombPositions = []
    while (bombPositions.length < bombCount) {
      const bombPosition = Math.floor(Math.random() * (width * width))

      if (bombPositions.indexOf(bombPosition) === -1) bombPositions.push(bombPosition)
    }
    console.log(bombPositions)
    bombPositions.forEach(i => {
      cells[i].classList.add('bomb')
    })
    bombCounter.textContent = bombCount
    clickCounter.textContent = clickCount
    // console.log(`Bomb in divs ${bombPositions}, (${bombPositions.length})`) 
  }

  
  // -------------------------- Position the hints ------------------------------------------
  function positionHints() {
    cells.forEach((cell, i) => {
      
      const x = i % width   //this stops the cells going over the line below
      //these help to look for the cells around the cell am looking at
      const northWestCell = cells[i - width - 1]
      const northCell = cells[i - width]
      const northEastCell = cells[i - width + 1]
      const westCell = cells[i - 1]
      const eastCell = cells[i + 1]
      const southWestCell = cells[i + width - 1]
      const southCell = cells[i + width]
      const southEastCell = cells[i + width + 1]
      
      // these check that the cell to the right / left actually exist 
      const westWall = x > 0
      const eastWall = x < width - 1
      
      let mineCount = 0
      if (!cell.classList.contains('bomb')) {
        if  (westWall && northWestCell && northWestCell.classList.contains('bomb')) ++mineCount
        if (northCell && northCell.classList.contains('bomb')) mineCount++
        if (eastWall && northEastCell && northEastCell.classList.contains('bomb')) mineCount++
        if (westWall && westCell && westCell.classList.contains('bomb')) mineCount++
        if (eastWall && eastCell && eastCell.classList.contains('bomb')) mineCount++
        if (westWall && southWestCell && southWestCell.classList.contains('bomb')) mineCount++
        if (southCell && southCell.classList.contains('bomb')) mineCount++
        if (eastWall && southEastCell && southEastCell.classList.contains('bomb')) mineCount++
        cell.textContent = mineCount
        
      }
    })
  }
  
  
  
  // --------------------------- Cover the Grid ---------------------------------------------
  function coverGrid() {
    cells.map(cell => {
      cell.classList.add('cover')
    })
  }
  
  
  // *-------------------------- Select Game Options------------------------------------------
  
  function changeLevel() {
    grid.textContent = ''
    cells = []
    bombPositions = []
    flagPositions = []

    if (chooseLevel.value === 'intermediate') {
      grid.style.width = '480px'
      grid.style.height = '480px'
      gameSize.style.width = '480px'
      width = 16
      createCells(16)
      bombCount = 40
    }
    if (chooseLevel.value === 'beginner') {
    
      grid.style.width = '270px'
      grid.style.height = '270px'
      gameSize.style.width = '400px'
      width = 9
      createCells(9)
      bombCount = 10
    }
    if (chooseLevel.value === 'advanced') {
      grid.style.width = '600px'
      grid.style.height = '600px'
      gameSize.style.width = '600px'
      width = 20
      createCells(20)
      bombCount = 60
    }


    positionBombs()
    bombPositions.forEach(i => {
      cells[i].classList.add('bomb')
    })

    clearInterval(t)
    totalSeconds = 0
    minutesLabel.textContent = '00'
    secondsLabel.textContent = '00'
    t = setInterval(setTime, 1000)

    positionHints()
    console.log(cells.length)
    console.log(bombPositions.length)
    coverGrid()
    cells.forEach(cell => cell.addEventListener('click', revealCell))
    cells.forEach(cell => cell.addEventListener('contextmenu', addFlag))
    cells.forEach(cell => cell.addEventListener('click', gameOver))
    cells.forEach(cell => cell.addEventListener('click', winGame))
    cells.forEach(cell => cell.addEventListener('contextmenu', winGame))
  }
  
  
    
    
  // * -------------------- Functions for Playing the Game ----------------------------------
    
  // -------------------------- Timer ----------------------------------------
  
  // Help on how to add the timer taken from here 
  // https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
  // eslint-disable-next-line prefer-const
  t = setInterval(setTime, 1000)

  function setTime() {
    ++totalSeconds
    secondsLabel.textContent = pad(totalSeconds % 60)
    minutesLabel.textContent = pad(parseInt(totalSeconds / 60))
  }
    
  function pad(val) {
    var valString = val + ''
    if (valString.length < 2) {
      return '0' + valString
    } else {
      return valString
    }
  }
  
  // ? --------------------------------Click Events----------------------------------------
  function revealCell(event) {
    const cell = event.target
    
    clickCount += 1
    clickCounter.textContent = clickCount

    if (cell.classList.contains('flag')) return 

    // this is for if click on a cell with a number in  
    if (cell.textContent > '0') {
      cell.classList.remove('cover')
      return
    }
    
    if (cell.textContent === '0') cell.textContent = ''
    cell.classList.remove('cover')

    floodFillEast(cells.indexOf(event.target))
    floodFillNorthEast(cells.indexOf(event.target))
    floodFillNorthWest(cells.indexOf(event.target))

    floodFillWest(cells.indexOf(event.target))
    floodFillSouthEast(cells.indexOf(event.target))
    floodFillSouthWest(cells.indexOf(event.target))

    floodFillNorth(cells.indexOf(event.target))
    floodFillSouth(cells.indexOf(event.target))

  }
  


  function findAdjCells(i) {

    const x = i % width
    // ! This code is repeated from position hints - think how to refactor
    const northWestCell = cells[i - width - 1]
    const northCell = cells[i - width]
    const northEastCell = cells[i - width + 1]
    const westCell = cells[i - 1]
    const eastCell = cells[i + 1]
    const southWestCell = cells[i + width - 1]
    const southCell = cells[i + width]
    const southEastCell = cells[i + width + 1]

    const westWall = x > 0
    const eastWall = x < width - 1

    if (westWall && northWestCell && !northWestCell.classList.contains('bomb')) {
      northWestCell.classList.remove('cover')
      if (northWestCell.textContent === '0') northWestCell.textContent = ''
    }

    if (northCell && !northCell.classList.contains('bomb')) {
      northCell.classList.remove('cover')
      if (northCell.textContent === '0') northCell.textContent = ''
    }

    if (eastWall && northEastCell && !northEastCell.classList.contains('bomb')) {
      northEastCell.classList.remove('cover')
      if (northEastCell.textContent === '0') northEastCell.textContent = ''
    }

    if (westWall && westCell && !westCell.classList.contains('bomb')) {
      westCell.classList.remove('cover')
      if (westCell.textContent === '0') westCell.textContent = ''
    }

    if (eastWall && eastCell && !eastCell.classList.contains('bomb')) {
      eastCell.classList.remove('cover')
      if (eastCell.textContent === '0') eastCell.textContent = ''
    }

    if (westWall && southWestCell && !southWestCell.classList.contains('bomb')) {
      southWestCell.classList.remove('cover')
      if (southWestCell.textContent === '0') southWestCell.textContent = ''
    }

    if (southCell && !southCell.classList.contains('bomb')) {
      southCell.classList.remove('cover')
      if (southCell.textContent === '0') southCell.textContent = ''
    }

    if (eastWall && southEastCell && !southEastCell.classList.contains('bomb')) {
      southEastCell.classList.remove('cover')
      if (southEastCell.textContent === '0') southEastCell.textContent = ''
    }

    return
  }



  function floodFillNorth(i) {
    const northWall = i > width
    const northCell = cells[i - width]
    
    if (northWall === false) return
    if (northCell && !northCell.classList.contains('bomb')) {
      northCell.classList.remove('cover')
      if (northCell.textContent === '0') northCell.textContent = ''
      if (northCell.textContent > '0') return
      findAdjCells(i - width)
    }
    floodFillNorth(i - width)
  }

  function floodFillNorthEast(i) {
    const northEastCell = cells[i - width + 1]
    const x = i % width
    const eastWall = x < width - 1
    const northWall = i > width

    if (eastWall === false || northWall === false) return

    if (northEastCell && !northEastCell.classList.contains('bomb')) {
      northEastCell.classList.remove('cover')
      if (northEastCell.textContent === '0') northEastCell.textContent = ''
      if (northEastCell.textContent > 0) return
      findAdjCells(i - width - 1)
    }
    floodFillNorthEast(i - width + 1)
  }

  function floodFillNorthWest(i) {
    const x = i % width
    const westWall = x > 0
    const northWestCell = cells[i - width - 1]
    const northWall = i > width

    if (westWall === false || northWall === false) return
    if (northWestCell && !northWestCell.classList.contains('bomb')) {
      northWestCell.classList.remove('cover')
      if (northWestCell.textContent === '0') northWestCell.textContent = ''
      if (northWestCell.textContent > '0') return
      findAdjCells(i - width - 1)
    }
    floodFillNorthWest(i - width - 1)
  }

  function floodFillEast(i) {
    const eastCell = cells[i + 1]
    const x = i % width
    const eastWall = x < width - 1

    if (eastWall === false) return
    if (eastCell && !eastCell.classList.contains('bomb')) {
      eastCell.classList.remove('cover')
      if (eastCell.textContent === '0') eastCell.textContent = ''
      if (eastCell.textContent > '0') return
      findAdjCells(i + 1)
    }
    floodFillEast(i + 1)
  }


  function floodFillWest(i) {
    const x = i % width
    const westWall = x > 0

    const westCell = cells[i - 1]
    if (westWall === false) return

    if (westCell && !westCell.classList.contains('bomb')) {
      westCell.classList.remove('cover')
      if (westCell.textContent === '0') westCell.textContent = ''
      if (westCell.textContent > '0') return
      findAdjCells(i - 1)
    }
    floodFillWest(i - 1)
  }

  function floodFillSouthEast(i) {
    const southEastCell = cells[i + width + 1]

    const x = i % width
    const eastWall = x < width - 1
    const southWall = i < cells.length - width
    if (eastWall === false || southWall === false) return

    if (southEastCell && !southEastCell.classList.contains('bomb')) {
      southEastCell.classList.remove('cover')
      if (southEastCell.textContent === '0') southEastCell.textContent = ''
      if (southEastCell.textContent > '0') return 
      findAdjCells(i + width + 1)
    }
    floodFillSouthEast(i + width + 1)
  }

  function floodFillSouthWest(i) {
    const x = i % width
    const westWall = x > 0
    const southWestCell = cells[i + width - 1]
    const southWall = i < cells.length - width
    if (westWall === false || southWall === false) return

    if (southWestCell && !southWestCell.classList.contains('bomb')) {
      southWestCell.classList.remove('cover')
      if (southWestCell.textContent === '0') southWestCell.textContent = ''
      if (southWestCell.textContent > '0') return
      findAdjCells(i + width - 1)
    }
    floodFillSouthWest(i + width - 1)
  }

  function floodFillSouth(i) {
    const southWall = i < cells.length - width
    const southCell = cells[i + width]

    if (southWall === false) return
    if (southCell && !southCell.classList.contains('bomb')) {
      southCell.classList.remove('cover')
      if (southCell.textContent === '0') southCell.textContent = ''
      if (southCell.textContent > '0') return
      findAdjCells(i + width)
    }
    floodFillSouth(i + width)
  }

  // -------------------------- Add Flag on Right Click -------------------------------------
  function addFlag(event) {
    event.preventDefault()
    const cell = event.target
    const i = cells.indexOf(cell)

    if (!cell.classList.contains('cover')) return 

    if (cell.classList.contains('flag')) {
      cell.classList.remove('flag')
      bombCounter.textContent = parseInt(bombCounter.textContent) + 1
      const index = flagPositions.indexOf(i)
      flagPositions.splice(index, 1)
    } else {
      cell.classList.add('flag')
      bombCounter.textContent = parseInt(bombCounter.textContent) - 1
      flagPositions.push(i)
    }
    clickCount += 1
    clickCounter.textContent = clickCount
  }

  
  function gameOver() {
    if (event.target.classList.contains('bomb')) {
      clearInterval(t)

      audio.src = 'assets/Bomb_noise.wav'
      audio.play()

      face.src  = 'assets/sad_face.png'
      
      cells.filter(cell => {
        if (cell.classList.contains('bomb')) {
          cell.classList.remove('cover', 'flag') 
          cell.classList.add('bomb-clicked')
        }
      }
      )
      cells.forEach(cell => cell.removeEventListener('click', revealCell))
      cells.forEach(cell => cell.removeEventListener('contextmenu', addFlag))
      cells.forEach(cell => cell.removeEventListener('click', findAdjCells))
    }
  }
  
  
  function winGame() {
    if (bombPositions.sort().join(',') === flagPositions.sort().join(',')) {
      console.log('won')
      setTimeout(gameStats, 500)
    }
  }

  // Show statistics of the user's performance after the game is finished
  function gameStats(){
    overlay.style.display = 'block'
    overlayTime.textContent = ` ${minutesLabel.textContent}:${secondsLabel.textContent}`
    overlayClicks.textContent = ` ${clickCounter.textContent}`
  }
  


  function mouseDown(event) {
    if (event.which === 1) face.src  = './assets/shocked_face.png'
  }

  function mouseUp() {
    face.src  = './assets/happy_face.png'
  }



  // ------------------------------ Reset the Game -------------------------------------------
  function resetGame() {
    console.log('the reset button was clicked')
    cells.forEach(cell => cell.classList.remove('bomb', 'flag', 'bomb-clicked'))
    clearInterval(t)
    bombPositions = []
    flagPositions = []

    positionBombs()
    positionHints()
    coverGrid()
    clickCounter.textContent = 0
    clickCount = 0
    cells.forEach(cell => cell.addEventListener('contextmenu', addFlag))
    cells.forEach(cell => cell.addEventListener('click', revealCell))
    cells.forEach(cell => cell.addEventListener('click', gameOver))
    cells.forEach(cell => cell.addEventListener('click', winGame))
    cells.forEach(cell => cell.addEventListener('contextmenu', winGame))
    overlay.style.display = 'none'
    face.src  = 'assets/happy_face.png'
    totalSeconds = 0
    minutesLabel.textContent = '00'
    secondsLabel.textContent = '00'
    t = setInterval(setTime, 1000)

  }
  function overlayOff() {
    overlay.style.display = 'none'
  }




  createCells(9)
  // *------------------------------ Event Listeners -----------------------------------------
  window.addEventListener('load', positionBombs)
  window.addEventListener('load', positionHints)
  window.addEventListener('load', coverGrid)


  chooseLevel.addEventListener('change', changeLevel)
  cells.forEach(cell => cell.addEventListener('click', gameOver))
  cells.forEach(cell => cell.addEventListener('click', revealCell))
  cells.forEach(cell => cell.addEventListener('contextmenu', addFlag))
  cells.forEach(cell => cell.addEventListener('click', winGame))
  cells.forEach(cell => cell.addEventListener('contextmenu', winGame))
  resetBtn.addEventListener('click', resetGame)
  newGameBtn.addEventListener('click', resetGame)
  cells.forEach(cell => cell.addEventListener('mouseup', mouseUp))
  cells.forEach(cell => cell.addEventListener('mousedown', mouseDown))
  overlay.addEventListener('click', overlayOff)


}
window.addEventListener('DOMContentLoaded', init)