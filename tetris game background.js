// home.js

// Create random falling blocks every second
function createFallingBlocks() {
    const blockContainer = document.querySelector('.falling-blocks');
  
    // Generate a new block every second
    setInterval(() => {
      const block = document.createElement('div');
      block.classList.add('block');
  
      // Randomize the horizontal position of the block
      block.style.left = `${Math.random() * 100}vw`; // Random position between 0 and 100% of the viewport width
  
      // Append the block to the container
      blockContainer.appendChild(block);
  
      // Remove the block after it falls off the screen
      setTimeout(() => {
        block.remove();
      }, 5000); // Matches the duration of the fall animation
    }, 500); // Create a block every half second
  }
  
  // Initialize falling blocks
  createFallingBlocks();
  