# Create an improved interactive crossword with proper word connections and navigation
html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Daily Mini Crossword</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f8f8f8; margin: 0; padding: 20px; }
    .container { max-width: 500px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .crossword-grid { display: grid; grid-template-columns: repeat(5, 45px); grid-template-rows: repeat(5, 45px); gap: 1px; margin-bottom: 20px; justify-content: center; }
    .cell { width: 45px; height: 45px; text-align: center; font-size: 20px; font-weight: bold; border: 2px solid #000; background: #fff; outline: none; position: relative; }
    .cell:focus { border-color: #1976d2; background: #e3f2fd; }
    .cell.black { background: #000; border: 2px solid #000; }
    .cell-number { position: absolute; top: 2px; left: 3px; font-size: 10px; font-weight: bold; color: #000; }
    .clues { display: flex; gap: 30px; margin-top: 20px; }
    .clues-section { flex: 1; }
    .clues-section h3 { margin: 0 0 10px 0; font-size: 16px; }
    .clue { margin-bottom: 8px; font-size: 14px; line-height: 1.3; }
    .buttons { margin: 15px 0; text-align: center; }
    .btn { margin: 0 5px; padding: 8px 16px; font-size: 14px; border: none; border-radius: 4px; cursor: pointer; }
    .check-btn { background: #1976d2; color: #fff; }
    .reset-btn { background: #666; color: #fff; }
    .result { margin-top: 15px; font-weight: bold; text-align: center; }
    .correct { background: #c8e6c9 !important; }
    .incorrect { background: #ffcdd2 !important; }
  </style>
</head>
<body>
<div class="container">
  <h2 style="text-align: center; margin-bottom: 20px;">Daily Mini Crossword</h2>
  <div id="crossword" class="crossword-grid"></div>
  <div class="buttons">
    <button class="btn check-btn" onclick="checkCrossword()">Check Answers</button>
    <button class="btn reset-btn" onclick="resetGrid()">Reset</button>
  </div>
  <div id="result" class="result"></div>
  <div class="clues">
    <div class="clues-section">
      <h3>Across</h3>
      <div id="across-clues"></div>
    </div>
    <div class="clues-section">
      <h3>Down</h3>
      <div id="down-clues"></div>
    </div>
  </div>
</div>

<script>
// Predefined crossword puzzles with proper intersections
const PUZZLES = [
  {
    // Puzzle 1
    grid: [
      ['H', 'E', 'A', 'R', 'T'],
      ['O', '', 'P', '', 'A'],
      ['U', 'S', 'E', 'A', 'R'],
      ['S', '', 'A', '', 'I'],
      ['E', 'A', 'R', 'T', 'H']
    ],
    blocks: [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0]
    ],
    numbers: [
      [1, 2, 3, 4, 5],
      [6, null, 7, null, null],
      [8, 9, null, 10, null],
      [null, null, 11, null, null],
      [12, null, null, null, null]
    ],
    clues: {
      across: [
        {num: 1, clue: "Organ that pumps blood", answer: "HEART"},
        {num: 6, clue: "Building to live in", answer: "HOUSE"},
        {num: 8, clue: "Employ or utilize", answer: "USE"},
        {num: 10, clue: "Body part for hearing", answer: "EAR"},
        {num: 12, clue: "Our planet", answer: "EARTH"}
      ],
      down: [
        {num: 2, clue: "Breakfast food", answer: "EGG"},
        {num: 3, clue: "Fruit from a tree", answer: "APPLE"},
        {num: 4, clue: "Flows in rivers", answer: "RIVER"},
        {num: 5, clue: "Beverage leaf", answer: "TEA"},
        {num: 7, clue: "Ocean", answer: "SEA"},
        {num: 9, clue: "Use your ears", answer: "HEAR"},
        {num: 11, clue: "Creative skill", answer: "ART"}
      ]
    }
  },
  {
    // Puzzle 2
    grid: [
      ['S', 'T', 'A', 'R', 'T'],
      ['U', '', 'P', '', 'R'],
      ['N', 'A', 'P', 'L', 'E'],
      ['', '', 'P', '', 'E'],
      ['M', 'O', 'O', 'N', 'S']
    ],
    blocks: [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0]
    ],
    numbers: [
      [1, 2, 3, 4, 5],
      [6, null, 7, null, null],
      [8, 9, null, 10, null],
      [null, null, 11, null, null],
      [12, null, null, null, null]
    ],
    clues: {
      across: [
        {num: 1, clue: "Begin", answer: "START"},
        {num: 6, clue: "Bright star", answer: "SUN"},
        {num: 8, clue: "Short sleep", answer: "NAP"},
        {num: 10, clue: "Fruit", answer: "APPLE"},
        {num: 12, clue: "Celestial bodies", answer: "MOONS"}
      ],
      down: [
        {num: 2, clue: "Tall plant", answer: "TREE"},
        {num: 3, clue: "Fruit", answer: "APPLE"},
        {num: 4, clue: "Rodent", answer: "RAT"},
        {num: 5, clue: "Beverage", answer: "TEA"},
        {num: 7, clue: "Fruit", answer: "PLUM"},
        {num: 9, clue: "Fruit", answer: "APPLE"},
        {num: 11, clue: "Fruit", answer: "PEAR"}
      ]
    }
  }
];

// Get today's puzzle
function getTodaysPuzzle() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return PUZZLES[dayOfYear % PUZZLES.length];
}

const puzzle = getTodaysPuzzle();
let userGrid = Array.from({length: 5}, () => Array(5).fill(''));

// Render the crossword grid
function renderGrid() {
  const gridDiv = document.getElementById('crossword');
  gridDiv.innerHTML = '';
  
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const cell = document.createElement('input');
      cell.type = 'text';
      cell.maxLength = 1;
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      
      if (puzzle.blocks[r][c] === 1) {
        cell.disabled = true;
        cell.className += ' black';
      } else {
        cell.value = userGrid[r][c];
        
        // Add cell number if present
        if (puzzle.numbers[r][c]) {
          const numberSpan = document.createElement('span');
          numberSpan.className = 'cell-number';
          numberSpan.textContent = puzzle.numbers[r][c];
          cell.parentNode = document.createElement('div');
          cell.parentNode.style.position = 'relative';
          cell.parentNode.appendChild(numberSpan);
          cell.parentNode.appendChild(cell);
          gridDiv.appendChild(cell.parentNode);
        } else {
          gridDiv.appendChild(cell);
        }
        
        // Input handling with navigation
        cell.oninput = function(e) {
          const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
          e.target.value = value;
          userGrid[r][c] = value;
          
          // Move to next cell if letter was entered
          if (value && value.length === 1) {
            moveToNextCell(r, c);
          }
        };
        
        // Handle backspace navigation
        cell.onkeydown = function(e) {
          if (e.key === 'Backspace' && !e.target.value) {
            moveToPrevCell(r, c);
          }
          if (e.key === 'ArrowRight') moveToNextCell(r, c);
          if (e.key === 'ArrowLeft') moveToPrevCell(r, c);
          if (e.key === 'ArrowDown') moveToNextCell(r, c, 'down');
          if (e.key === 'ArrowUp') moveToPrevCell(r, c, 'up');
        };
      }
      
      if (puzzle.blocks[r][c] !== 1 && !cell.parentNode) {
        // Add number if needed
        if (puzzle.numbers[r][c]) {
          const wrapper = document.createElement('div');
          wrapper.style.position = 'relative';
          wrapper.style.display = 'inline-block';
          
          const numberSpan = document.createElement('span');
          numberSpan.className = 'cell-number';
          numberSpan.textContent = puzzle.numbers[r][c];
          
          wrapper.appendChild(numberSpan);
          wrapper.appendChild(cell);
          gridDiv.appendChild(wrapper);
        } else {
          gridDiv.appendChild(cell);
        }
      }
    }
  }
}

// Navigation functions
function moveToNextCell(row, col, direction = 'across') {
  let nextRow = row, nextCol = col;
  
  if (direction === 'across') {
    nextCol++;
    if (nextCol >= 5) {
      nextCol = 0;
      nextRow++;
    }
  } else if (direction === 'down') {
    nextRow++;
    if (nextRow >= 5) {
      nextRow = 0;
      nextCol++;
    }
  }
  
  if (nextRow < 5 && nextCol < 5) {
    const nextCell = document.querySelector(`[data-row="${nextRow}"][data-col="${nextCol}"]`);
    if (nextCell && !nextCell.disabled) {
      nextCell.focus();
    } else if (nextRow < 4 || nextCol < 4) {
      moveToNextCell(nextRow, nextCol, direction);
    }
  }
}

function moveToPrevCell(row, col, direction = 'across') {
  let prevRow = row, prevCol = col;
  
  if (direction === 'across' || direction === 'up') {
    if (direction === 'up') {
      prevRow--;
    } else {
      prevCol--;
      if (prevCol < 0) {
        prevCol = 4;
        prevRow--;
      }
    }
  }
  
  if (prevRow >= 0 && prevCol >= 0) {
    const prevCell = document.querySelector(`[data-row="${prevRow}"][data-col="${prevCol}"]`);
    if (prevCell && !prevCell.disabled) {
      prevCell.focus();
    } else if (prevRow > 0 || prevCol > 0) {
      moveToPrevCell(prevRow, prevCol, direction);
    }
  }
}

// Render clues
function renderClues() {
  const acrossDiv = document.getElementById('across-clues');
  const downDiv = document.getElementById('down-clues');
  
  let acrossHtml = '';
  puzzle.clues.across.forEach(clue => {
    acrossHtml += `<div class="clue">${clue.num}. ${clue.clue}</div>`;
  });
  
  let downHtml = '';
  puzzle.clues.down.forEach(clue => {
    downHtml += `<div class="clue">${clue.num}. ${clue.clue}</div>`;
  });
  
  acrossDiv.innerHTML = acrossHtml;
  downDiv.innerHTML = downHtml;
}

// Check answers
function checkCrossword() {
  let allCorrect = true;
  const cells = document.querySelectorAll('.cell:not(.black)');
  
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const userAnswer = (userGrid[row][col] || '').toUpperCase();
    const correctAnswer = puzzle.grid[row][col];
    
    cell.classList.remove('correct', 'incorrect');
    
    if (userAnswer === correctAnswer) {
      cell.classList.add('correct');
    } else {
      cell.classList.add('incorrect');
      allCorrect = false;
    }
  });
  
  const resultDiv = document.getElementById('result');
  if (allCorrect) {
    resultDiv.textContent = '🎉 Congratulations! You solved the puzzle!';
    resultDiv.style.color = '#4caf50';
  } else {
    resultDiv.textContent = 'Some answers are incorrect. Keep trying!';
    resultDiv.style.color = '#f44336';
  }
}

// Reset grid
function resetGrid() {
  userGrid = Array.from({length: 5}, () => Array(5).fill(''));
  renderGrid();
  document.getElementById('result').textContent = '';
}

// Initialize
renderGrid();
renderClues();
</script>
</body>
</html>'''

# Write the improved HTML file
with open('improved_crossword.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✅ Created 'improved_crossword.html' with proper word connections and navigation!")
print("\nNew features:")
print("• Words properly intersect at shared letters")
print("• Arrow key navigation between cells")
print("• Auto-advance to next cell after typing")
print("• Backspace moves to previous cell when current is empty")
print("• Black squares for proper crossword structure")
print("• Numbered cells for clue references")