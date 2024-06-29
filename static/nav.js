// Add event listener to form submission
document.getElementById('recipe-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Show loading animation
    const loadingAnimation = document.getElementById('loading-animation');
    loadingAnimation.style.display = 'block';

    // Get form data including recipe type and extra details
    const formData = new FormData(this);
    const recipeType = formData.get('recipeType');
    const extraDetails = formData.get('extraDetails');

    // Append recipe type and extra details to the search parameters
    formData.append('recipeType', recipeType);
    formData.append('extraDetails', extraDetails);
    const searchParams = new URLSearchParams(formData).toString();

    // Send form data to server
    const response = await fetch('/generate_recipe', {
        method: 'POST',
        body: searchParams,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    // Hide loading animation
    loadingAnimation.style.display = 'none';

    // Handle the response
    if (response.ok) {
        // Get the generated recipe text
        const recipeText = await response.text();

        // Update the recipe-output div with the generated recipe
        const recipeOutput = document.getElementById('recipe-output');
        recipeOutput.innerHTML = `<h2>Generated Recipe</h2>`;

        // Split the recipe text into lines
        const lines = recipeText.split(/\n/);

        // Track whether we're currently in an important section
        let isInImportantSection = false;

        // Iterate over each line and format it appropriately
        lines.forEach(line => {
            // Skip empty lines
            if (line.trim() !== '') {
                // Check if the line indicates the start of an important section
                if (line.startsWith('* **') && line.endsWith('**')) {
                    isInImportantSection = true;
                    // Remove stars and bold formatting
                    line = line.replace(/\*|\*\*/g, '').trim();
                    // Add a header for the section
                    recipeOutput.innerHTML += `<h3>${line}</h3>`;
                } else if (line.startsWith('*')) {
                    // Remove stars and add as bullet point
                    line = line.replace(/\*/g, '').trim();
                    // Add the line as a bullet point
                    recipeOutput.innerHTML += `<p>&bull; ${line}</p>`;
                } else {
                    // If not in an important section, add as regular text
                    if (!isInImportantSection) {
                        recipeOutput.innerHTML += `<p>${line}</p>`;
                    }
                }
            } else {
                // If the line is empty, reset the flag for important sections
                isInImportantSection = false;
            }
        });
    } else {
        // Display an error message if response is not OK
        const errorMessage = await response.text();
        alert('Error: ' + errorMessage);
    }
});


