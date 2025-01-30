import express from 'express';
import path from 'path';
import axios from 'axios'; // For making HTTP requests

const app = express();


app.use(express.json());


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to interact with the Groq model API
app.post('/summarize', async (req, res) => {
    try {
        const { text } = req.body; // Receive the text to summarize

        if (!text) {
            return res.status(400).json({ error: 'No text provided for summarization.' });
        }

        // Groq API URL
        const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions'; // New API endpoint
        
        // Groq API key
        const apiKey = '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';

        if (!apiKey) {
            return res.status(500).json({ error: 'API key is missing or incorrect.' });
        }

        const response = await axios.post(groqApiUrl, {
            messages: [
                { role: 'system', content: 'You are an assistant who manages all subjects' },
                { role: 'user', content: text } // User message with the text
            ],
            model: 'llama3-70b-8192',
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`, // API key or token
                'Content-Type': 'application/json',
            },
        });

        
        const summary = response.data.choices[0].message.content;

        if (!summary) {
            return res.status(500).json({ error: 'No summary returned from the model.' });
        }

        
        res.json({ summary });
    } catch (error) {
        console.error('Error during model inference:', error);
        if (error.response) {
            console.error('API Response error:', error.response.data);
            res.status(500).json({ error: 'Error from Groq API.' });
        } else {
            res.status(500).json({ error: 'An unknown error occurred.' });
        }
    }
});

const PORT = 5500;

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
});