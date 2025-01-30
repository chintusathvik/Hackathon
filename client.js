document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const summarizeBtn = document.getElementById('summarize-btn');
    const summaryText = document.getElementById('summary-text');

    summarizeBtn.addEventListener('click', async () => {
        const text = inputText.value;
        if (text.trim() === '') {
            alert('Please enter some text to summarize.');
            return;
        }

        summarizeBtn.disabled = true;
        summarizeBtn.textContent = 'Searching...';

        try {
            const response = await fetch('http://127.0.0.1:5500/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to summarize text');
            }

            const data = await response.json();
            summaryText.textContent = data.summary;
        } catch (error) {
            console.error('Error:', error);
            summaryText.textContent = 'An error occurred while summarizing the text.';
        } finally {
            summarizeBtn.disabled = false;
            summarizeBtn.textContent = 'Search';
        }
    });

}); 
