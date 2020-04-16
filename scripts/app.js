function init() {

  // * DOM Elements
  const grid = document.querySelector('.grid')
  const resetBtn = document.querySelector('#reset')
  const newGameBtn = document.querySelector('#new-game')
  const bombCounter = document.querySelector('#bomb-count')
  const clickCounter = document.querySelector('#click-count')
  const minutesLabel = document.querySelector('#minutes')
  const secondsLabel = document.querySelector('#seconds')
  const overlay = document.querySelector('#overlay')
  const overlayTime = document.querySelector('#time')
  const overlayClicks = document.querySelector('#clicks')
  const smileyFace = document.querySelector('#smiley-face')
  // const chooseLevel = document.querySelector('#level')
  
  // * Grid Variables
  const cells = []
  const width = 9
  const cellCount = width * width
  // eslint-disable-next-line prefer-const
  
  // * Game Variables
  // eslint-disable-next-line prefer-const
  let bombCount = 10 //this will need to be updated to link to width when size increases 
  let bombPosition = []
  let bombPositions = []
  const flagPositions = []
  let clickCount = 0
  let totalSeconds = 0
  
  let t




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
    cells.forEach((cell, i) => {
     
      const x = i % width   //this stops the cells going over the line below
      //these help to look for the cells around the cell am looking at
      const northWestCell = cells[i - width - 1]
      const northCell = cells[i - 9]
      const northEastCell = cells[i - width + 1]
      const westCell = cells[i - 1]
      const eastCell = cells[i + 1]
      const southWestCell = cells[i + width - 1]
      const southCell = cells[i + width]
      const southEastCell = cells[i + width + 1]
      
      // these check that the cell to the right / left actually exist 
      const westWall = x > 0
      const eastWall = x < width - 1
  
      // console.log('I am the cell', i) 
      let mineCount = 0
      if (!cell.hasAttributes('.bomb')) {
        // console.log(cell,'has bomb?', !cell.hasAttributes('.bomb'))
        if  (westWall && northWestCell && northWestCell.hasAttributes('.bomb')) ++mineCount
        if (northCell && northCell.hasAttributes('.bomb')) mineCount++
        if (eastWall && northEastCell && northEastCell.hasAttributes('.bomb')) mineCount++
        if (westWall && westCell && westCell.hasAttributes('.bomb')) mineCount++
        if (eastWall && eastCell && eastCell.hasAttributes('.bomb')) mineCount++
        if (westWall && southWestCell && southWestCell.hasAttributes('.bomb')) mineCount++
        if (southCell && southCell.hasAttributes('.bomb')) mineCount++
        if (eastWall && southEastCell && southEastCell.hasAttributes('.bomb')) mineCount++
        cell.textContent = mineCount
        // cell.textContent = hintNum > 0 ? hintNum : ''
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

  // function changeLevel() {
  //   console.log(chooseLevel.value)
  //   if (chooseLevel.value === 'intermediate') {
  //     width = 16
  //     bombCount = 40
  //     cells = []
  //     createCells()
  //     console.log(cells)
  //     positionBombs()
  //     positionHints()
  //   }
  // }



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
    // smileyFace = ('src','/assets/shocked_face.png') //!COME BACK TO THIS WANT THE FACE TO CHANGE ON CLICK
    const cell = event.target
    const i = cells.indexOf(cell)
    clickCount += 1
    clickCounter.textContent = clickCount
    
    // this is for if click on a cell with a number in  
    if (cell.textContent > '0')  {
      cell.classList.remove('cover') 
      console.log('removing one cell')
      // winGame()
    }
    if (cell.textContent === '0' ) {
      findAdjCells()
    }
    // if (cells[i + 1].textContent === '0') {
    //   findAdjCells()
    // }

  }
  
  function findAdjCells() {
    const adjCells = []


    const i = cells.indexOf(event.target)
    const x = i % width
    const northWestCell = cells[i - width - 1]
    const northCell = cells[i - 9]
    const northEastCell = cells[i - width + 1]
    const westCell = cells[i - 1]
    const eastCell = cells[i + 1]
    const southWestCell = cells[i + width - 1]
    const southCell = cells[i + width]
    const southEastCell = cells[i + width + 1]
      
    const westWall = x > 0
    const eastWall = x < width - 1
    // ! This code is repeated from position hints - think how to refactor
    
    
    if  (westWall && northWestCell && !northWestCell.classList.contains('bomb')) adjCells.push(i - width - 1)
    if (northCell && !northCell.classList.contains('bomb'))  adjCells.push(i - width)
    if (eastWall && northEastCell && !northEastCell.classList.contains('bomb')) adjCells.push(i - width + 1)
    if (westWall && westCell && !westCell.classList.contains('bomb')) adjCells.push(i - 1)
    if (eastWall && eastCell && !eastCell.classList.contains('bomb')) adjCells.push(i + 1)
    if (westWall && southWestCell && !southWestCell.classList.contains('bomb')) adjCells.push(i + 8)
    if (southCell && !southCell.classList.contains('bomb')) adjCells.push(i + 9)
    if (eastWall && southEastCell && !southEastCell.classList.contains('bomb')) adjCells.push(i + 10)
    
    cells[i].classList.remove('cover') 
    cells[i].textContent = ''

    adjCells.forEach(i => {
      cells[i].classList.remove('cover')
      if (cells[i].textContent === '0') cells[i].textContent = ''
    })
    console.log(adjCells)
  }
   
  

  // -------------------------- Add Flag on Right Click -------------------------------------
  function addFlag(event) {
    event.preventDefault()
    const cell = event.target
    flagPositions.push(cells.indexOf(event.target))
    
    console.log(flagPositions)
    cell.classList.toggle('flag')
    bombCounter.textContent -= 1
    // if (!cell.hasAttributes('.flag')) {
    //   cell.classList.remove(flag)
    //   bombCounter.textContent += 1
    // } else {
    //   cell.classList.add('flag')
    //   bombCounter.textContent -= 1
    // }
 

    clickCount += 1
    clickCounter.textContent = clickCount
  }
 




  // ! NEED TO CHANGE NOTHING IS HAPPENING 
  // function handleMouseEnter(event) {
  //   console.log('mouse has entered the box')
  //   const img = document.createElement('img')
  //   img.setAttribute('src', 'assets/shocked_face.png')
  //   document.getElementById('smiley-face').appendChild(img)
  // }
  // function handleMouseLeave() {
  //   console.log('mouse has left the box')
  //   // nameSpan.textContent = ''
  // }
  
  
  
  
  function gameOver() {
    if (event.target.classList.contains('bomb')) {
      clearInterval(t)
      // event.target.style.visibility = 'visible'


      // const bombGif = document.createElement('img')
      // bombGif.setAttribute('src', 'assets/bomb2.gif')
      // bombGif.setAttribute('width', '500')
      // background-size: contain; //! CAN I DO THIS ON JAVSCRIPT? HOW CAN I MOVE THE GIF TO THE LEFT??
      // document.querySelector('.grid').appendChild(bombGif)
      // event.target.appendChild(bombGif)



      // setTimeout((event.target.removeChild(bombGif)), 2000 )
      
      // cells.forEach(delayLoop(display, 1000));
     
      // const delayLoop = (fn, delay) => {
      //   return (x, i) => {
      //     setTimeout(() => {
      //       fn(x)
      //     }, i * 1000)
      //   }
      // }

      cells.filter(cell => {
        if (cell.classList.contains('bomb')) cell.classList.remove('cover', 'flag')
      })
      cells.forEach(cell => cell.removeEventListener('click', revealCell))
      cells.forEach(cell => cell.removeEventListener('contextmenu', addFlag))
      cells.forEach(cell => cell.removeEventListener('click', findAdjCells))
    }
  }
  
  
  function winGame() {
    if (bombPositions.sort().join(',') === flagPositions.sort().join(',')) {
      console.log('won')
      setTimeout(gameStats, 1000)
    }
  }
  


  // Show statistics of the user's performance after the game is finished
  function gameStats(){
    overlay.style.display = 'block'
    overlayTime.textContent = ` ${minutesLabel.textContent}:${secondsLabel.textContent}`
    overlayClicks.textContent = ` ${clickCounter.textContent}`
  }
  
  function overlayOff() {
    overlay.style.display = 'none'
  }



  // ------------------------------ Reset the Game -------------------------------------------
  function resetGame() {
    // console.log('the reset button was clicked')
    // cells.forEach(cell => cell.classList.remove('bomb', 'flag'))
    // cells.forEach(cell => cell.textContent = '')
    // positionBombs()
    // positionHints()
    // coverGrid()
    location.reload()
    // overlay.style.display = 'none'
  }





  createCells()
  // *------------------------------ Event Listeners -----------------------------------------
  window.addEventListener('load', positionBombs)
  window.addEventListener('load', positionHints)
  window.addEventListener('load', coverGrid)

  // chooseLevel.addEventListener('change',positionBombs)
  // chooseLevel.addEventListener('change', changeLevel)
  // smileyFace.addEventListener('mouseenter', handleMouseEnter)
  // smileyFace.addEventListener('mouseleave', handleMouseLeave)

  cells.forEach(cell => cell.addEventListener('click', gameOver))
  cells.forEach(cell => cell.addEventListener('click', revealCell))
  cells.forEach(cell => cell.addEventListener('contextmenu', addFlag))
  // cells.forEach(cell => cell.addEventListener('click', findAdjCells))
  cells.forEach(cell => cell.addEventListener('click', winGame))
  cells.forEach(cell => cell.addEventListener('contextmenu', winGame))
  resetBtn.addEventListener('click', resetGame)
  newGameBtn.addEventListener('click', resetGame)


  overlay.addEventListener('click', overlayOff)
}
window.addEventListener('DOMContentLoaded', init)