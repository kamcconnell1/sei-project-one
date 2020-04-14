function init() {

  // * DOM Elements
  const grid = document.querySelector('.grid')
  const cells = []
  const resetBtn = document.querySelectorAll('#reset')
  const bombCounter = document.querySelector('#bomb-count')
  const clickCounter = document.querySelector('#click-count')
  const minutesLabel = document.querySelector('#minutes')
  const secondsLabel = document.querySelector('#seconds')
  const overlay = document.querySelector('#overlay')
  
  
  // * Grid Variables
  const width = 9
  const cellCount = width * width
  const bombCount = 2 //this will need to be updated to link to width when size increases 
  
  // * Game Variables
  let bombPosition = []
  let bombPositions = []
  const flagPositions = []
  let hintNum = 0
  let clickCount = 0
  let totalSeconds = 0
  







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
      // console.log('I am the cell', cell.textContent) 
      const x = i % width
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
        hintNum = value.reduce((a, b) => {
          return a + parseInt(b)
        }, 0)

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

  // -------------------------- Timer ----------------------------------------
  
  // Help on how to add the timer taken from here 
  // https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
  setInterval(setTime, 1000)

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


  // -------------------------- Reveal Cell on Click ----------------------------------------
  function revealCell(event) {
    winGame()
    clickCount += 1
    clickCounter.textContent = clickCount
    // console.log(`just clicked ${event.target.textContent}`)
    if (!event.target.textContent > 0) {
      const i = (cells.indexOf(event.target)) 
      const x = i % width
      cells[i].classList.remove('cover')
      if (x > 0 && cells[i - 10] && !cells[i - 10].textContent > 0) cells[i - 10].classList.remove('cover')
      if (cells[i - 9] && !cells[i - 9].textContent > 0) cells[i - 9].classList.remove('cover')
      if (x < width - 1 && cells[i - 8] && !cells[i - 8].textContent > 0) cells[i - 8].classList.remove('cover')
      if (x > 0 && cells[i - 1] && !cells[i - 1].textContent > 0) cells[i - 1].classList.remove('cover')
      if (x < width - 1 && cells[i + 1] && !cells[i + 1].textContent > 0) cells[i + 1].classList.remove('cover')
      if (x > 0 && cells[i + 8] && !cells[i + 8].textContent > 0) cells[i + 8].classList.remove('cover')
      if (cells[i + 9] && !cells[i + 9].textContent > 0) cells[i + 9].classList.remove('cover')
      if (x < width - 1 && cells[i + 10] && !cells[i + 10].textContent > 0) cells[i + 10].classList.remove('cover')
 
      
    } else {
      event.target.classList.remove('cover')
    }
  }

  function gameOver(event) {
    if (event.target.classList.contains('bomb')) {
      cells.filter(cell => {
        if (cell.classList.contains('bomb')) cell.classList.remove('cover', 'flag')
      })
      cells.forEach(cell => cell.removeEventListener('click', revealCell))
      cells.forEach(cell => cell.removeEventListener('contextmenu', addFlag))
      clearInterval(setTime)
    }
  }

  function winGame() {
    if (bombPositions.sort().join(',') === flagPositions.sort().join(',')) gameStats()
  }
  
  // function findAdjCells(event) {
  //   const adjCells = []
  //   const i = (cells.indexOf(event.target)) 
  //   const x = i % width
  //   cells[i].classList.remove('cover')
  //   if (x > 0 && cells[i - 10] && !cells[i - 10].textContent > 0) adjCells.push(i - 10)
  //   if (cells[i - 9] && !cells[i - 9].textContent > 0) adjCells.push(i - 9)
  //   if (x < width - 1 && cells[i - 8] && !cells[i - 8].textContent > 0) adjCells.push(i - 8)
  //   if (x > 0 && cells[i - 1] && !cells[i - 1].textContent > 0) adjCells.push(i - 1)
  //   if (x < width - 1 && cells[i + 1] && !cells[i + 1].textContent > 0) adjCells.push(i + 1)
  //   if (x > 0 && cells[i + 8] && !cells[i + 8].textContent > 0) adjCells.push(i + 8)
  //   if (cells[i + 9] && !cells[i + 9].textContent > 0) adjCells.push(i + 9)
  //   if (x < width - 1 && cells[i + 10] && !cells[i + 10].textContent > 0) adjCells.push(i + 10)
  //   console.log(adjCells)
  // console.log(cells[adjCells])
    
   
  

  //   cells = cells.filter(item => {
  //     return adjCells.includes(item)
  //   })
  //   console.log(cells)
    
    

  // adjCells.forEach((cells, i) => cells[i].classList.remove('cover)'))

  // }

  // -------------------------- Add Flag on Right Click -------------------------------------
  function addFlag(event) {
    event.preventDefault()
    event.target.classList.add('flag')
    flagPositions.push(cells.indexOf(event.target))
    console.log(flagPositions)
    

    clickCount += 1
    bombCounter.textContent -= 1
    clickCounter.textContent = clickCount
  }


  // Show statistics of the user's performance after the game is finished
  function gameStats(){
    overlay.style.display = 'block'
    
  }
  
  function overlayOff() {
    overlay.style.display = 'none'
  }

  // document.body.style.background = 'white'
  // document.body.innerHTML = 
  // `<div class="container center">
  //     <h1>Congratulations! You Won!</h1> 
  //     <p>With ${clickCounter} Moves</p>
  //     <p>Finished in ${minutesLabel.textContent} : ${secondsLabel.textContent}</p>
  //     <p>Wooooooooo!</p>
  //     <button class="btn reset" type="submit">Play again</button>
  // </div>`
  






  // ------------------------------ Reset the Game -------------------------------------------
  function resetGame() {
    // console.log('the reset button was clicked')
    // cells.forEach(cell => cell.classList.remove('bomb', 'flag'))
    // cells.forEach(cell => cell.textContent = '')
    // positionBombs()
    // positionHints()
    // coverGrid()
    location.reload()
  }




  createCells()
  // *------------------------------ Event Listeners -----------------------------------------
  window.addEventListener('load', positionBombs)
  window.addEventListener('load', positionHints)
  window.addEventListener('load', coverGrid)
  cells.forEach(cell => cell.addEventListener('click', gameOver))
  cells.forEach(cell => cell.addEventListener('click', revealCell))
  cells.forEach(cell => cell.addEventListener('contextmenu', addFlag))
  // cells.forEach(cell => cell.addEventListener('click', findAdjCells))
  resetBtn.forEach(btn => btn.addEventListener('click', resetGame))
  overlay.addEventListener('click', overlayOff)
}
window.addEventListener('DOMContentLoaded', init)